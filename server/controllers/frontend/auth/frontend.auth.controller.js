const crypto = require('crypto');
const { Op } = require('sequelize');
const moment = require('moment');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const common = require('../../../helpers/common.helper');
const { sendEmail } = require('../../../helpers/email.helper');
const emailHelper = require('../../../helpers/email.helper');
const { getFolderConfig } = require('../../../config/upload.config');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');
const { organizationDataSync } = require('../../../helpers/dosespot.helper');

class UserAuthController {
  constructor() {
    this.organizationSignup = this.organizationSignup.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.organizationLogin = this.organizationLogin.bind(this);
    this.organizationForgotPassword =
      this.organizationForgotPassword.bind(this);
    this.organizationForgotResendOTP =
      this.organizationForgotResendOTP.bind(this);
    this.addnewOrganizationEmail = this.addnewOrganizationEmail.bind(this);
  }

  /**
   * @name sendEmailOTP
   * @description Send OTP to Email.
   * @param {object} organization
   * @param {string} email
   * @returns success isEmailSent
   */
  async sendEmailOTP(organizationData, template) {
    const otp = organizationData.email_otp;

    const isEmailSent = await sendEmail({
      to: organizationData.email,
      template,
      replacements: {
        FIRSTNAME: `${organizationData.first_name}`,
        OTP_CODE: otp,
      },
    });
    return isEmailSent;
  }

  /**
   * @name organizationSignup
   * @description Signup Organization.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async organizationSignup(req, res) {
    try {
      const { first_name, last_name, email, phone, country_id, password } =
        req.body;
      const organizationData = {
        first_name,
        last_name,
        email,
        phone,
        country_id,
        password,
        user_type: 2,
        profile_setup: 2,
      };

      /** ***Check Email Already Exists******* */
      const isEmailExists = await models.Users.findOne({
        where: { email, user_type: 2 },
      });
      if (isEmailExists) {
        throw new Error(
          'admin.organization_email_already_register_with_account'
        );
      }
      const encrypt_user_password = crypto
        .createHash('md5')
        .update(password || '')
        .digest('hex');
      organizationData.password = encrypt_user_password;
      const otp = common.generateUniqueId(6, 'NUMBER_ONLY');
      organizationData.email_otp = otp;
      organizationData.otp_expire_time = new Date();
      const organizationSignupData = await models.Users.create(
        organizationData
      );
      const encodedToken = Buffer.from(
        organizationSignupData.user_id.toString()
      ).toString('base64');
      const isEmailSent = await this.sendEmailOTP(
        organizationSignupData,
        'telepath-register-verify-email'
      );
      if (!isEmailSent) {
        throw new Error('admin.organization_signup_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_signup_success',
        {
          encodedToken,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name resendOTP
   * @description Resend OTP to Organization Email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async resendOTP(req, res) {
    try {
      const { encodedToken } = req.body;
      const user_id = Buffer.from(encodedToken, 'base64').toString('ascii');
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
          user_type: { [Op.in]: [2, 4] },
        },
      });
      if (!organizationData) {
        throw new Error('admin.organization_resend_otp_email_not_found');
      }
      if (organizationData) {
        const startDate = moment();
        const EndDate = moment(organizationData.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.organization_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      organizationData.email_otp = reset_pin;
      organizationData.otp_expire_time = new Date();
      const isSaved = await organizationData.save();

      if (!isSaved) {
        throw new Error('admin.organization_resend_otp_fail_send_mail');
      }
      const isEmailSent = await this.sendEmailOTP(
        organizationData,
        'telepath-resend-register-verify-email'
      );

      if (!isEmailSent) {
        throw new Error('admin.organization_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_resend_otp_mail_send',
        {
          encodedToken,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name verifyOTP
   * @description Verify otp which is send in email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyOTP(req, res) {
    try {
      const { encodedToken, verification_otp } = req.body;
      const user_id = Buffer.from(encodedToken, 'base64').toString('ascii');

      const organizationData = await models.Users.scope(
        'withSecretColumns'
      ).findOne({
        where: { email_otp: verification_otp, user_id, user_type: [2, 4] },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
          },
        ],
      });
      if (!organizationData) {
        throw new Error('admin.organization_otp_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(organizationData.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error('admin.organization_otp_verification_time_expire');
      }
      organizationData.is_email_verified = 1;
      const isSaved = await organizationData.save();

      if (!isSaved) {
        throw new Error('admin.organization_otp_verified_fail');
      }
      const isTokenGenerated = await common.generateAccessToken(
        organizationData
      );
      if (!isTokenGenerated.isSaved) {
        throw new Error('admin.organization_login_fail');
      }
      const userData = {
        profile_image: await organizationData.profile_image.then(
          (dataUrl) => dataUrl
        ),
        account_type: organizationData.account_type,
        user_type: organizationData.user_type,
        is_email_verified: organizationData.is_email_verified,
        is_fb_email_verify: organizationData.is_fb_email_verify,
        is_gmail_email_verify: organizationData.is_gmail_email_verify,
        admin_status: organizationData.admin_status,
        user_status: organizationData.user_status,
        profile_setup: organizationData.profile_setup,
        user_id: organizationData.user_id,
        first_name: organizationData.first_name,
        last_name: organizationData.last_name,
        email: organizationData.email,
        country_id: organizationData.country_id,
        timezone_id: organizationData.timezone_id,
        phone: organizationData.phone,
        dob: organizationData.dob,
        organation_id: organizationData.organation_id,
        facebook_id: organizationData.facebook_id,
        gmail_id: organizationData.gmail_id,
      };
      if (organizationData.organization_info) {
        userData.organization_info =
          organizationData.organization_info.dataValues;
        userData.organization_info.fill_step =
          organizationData.organization_info.fill_step;
        userData.organization_info =
          organizationData.organization_info.dataValues;
        userData.organization_info.header_logo =
          await organizationData.organization_info.header_logo.then(
            (dataUrl) => dataUrl
          );
        userData.organization_info.footer_logo =
          await organizationData.organization_info.footer_logo.then(
            (dataUrl) => dataUrl
          );
      } else {
        userData.organization_info = '';
      }
      const getCardData = await models.UserCards.findOne({
        where: { user_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getCancelSubscriptionData =
        await models.SubscriptionHistory.findOne({
          where: {
            user_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_otp_verified_success',
        {
          accessToken: isTokenGenerated.accessToken,
          userData,
          userSubscription: getSubscriptionData,
          userCancelSubscription: getCancelSubscriptionData,
          userCard: getCardData,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationLogin
   * @description Organization Login Check.
   * @param req,res
   * @returns {Json} success
   */

  async organizationLogin(req, res) {
    try {
      const { email, password } = req.body;
      const organizationInfo = await models.Users.scope(
        'withSecretColumns'
      ).findOne({
        where: {
          email,
          user_type: { [Op.in]: [2, 4, 5, 6] },
        },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
            require: false,
          },
          {
            model: models.Timezones,
            as: 'timezones',
          },
        ],
      });
      if (organizationInfo) {
        const reqPass = crypto
          .createHash('md5')
          .update(password || '')
          .digest('hex');
        if (reqPass !== organizationInfo.password) {
          let resetToken = '';
          let message = 'admin.organization_login_password_incorrect';
          organizationInfo.password_wrong_count =
            parseInt(organizationInfo.password_wrong_count, 10) + 1;
          if (organizationInfo.password_wrong_count >= 6) {
            organizationInfo.user_status = 3;
            resetToken = Buffer.from(
              organizationInfo.user_id.toString()
            ).toString('base64');
            const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
            organizationInfo.email_otp = reset_pin;
            organizationInfo.otp_expire_time = new Date();
            const isSaved = await organizationInfo.save();
            if (!isSaved) {
              throw new Error(
                'admin.organization_forgot_password_fail_send_mail'
              );
            }
            const isEmailSent = await this.sendEmailOTP(
              organizationInfo,
              'telepath-forget-password'
            );

            if (!isEmailSent) {
              throw new Error(
                'admin.organization_forgot_password_fail_send_mail'
              );
            }
            message = 'admin.organization_forgot_password_mail_send';
          }
          organizationInfo.save();
          return response.errorResponse(
            req,
            res,
            message,
            {
              is_password: 2,
              password_wrong_count: organizationInfo.password_wrong_count,
              resetToken,
            },
            402
          );
        }
        if (organizationInfo.admin_status === 2) {
          const key =
            organizationInfo.user_type === 2
              ? 'admin.organization_status_inactive_error'
              : 'admin.organization_staff_status_inactive_error';
          throw new Error(key);
        }
        if (organizationInfo.is_email_verified === 2) {
          const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
          organizationInfo.email_otp = reset_pin;
          organizationInfo.otp_expire_time = new Date();
          const isSaved = await organizationInfo.save();

          if (!isSaved) {
            throw new Error('admin.organization_resend_otp_fail_send_mail');
          }
          const isEmailSent = await this.sendEmailOTP(
            organizationInfo,
            'telepath-resend-register-verify-email'
          );

          if (!isEmailSent) {
            throw new Error('admin.organization_resend_otp_fail_send_mail');
          }
          const encodedToken = Buffer.from(
            organizationInfo.user_id.toString()
          ).toString('base64');
          return response.successResponse(
            req,
            res,
            'admin.organization_resend_otp_mail_send',
            {
              encodedToken,
              is_email_verified: 2,
            },
            200
          );
        }
        const isTokenGenerated = await common.generateAccessToken(
          organizationInfo
        );
        if (!isTokenGenerated.isSaved) {
          throw new Error('admin.organization_login_fail');
        }
        if (organizationInfo.user_status) {
          organizationInfo.user_status = 1;
          organizationInfo.user_reason = null;
          organizationInfo.save();
        }
        organizationInfo.password_wrong_count = 0;
        organizationInfo.save();

        const userData = {
          profile_image: await organizationInfo.profile_image.then(
            (dataUrl) => dataUrl
          ),
          account_type: organizationInfo.account_type,
          user_type: organizationInfo.user_type,
          is_email_verified: organizationInfo.is_email_verified,
          is_fb_email_verify: organizationInfo.is_fb_email_verify,
          is_gmail_email_verify: organizationInfo.is_gmail_email_verify,
          admin_status: organizationInfo.admin_status,
          user_status: organizationInfo.user_status,
          profile_setup: organizationInfo.profile_setup,
          user_id: organizationInfo.user_id,
          first_name: organizationInfo.first_name,
          last_name: organizationInfo.last_name,
          email: organizationInfo.email,
          country_id: organizationInfo.country_id,
          timezone_id: organizationInfo.timezone_id,
          phone: organizationInfo.phone,
          dob: organizationInfo.dob,
          organation_id: organizationInfo.organation_id,
          facebook_id: organizationInfo.facebook_id,
          gmail_id: organizationInfo.gmail_id,
        };
        if (organizationInfo.organization_info) {
          userData.organization_info =
            organizationInfo.organization_info.dataValues;
          userData.organization_info.fill_step =
            organizationInfo.organization_info.fill_step;
          userData.organization_info.header_logo =
            await organizationInfo.organization_info.header_logo.then(
              (dataUrl) => dataUrl
            );
          userData.organization_info.footer_logo =
            await organizationInfo.organization_info.footer_logo.then(
              (dataUrl) => dataUrl
            );
        } else {
          userData.organization_info = '';
        }
        if (organizationInfo.timezones) {
          userData.timezones = organizationInfo.timezones;
        } else {
          userData.timezones = '';
        }
        const getCancelSubscriptionData =
          await models.SubscriptionHistory.findOne({
            where: {
              user_id:
                organizationInfo.user_type === 2
                  ? organizationInfo.user_id
                  : organizationInfo.organation_id,
              payment_status: 1,
              subscription_status: 3,
            },
          });
        const getSubscriptionData = await models.SubscriptionHistory.findOne({
          where: {
            user_id:
              organizationInfo.user_type === 2
                ? organizationInfo.user_id
                : organizationInfo.organation_id,
            payment_status: 1,
            subscription_status: { [Op.or]: [2, 4] },
          },
        });
        const getCardData = await models.UserCards.findOne({
          where: {
            user_id:
              organizationInfo.user_type === 2
                ? organizationInfo.user_id
                : organizationInfo.organation_id,
            is_default: 1,
          },
          order: [['user_card_id', 'DESC']],
        });
        return setTimeout(() => {
          response.successResponse(
            req,
            res,
            'admin.organization_login_success',
            {
              accessToken: isTokenGenerated.accessToken,
              userData,
              userSubscription: getSubscriptionData,
              userCancelSubscription: getCancelSubscriptionData,
              userCard: getCardData,
            },
            200
          );
        }, 500);
      }
      throw new Error('admin.organization_login_details_not_found');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationForgotPassword
   * @description  Organization Forgot password send otp mail to entered email
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} Success
   */
  async organizationForgotPassword(req, res) {
    try {
      const { email } = req.body;
      const organizationData = await models.Users.findOne({
        where: {
          email,
          user_type: { [Op.in]: [2, 4] },
        },
      });
      if (!organizationData) {
        throw new Error('admin.organization_email_not_found');
      }
      const resetToken = Buffer.from(
        organizationData.user_id.toString()
      ).toString('base64');
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      organizationData.email_otp = reset_pin;
      organizationData.otp_expire_time = new Date();
      const isSaved = await organizationData.save();

      if (!isSaved) {
        throw new Error('admin.organization_forgot_password_fail_send_mail');
      }
      const isEmailSent = await this.sendEmailOTP(
        organizationData,
        'telepath-forget-password'
      );

      if (!isEmailSent) {
        throw new Error('admin.organization_forgot_password_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_forgot_password_mail_send',
        {
          resetToken,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationForgotresendOTP
   * @description Resend OTP to User Email For Forgot Password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationForgotResendOTP(req, res) {
    try {
      const { encoded_token } = req.body;
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');
      const organizationData = await models.Users.findOne({
        where: {
          user_id,
          user_type: { [Op.in]: [2, 4] },
        },
      });
      if (!organizationData) {
        throw new Error('admin.organization_resend_otp_email_not_found');
      }
      if (organizationData) {
        const startDate = moment();
        const EndDate = moment(organizationData.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.organization_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      organizationData.email_otp = reset_pin;
      organizationData.otp_expire_time = new Date();

      const isSaved = await organizationData.save();
      if (!isSaved) {
        throw new Error('admin.organization_resend_otp_fail_send_mail');
      }
      const template = 'telepath-forget-resend-password';
      const isEmailSent = await this.sendEmailOTP(organizationData, template);
      if (!isEmailSent) {
        throw new Error('admin.organization_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_resend_otp_mail_send',
        {
          encoded_token,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationVerifyForgotPassword
   * @description Verify Forgot password otp which is send in email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationVerifyForgotPassword(req, res) {
    try {
      const { encoded_token, verification_otp } = req.body;
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');

      const organizationData = await models.Users.findOne({
        where: { email_otp: verification_otp, user_id, user_type: [2, 4] },
      });
      if (!organizationData) {
        throw new Error('admin.organization_forgot_password_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(organizationData.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error(
          'admin.organization_forgot_password_verification_time_expire'
        );
      }
      if (organizationData.is_email_verified === 2) {
        organizationData.is_email_verified = 1;
        organizationData.save();
      }
      const resetToken = Buffer.from(
        organizationData.user_id.toString()
      ).toString('base64');
      return response.successResponse(
        req,
        res,
        'admin.organization_otp_verified_success',
        {
          resetToken,
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationResetPassword
   * @description Organization Reset new password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationResetPassword(req, res) {
    try {
      const { reset_token, new_password } = req.body;
      const user_id = Buffer.from(reset_token, 'base64').toString('ascii');
      const organizationData = await models.Users.findOne({
        where: { user_id, user_type: [2, 4] },
      });
      if (!organizationData) {
        throw new Error('admin.organization_reset_password_fail');
      }
      const user_password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');
      organizationData.password = user_password;
      organizationData.reset_password_token = '';
      organizationData.password_wrong_count = 0;
      const isSaved = await organizationData.save();
      if (!isSaved) {
        throw new Error('admin.organization_reset_password_fail');
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_reset_password_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationSetPassword
   * @description Organization Set new password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSetPassword(req, res) {
    try {
      const { user_id, new_password, timezone } = req.body;
      const organizationData = await models.Users.scope(
        'withSecretColumns'
      ).findOne({
        where: { user_id, user_type: { [Op.in]: [2, 4, 5, 6] } },
      });
      if (!organizationData) {
        throw new Error('admin.organization_reset_password_fail');
      }

      const user_password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');
      if (organizationData.password !== null) {
        throw new Error('admin.organization_reset_password_already_set');
      }
      organizationData.password = user_password;
      organizationData.is_email_verified = 1;
      const isSaved = await organizationData.save();
      if (!isSaved) {
        throw new Error('admin.organization_reset_password_fail');
      }
      let timezoneData = await models.Timezones.findOne({
        where: {
          utc: {
            [Op.like]: `%${timezone}%`,
          },
        },
      });
      if (timezoneData) {
        timezoneData = await models.Timezones.findOne({
          where: {
            title: {
              [Op.like]: `%${timezoneData.title}%`,
            },
          },
          group: [['title']],
        });
        await models.Users.update(
          {
            timezone_id: timezoneData.timezone_id,
          },
          {
            where: {
              user_id,
            },
          }
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_reset_password_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getUserProfle
   * @description get User Details API
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getUserProfle(req, res) {
    try {
      const { user_id, organization_id } = req.payload.user;
      const getuserData = await await models.Users.scope(
        'withUserTypeColumns'
      ).findOne({
        where: {
          user_id,
          user_type: { [Op.in]: [2, 4] },
        },
        include: [
          {
            model: models.OrganizationInfo,
            as: 'organization_info',
          },
          {
            model: models.Timezones,
            as: 'timezones',
          },
        ],
      });
      const userData = {
        profile_image: await getuserData.profile_image.then(
          (dataUrl) => dataUrl
        ),
        is_email_verified: getuserData.is_email_verified,
        admin_status: getuserData.admin_status,
        user_status: getuserData.user_status,
        profile_setup: getuserData.profile_setup,
        user_id: getuserData.user_id,
        first_name: getuserData.first_name,
        last_name: getuserData.last_name,
        email: getuserData.email,
        country_id: getuserData.country_id,
        timezone_id: getuserData.timezone_id,
        phone: getuserData.phone,
        dob: getuserData.dob,
        organation_id: getuserData.organation_id,
        facebook_id: getuserData.facebook_id,
        gmail_id: getuserData.gmail_id,
        user_type: getuserData.user_type,
      };
      if (getuserData.organization_info) {
        userData.organization_info = getuserData.organization_info.dataValues;
        userData.organization_info.fill_step =
          getuserData.organization_info.fill_step;
        userData.is_insurance_required = getuserData.is_insurance_required;
        userData.organization_info.header_logo =
          await getuserData.organization_info.header_logo.then(
            (dataUrl) => dataUrl
          );
        userData.organization_info.footer_logo =
          await getuserData.organization_info.footer_logo.then(
            (dataUrl) => dataUrl
          );
      } else {
        userData.organization_info = '';
      }
      if (getuserData.timezones) {
        userData.timezones = getuserData.timezones;
      } else {
        userData.timezones = '';
      }
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(' ');
      const getSubscriptionData = await models.SubscriptionHistory.findOne({
        where: {
          user_id: organization_id,
          payment_status: 1,
          subscription_status: { [Op.or]: [2, 4] },
        },
      });
      const getCardData = await models.UserCards.findOne({
        where: { user_id: organization_id, is_default: 1 },
        order: [['user_card_id', 'DESC']],
      });
      const getCancelSubscriptionData =
        await models.SubscriptionHistory.findOne({
          where: {
            user_id: organization_id,
            payment_status: 1,
            subscription_status: 3,
          },
        });
      return response.successResponse(
        req,
        res,
        'admin.get_user_profile_success',
        {
          accessToken: bearerToken[1],
          is_email_verified: true,
          userData,
          userSubscription: getSubscriptionData,
          userCancelSubscription: getCancelSubscriptionData,
          userCard: getCardData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getUserProfle
   * @description get User Details API
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getUserProflePatient(req, res) {
    try {
      const { user_id } = req.payload.user;
      const getuserData = await models.Users.scope('withSecretColumns').findOne(
        {
          where: {
            user_id,
            user_type: 3,
          },
          include: [
            {
              model: models.PatientInfo,
              as: 'patient_info',
            },
            {
              model: models.Timezones,
              as: 'timezones',
            },
          ],
        }
      );
      const userData = {
        profile_image: await getuserData.profile_image.then(
          (dataUrl) => dataUrl
        ),
        is_password_exist: getuserData.password !== null,
        is_email_verified: getuserData.is_email_verified,
        admin_status: getuserData.admin_status,
        user_status: getuserData.user_status,
        profile_setup: getuserData.profile_setup,
        user_id: getuserData.user_id,
        first_name: getuserData.first_name,
        last_name: getuserData.last_name,
        email: getuserData.email,
        country_id: getuserData.country_id,
        phone: getuserData.phone,
        dob: getuserData.dob,
        organation_id: getuserData.organation_id,
        facebook_id: getuserData.facebook_id,
        gmail_id: getuserData.gmail_id,
        account_type: getuserData.account_type,
        timezone_id: getuserData.timezone_id,
      };
      if (getuserData.patient_info) {
        userData.patient_info = getuserData.patient_info;
      } else {
        userData.patient_info = '';
      }
      if (getuserData.timezones) {
        userData.timezones = getuserData.timezones;
      } else {
        userData.timezones = '';
      }
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(' ');
      return response.successResponse(
        req,
        res,
        'admin.get_user_profile_success',
        {
          accessToken: bearerToken[1],
          is_email_verified: true,
          userData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getOrganizationProfle
   * @description get Organization Details API
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getOrganizationProfle(req, res) {
    try {
      const { user_id } = req.payload.user;
      const OrganizationData = await models.Users.scope(
        'getOrganizationProfileData'
      ).findOne({
        where: {
          user_id,
          user_type: { [Op.in]: [2, 4] },
        },
      });

      return response.successResponse(
        req,
        res,
        'admin.get_Organization_profile_success',
        OrganizationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name editOrganizationProfile
   * @description Edit Organization Profile Data.
   * @param {string} email
   * @returns success isEmailSent
   */
  async editOrganizationProfile(req, res) {
    try {
      const { first_name, last_name, phone, country_id, user_id, timezone_id } =
        req.body;
      const { organization_id, user_type } = req.payload.user;

      const uploadPromises = [];
      let image_path = '';
      let pathArray = '';
      let profile_image = '';
      let pathArray1 = '';
      if (req.files.length > 0) {
        const file = req.files[0];
        const fileFolderPath = getFolderConfig()[file.fieldname];

        const folder_path = fileFolderPath.file_path.replace(
          fileFolderPath.replace,
          user_id
        );
        const fileurl = await fileUploadUrl(file, folder_path);
        image_path = fileurl.filename;
        pathArray = image_path.split('/');
        profile_image = pathArray[pathArray.length - 1];
        uploadPromises.push(fileurl);
      } else {
        image_path = req.body.profile_image;
        pathArray = image_path.split('/');
        pathArray1 = pathArray[pathArray.length - 1].split('?');
        profile_image = pathArray1[pathArray1.length - 2];
      }

      await models.Users.update(
        {
          first_name,
          last_name,
          phone,
          country_id,
          profile_image,
          timezone_id,
        },
        {
          where: {
            user_id,
          },
        }
      );
      try {
        if (user_type === 2) await organizationDataSync(organization_id);
        return response.successResponse(
          req,
          res,
          'admin.edit_organization_profile_success',
          uploadPromises
        );
      } catch (error) {
        return response.errorResponse(
          req,
          res,
          error.message,
          uploadPromises,
          500
        );
      }
    } catch (error) {
      return response.errorResponse(req, res, error.message, 500);
    }
  }

  /**
   * @name addnewOrganizationEmail
   * @description User update email, here we share otp on new email for verification
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async addnewOrganizationEmail(req, res) {
    try {
      const { email } = req.body;
      const { user_id } = req.payload.user;

      /** ***Check Email Already Exists******* */
      const checkEmail = await models.Users.findOne({
        where: {
          email,
        },
      });
      if (checkEmail) {
        if (checkEmail.user_id === user_id) {
          throw new Error('admin.old_email_new_email_same');
        } else {
          throw new Error(
            'admin.edit_organization_profile_email_already_taken'
          );
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      const encodedToken = Buffer.from(email.toString()).toString('base64');
      const organizationData = await models.Users.findByPk(user_id);
      organizationData.email_otp = reset_pin;
      organizationData.otp_expire_time = new Date();
      const isSaved = await organizationData.save();
      if (!isSaved) {
        throw new Error('admin.edit_organization_profile_fail_email_otp_sent');
      }
      const isEmailSent = await emailHelper.sendEmail({
        to: email,
        subject: `Verify your New email - ${process.env.APP_NAME}`,
        template: 'telepath-verify-new-email',
        replacements: {
          FIRSTNAME: `${organizationData.first_name}`,
          OTP_CODE: reset_pin,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.edit_organization_profile_fail_email_otp_sent');
      }
      return response.successResponse(
        req,
        res,
        'admin.edit_organization_profile_email_otp_sent',
        { encodedToken }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name verifyNewOrganizationEmail
   * @description Verify Organization new email through otp
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyNewOrganizationEmail(req, res) {
    try {
      const { encoded_token, verification_otp } = req.body;
      const email = Buffer.from(encoded_token, 'base64').toString('ascii');
      const { user_id } = req.payload.user;
      const organizationData = await models.Users.findOne({
        where: {
          email_otp: verification_otp,
          user_id,
        },
      });
      if (!organizationData) {
        throw new Error('admin.email_otp_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(organizationData.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error('admin.email_otp_verification_time_expire');
      }
      organizationData.email = email;
      organizationData.email_otp = null;
      await organizationData.save();
      await organizationDataSync(user_id);

      return response.successResponse(
        req,
        res,
        'admin.email_otp_verification_success',

        { organizationData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationResendOTP
   * @description Resend OTP to organization Email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationResendOTP(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { encoded_token } = req.body;
      const email = Buffer.from(encoded_token, 'base64').toString('ascii');

      const organizationData = await models.Users.findOne({
        where: {
          user_id,
        },
      });

      if (!organizationData) {
        throw new Error('admin.auth_resend_otp_email_not_found');
      }
      if (organizationData) {
        const startDate = moment();
        const EndDate = moment(organizationData.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.organization_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      organizationData.email_otp = reset_pin;
      organizationData.otp_expire_time = new Date();

      const isSaved = await organizationData.save();
      if (!isSaved) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }

      const template = 'telepath-email-resend-password';

      const otp = organizationData.email_otp;

      const isEmailSent = await emailHelper.sendEmail({
        to: email,
        template,
        replacements: {
          FIRSTNAME: `${organizationData.first_name}`,
          OTP_CODE: otp,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.backend_resend_otp_mail_send',
        {
          encodedToken: encoded_token,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateOrganizationStatus
   * @description Organization Update Your Status.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async updateOrganizationStatus(req, res) {
    try {
      const { reason } = req.body;
      const { user_id } = req.payload.user;
      const getOrganizationData = await models.Users.findOne({
        where: {
          user_id,
        },
      });
      if (getOrganizationData) {
        await models.Users.update(
          {
            user_status: getOrganizationData.user_status === 1 ? 2 : 2,
            user_reason: reason,
          },
          {
            where: {
              user_id,
            },
          }
        );
        await organizationDataSync(user_id);
        return response.successResponse(
          req,
          res,
          'admin.update_deactive_account_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_deactive_account_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationChangePassword
   * @description organization update current password by passing old passoword and new password, password will update when old password match.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationChangePassword(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { old_password, new_password } = req.body;
      const organization = await models.Users.scope(
        'withSecretColumns'
      ).findByPk(user_id);
      const encPassword = crypto
        .createHash('md5')
        .update(old_password || '')
        .digest('hex');
      const password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');
      if (encPassword !== organization.password) {
        throw new Error('admin.incorrect_password');
      }
      if (password === organization.password) {
        throw new Error('admin.old_and_new_password_same');
      }
      await models.Users.update({ password }, { where: { user_id } });
      return response.successResponse(
        req,
        res,
        'admin.password_change_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }
}
module.exports = new UserAuthController();
