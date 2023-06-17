const crypto = require('crypto');
const moment = require('moment');

const response = require('../../../helpers/response.helper');
const common = require('../../../helpers/common.helper');
const emailHelper = require('../../../helpers/email.helper');
const models = require('../../../models/index');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');
const { getFolderConfig } = require('../../../config/upload.config');

class UserController {
  /**
   * @name getUserProfle
   * @description get User Details API
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getUserProfle(req, res) {
    try {
      const { user_id } = req.payload.user;
      const userData = await common.getUserDataById(user_id);
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
   * @name editProfile
   * @description User Can Edit there basic details info like name, address, username etc..
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async editProfile(req, res) {
    try {
      const { first_name, last_name, country_id, phone, dob } = req.body;
      let image_path = req.body.profile_image;
      let pathArray = image_path.split('/');
      const pathArray1 = pathArray[pathArray.length - 1].split('?');
      const { user_id } = req.payload.user;
      let profile_image = pathArray1[pathArray1.length - 2];
      const uploadPromises = [];
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
      }

      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(' ');
      await models.Users.update(
        {
          first_name,
          last_name,
          country_id,
          phone,
          dob,
          profile_image,
        },
        { where: { user_id } }
      );
      const userData = await common.getUserDataById(user_id);
      return response.successResponse(req, res, 'admin.edit_profile_success', {
        accessToken: bearerToken[1],
        is_email_verified: true,
        userData,
        uploadPromises,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name addnewEmail
   * @description User update email, here we share otp on new email for verification
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async addnewEmail(req, res) {
    try {
      const { email } = req.body;

      const { user_id } = req.payload.user;
      const checkEmail = await models.Users.findOne({
        where: {
          email,
        },
      });
      if (checkEmail) {
        if (checkEmail.user_id === user_id) {
          throw new Error('admin.old_email_new_email_same');
        } else {
          throw new Error('admin.edit_profile_email_already_taken');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      const encodedToken = Buffer.from(email.toString()).toString('base64');
      const user = await models.Users.findByPk(user_id);
      user.email_otp = reset_pin;
      user.otp_expire_time = new Date();
      const isSaved = await user.save();

      if (!isSaved) {
        throw new Error('admin.edit_profile_fail_email_otp_sent');
      }
      const isEmailSent = await emailHelper.sendEmail({
        to: email,
        subject: `Verify your New email`,
        template: 'telepath-verify-new-email',
        replacements: {
          FIRSTNAME: `${user.first_name}`,
          OTP_CODE: reset_pin,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.edit_profile_fail_email_otp_sent');
      }
      return response.successResponse(
        req,
        res,
        'admin.edit_profile_email_otp_sent',
        { encodedToken }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name verifyNewEmail
   * @description Verify users new email through otp
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyNewEmail(req, res) {
    try {
      const { encoded_token, verification_otp } = req.body;
      const email = Buffer.from(encoded_token, 'base64').toString('ascii');
      const { user_id } = req.payload.user;
      const user = await models.Users.findOne({
        where: {
          email_otp: verification_otp,
          user_id,
        },
      });

      if (!user) {
        throw new Error('admin.email_otp_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(user.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error('admin.email_otp_verification_time_expire');
      }
      user.email = email;
      user.email_otp = null;
      await user.save();

      return response.successResponse(
        req,
        res,
        'admin.email_otp_verification_success',

        { userData: user }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
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
      const { user_id } = req.payload.user;
      const { encoded_token } = req.body;
      const email = Buffer.from(encoded_token, 'base64').toString('ascii');

      const user = await models.Users.findOne({
        where: {
          user_id,
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

      const template = 'telepath-email-resend-password';

      const otp = user.email_otp;

      const isEmailSent = await emailHelper.sendEmail({
        to: email,
        template,
        replacements: {
          FIRSTNAME: `${user.first_name}`,
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
        },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name changePassword
   * @description User update current password by passing old passoword and new password, password will update when old password match.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async changePassword(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { old_password, new_password } = req.body;
      const user = await models.Users.scope('withSecretColumns').findByPk(
        user_id
      );
      const encPassword = crypto
        .createHash('md5')
        .update(old_password || '')
        .digest('hex');
      const password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');

      if (encPassword !== user.password) {
        throw new Error('admin.incorrect_password');
      }
      if (password === user.password) {
        throw new Error('admin.old_and_new_password_same');
      }

      await models.Users.update({ password }, { where: { user_id } });
      return response.successResponse(
        req,
        res,
        'admin.password_change_success',
        {}
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name userImageUpload
   * @description in this function app developer give image path we are fetch file name from path and update in user_image column and return user_image_path
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async userImageUpload(req, res) {
    try {
      const user_image_path = res.locals.photos[0];
      const pathArray = user_image_path.split('/');
      const profile_image = pathArray[pathArray.length - 1];
      const { user_id } = req.payload.user;
      await models.Users.update(
        {
          profile_image,
        },
        { where: { user_id } }
      );
      return response.successResponse(req, res, {
        message: 'admin.image_upload_successfully',
        data: {
          profile_image: user_image_path,
        },
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }
}
module.exports = new UserController();
