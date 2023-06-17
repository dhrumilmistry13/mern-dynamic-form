const crypto = require('crypto');
const moment = require('moment');

const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const jwt = require('../../../middleware/jwt.helper');
const common = require('../../../helpers/common.helper');
const { sendEmail } = require('../../../helpers/email.helper');

class AdminAuthController {
  constructor() {
    this.adminLogin = this.adminLogin.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
  }

  /**
   * @name generateAccessToken
   * @description Generate access token and store in user details.
   * @param {object} userData
   * @returns {object} isSaved, accessToken
   */
  async generateAccessToken(user) {
    const payload = jwt.generateUserTokenPayload(user);
    const accessToken = await jwt.accessToken(payload);
    const isSaved = true;
    return { isSaved, accessToken };
  }

  /**
   * @name adminLogin
   * @description For Login Check.
   * @param req,res
   * @returns {Json} success
   */
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const userInfo = await models.Users.scope('withSecretColumns').findOne({
        where: { email, user_type: 1, account_type: 1 },
      });
      /** **************Login Credentials Check ************ */
      if (userInfo) {
        const reqPass = crypto
          .createHash('md5')
          .update(password || '')
          .digest('hex');
        if (reqPass !== userInfo.password) {
          throw new Error('admin.backend_login_password_incorrect');
        }

        const isTokenGenerated = await this.generateAccessToken(userInfo);
        if (!isTokenGenerated.isSaved) {
          throw new Error('admin.backend_login_faild');
        }
        const userData = await common.getUserDataById(userInfo.user_id);
        return response.successResponse(
          req,
          res,
          'admin.backend_login_succss',
          {
            accessToken: isTokenGenerated.accessToken,
            is_email_verified: true,
            user_data: userData,
          },
          200
        );
      }
      throw new Error('admin.backend_login_details_not_found');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name sendEmailOTP
   * @description Send OTP to Email.
   * @param {object} user
   * @param {string} email
   * @returns success isEmailSent
   */
  async sendEmailOTP(user, template) {
    const otp = user.email_otp;

    const isEmailSent = await sendEmail({
      to: user.email,
      template,
      replacements: {
        FIRSTNAME: `${user.first_name}`,
        OTP_CODE: otp,
      },
    });
    return isEmailSent;
  }

  /**
   * @name forgotPassword
   * @description User Forgot password send otp mail to entered email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await models.Users.findOne({
        where: {
          email,
          user_type: 1,
        },
      });

      if (!user) {
        throw new Error('admin.backend_email_not_found');
      }

      const resetToken = Buffer.from(user.user_id.toString()).toString(
        'base64'
      );
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      user.email_otp = reset_pin;
      user.otp_expire_time = new Date();
      const isSaved = await user.save();

      if (!isSaved) {
        throw new Error('admin.backend_forgot_password_fail_send_mail');
      }

      // Send an email
      const isEmailSent = await this.sendEmailOTP(
        user,
        'telepath-forget-password'
      );
      if (!isEmailSent) {
        throw new Error('admin.backend_forgot_password_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.backend_forgot_password_mail_send',
        {
          reset_token: resetToken,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name resendOTP
   * @description Resend OTP to User Email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async resendOTP(req, res) {
    try {
      const { encoded_token } = req.body;
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');
      const user = await models.Users.findOne({
        where: {
          user_id,
          user_type: 1,
        },
      });

      if (!user) {
        throw new Error('admin.auth_resend_otp_email_not_found');
      }

      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      user.email_otp = reset_pin;
      user.otp_expire_time = new Date();

      const isSaved = await user.save();
      if (!isSaved) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }

      const template = 'telepath-forget-resend-password';

      const isEmailSent = await this.sendEmailOTP(user, template);
      if (!isEmailSent) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.backend_resend_otp_mail_send',
        {
          reset_token: encoded_token,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name verifyForgotPassword
   * @description Verify Forgot password otp which is send in email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyForgotPassword(req, res) {
    try {
      const { encoded_token, verification_otp } = req.body;
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');

      const user = await models.Users.findOne({
        where: { email_otp: verification_otp, user_id, user_type: 1 },
      });
      if (!user) {
        throw new Error('admin.backend_forgot_password_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(user.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error(
          'admin.backend_forgot_password_verification_time_expire'
        );
      }
      const resetToken = Buffer.from(user.user_id.toString()).toString(
        'base64'
      );

      return response.successResponse(
        req,
        res,
        'admin.backend_otp_verified_success',
        {
          reset_token: resetToken,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name resetPassword
   * @description Reset new password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async resetPassword(req, res) {
    try {
      const { reset_token, new_password } = req.body;
      const user_id = Buffer.from(reset_token, 'base64').toString('ascii');
      const user = await models.Users.findOne({
        where: { user_id, user_type: 1 },
      });

      if (!user) {
        throw new Error('admin.backend_reset_password_fail');
      }

      const user_password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');

      user.password = user_password;
      user.reset_password_token = '';
      const isSaved = await user.save();
      if (!isSaved) {
        throw new Error('admin.backend_reset_password_fail');
      }
      return response.successResponse(
        req,
        res,
        'admin.backend_reset_password_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new AdminAuthController();
