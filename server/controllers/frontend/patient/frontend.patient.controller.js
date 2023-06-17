const { Op } = require('sequelize');
const crypto = require('crypto');
const moment = require('moment');
const { object } = require('joi');
const models = require('../../../models/index');
const response = require('../../../helpers/response.helper');
const common = require('../../../helpers/common.helper');
const { organizationSendEmail } = require('../../../helpers/email.helper');
const { getFolderConfig } = require('../../../config/upload.config');
const { fileUploadUrl, getFileUrl } = require('../../../helpers/s3file.helper');
const emailHelper = require('../../../helpers/email.helper');
const FilePath = require('../../../config/upload.config');
const { uploadBase64File } = require('../../../helpers/s3file.helper');
const { PatientDataSync } = require('../../../helpers/dosespot.helper');

class PatientAuthController {
  constructor() {
    this.patientSignup = this.patientSignup.bind(this);
    this.patientLogin = this.patientLogin.bind(this);
    this.patientForgotPassword = this.patientForgotPassword.bind(this);
    this.patientForgotresendOTP = this.patientForgotresendOTP.bind(this);
    this.patientResendOTP = this.patientResendOTP.bind(this);
  }

  /**
   * @name sendEmailOTP
   * @description Send OTP to Email.
   * @param {object} patientInfo
   * @param {string} email
   * @returns success isEmailSent
   */
  async sendEmailOTP(patientInfo, template) {
    const otp = patientInfo.email_otp;

    const isEmailSent = await organizationSendEmail({
      to: patientInfo.email,
      organization_id: patientInfo.organation_id,
      template,
      replacements: {
        FIRSTNAME: `${patientInfo.first_name}`,
        OTP_CODE: otp,
      },
    });
    return isEmailSent;
  }

  /**
   * @name patientSignup
   * @description Signup Patient.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientSignup(req, res) {
    let patient = '';
    try {
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const {
        first_name,
        last_name,
        email,
        phone,
        country_id,
        password,
        account_type,
        is_fb_email_verify,
        facebook_id,
        is_gmail_email_verify,
        gmail_id,
      } = req.body;
      const signup_data = {
        first_name,
        last_name,
        email,
        phone,
        country_id,
        account_type,
        organation_id: user_id,
        user_type: 3,
        profile_setup: 2,
      };

      /** ***Check Email Already Exists******* */
      const isEmailExists = await models.Users.scope(
        'withSecretColumns'
      ).findOne({
        where: { email, user_type: 3, organation_id: user_id },
        include: [
          {
            model: models.PatientInfo,
            as: 'patient_info',
          },
        ],
      });
      /** ***Merge Account if Email Already Exists******* */
      if (isEmailExists) {
        patient = isEmailExists;
        if (account_type === 1) {
          if (patient.password) {
            throw new Error('admin.already_register_with_account');
          }

          const encrypt_patient_password = crypto
            .createHash('md5')
            .update(password || '')
            .digest('hex');
          patient.password = encrypt_patient_password;
        } else if (account_type === 3) {
          if (patient.facebook_id && patient.facebook_id !== facebook_id) {
            throw new Error('admin.already_register_with_account');
          } else if (patient.facebook_id == null) {
            patient.facebook_id = facebook_id;
            patient.is_fb_email_verify = is_fb_email_verify;
          }
        } else if (account_type === 2) {
          if (patient.gmail_id && patient.gmail_id !== gmail_id) {
            throw new Error('admin.already_register_with_account');
          } else if (patient.gmail_id == null) {
            patient.gmail_id = gmail_id;
            patient.is_gmail_email_verify = is_gmail_email_verify;
          }
        }
        patient.first_name = first_name;
        patient.last_name = last_name;
        patient.phone = phone;
        patient.country_id = country_id;
        patient.save();
      } else {
        /** *If Email not Exist then normal register */
        if (account_type === 1) {
          const encrypt_patient_password = crypto
            .createHash('md5')
            .update(password || '')
            .digest('hex');
          signup_data.password = encrypt_patient_password;
        } else if (account_type === 3) {
          const isFacebookExist = await models.Users.findOne({
            where: { facebook_id, user_type: 3, organation_id: user_id },
          });
          if (isFacebookExist) {
            throw new Error('admin.facebook_id_already_exist');
          }
          signup_data.facebook_id = facebook_id;
          signup_data.is_fb_email_verify = is_fb_email_verify;
        } else if (account_type === 2) {
          const isGmailExist = await models.Users.findOne({
            where: { gmail_id, user_type: 3, organation_id: user_id },
          });
          if (isGmailExist) {
            throw new Error('admin.gmail_id_already_exist');
          }
          signup_data.gmail_id = gmail_id;
          signup_data.is_gmail_email_verify = is_gmail_email_verify;
        }
        patient = await models.Users.create(signup_data, {
          include: [
            {
              model: models.PatientInfo,
              as: 'patient_info',
            },
          ],
        });
      }
      if (
        account_type === 1 ||
        (account_type === 3 && is_fb_email_verify === 2) ||
        (account_type === 2 && is_gmail_email_verify === 2)
      ) {
        const patientInfo = patient;
        const verifyPin = common.generateUniqueId(6, 'NUMBER_ONLY');
        patientInfo.email_otp = verifyPin;
        patientInfo.otp_expire_time = new Date();
        const isSaved = await patientInfo.save();
        if (!isSaved) {
          throw new Error('admin.patient_fail_send_mail');
        }
        patient.profile_setup = 2;
        await patient.save();
        const encodedToken = Buffer.from(patient.user_id.toString()).toString(
          'base64'
        );
        // Send an email
        const isEmailSent = await this.sendEmailOTP(
          patientInfo,
          'telepath-register-verify-email'
        );

        if (!isEmailSent) {
          throw new Error('admin.patient_fail_send_mail');
        }
        return response.successResponse(
          req,
          res,
          'admin.patient_register_success',
          {
            encodedToken,
            account_type,
          }
        );
      }
      const isSaved = await common.generateAccessToken(patient);
      if (!isSaved.isSaved) {
        throw new Error('admin.login_patient_fail');
      }
      const checkPassword = patient;
      let is_hidden = true;
      if (checkPassword.password) {
        is_hidden = false;
      }
      const patientData = {
        profile_image: await patient.profile_image.then((dataUrl) => dataUrl),
        is_email_verified: patient.is_email_verified,
        admin_status: patient.admin_status,
        user_status: patient.user_status,
        profile_setup: patient.profile_setup,
        user_id: patient.user_id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        country_id: patient.country_id,
        phone: patient.phone,
        dob: patient.dob,
        organation_id: patient.organation_id,
        facebook_id: patient.facebook_id,
        gmail_id: patient.gmail_id,
        fill_step: patient.fill_step,
        patient_info: patient.patient_info,
      };
      if (patient.patient_info) {
        patientData.patient_info = patient.patient_info;
        patientData.patient_info.fill_step = patient.patient_info.fill_step;
      } else {
        patientData.patient_info = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_register_success',

        {
          accessToken: isSaved.accessToken,
          is_hidden,
          patientData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name verifyPatientEmailOtp
   * @description Verify Email OTP which is send to user email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyPatientEmailOtp(req, res) {
    try {
      const { encodedToken, verification_otp, account_type } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const user_id = Buffer.from(encodedToken, 'base64').toString('ascii');

      const patient = await models.Users.findOne({
        where: {
          email_otp: verification_otp,
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
        include: [
          {
            model: models.PatientInfo,
            as: 'patient_info',
          },
        ],
      });

      if (!patient) {
        throw new Error(
          common.translationTextMessage('admin.email_otp_verification_error')
        );
      }
      const startDate = moment();
      const EndDate = moment(patient.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error(
          'admin.patient_forgot_password_verification_time_expire'
        );
      }
      if (account_type.toString() === '1') {
        patient.is_email_verified = 1;
      } else if (account_type.toString() === '3') {
        patient.is_fb_email_verify = 1;
      } else if (account_type.toString() === ' 2') {
        patient.is_gmail_email_verify = 1;
      }
      patient.is_profile_setup = 2;
      await patient.save();

      const userAccessToken = await common.generateAccessToken(patient);
      const checkPassword = patient;
      let is_hidden = true;
      if (checkPassword.password) {
        is_hidden = false;
      }
      const patientData = {
        profile_image: await patient.profile_image.then((dataUrl) => dataUrl),
        is_email_verified: patient.is_email_verified,
        admin_status: patient.admin_status,
        user_status: patient.user_status,
        profile_setup: patient.profile_setup,
        user_id: patient.user_id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        country_id: patient.country_id,
        phone: patient.phone,
        dob: patient.dob,
        organation_id: patient.organation_id,
        facebook_id: patient.facebook_id,
        gmail_id: patient.gmail_id,
        fill_step: patient.fill_step,
        patient_info: patient.patient_info,
      };
      if (patient.patient_info) {
        patientData.patient_info = patient.patient_info;
      } else {
        patientData.patient_info = '';
      }
      return response.successResponse(
        req,
        res,
        'admin.email_otp_verification_success',
        {
          accessToken: userAccessToken.accessToken,
          is_email_verify: true,
          is_hidden,
          patientData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientResendOTP
   * @description Resend OTP to Patient Email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientResendOTP(req, res) {
    try {
      const { encoded_token } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');
      const patientInfo = await models.Users.findOne({
        where: {
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (!patientInfo) {
        throw new Error('admin.patient_resend_otp_email_not_found');
      }
      if (patientInfo) {
        const startDate = moment();
        const EndDate = moment(patientInfo.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.patient_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      patientInfo.email_otp = reset_pin;
      patientInfo.otp_expire_time = new Date();
      const isSaved = await patientInfo.save();
      if (!isSaved) {
        throw new Error('admin.patient_resend_otp_fail_send_mail');
      }
      const isEmailSent = await this.sendEmailOTP(
        patientInfo,
        'telepath-resend-register-verify-email'
      );
      if (!isEmailSent) {
        throw new Error('admin.patient_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_resend_otp_mail_send',
        {
          encodedToken: encoded_token,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientLogin
   * @description Login Patient.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientLogin(req, res) {
    try {
      const { account_type, email, password, facebook_id, gmail_id } = req.body;
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      let patient = '';
      if (email) {
        patient = await models.Users.scope('withSecretColumns').findOne({
          where: {
            email,
            organation_id: user_id,
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
        });
      } else if (account_type === 2) {
        // Google Login Check
        patient = await models.Users.scope('withSecretColumns').findOne({
          where: { gmail_id, organation_id: user_id, user_type: 3 },
        });
      } else if (account_type === 3) {
        // FACEBOOK Login Check
        patient = await models.Users.scope('withSecretColumns').findOne({
          where: { facebook_id, organation_id: user_id, user_type: 3 },
        });
      }
      if (patient) {
        if (account_type === 2) {
          if (patient.gmail_id && patient.gmail_id !== gmail_id) {
            throw new Error('admin.already_register_with_account');
          }
          if (!patient.gmail_id) {
            patient.gmail_id = gmail_id;
            patient.is_gmail_email_verify = 1;
            patient.save();
          }
        } else if (account_type === 3) {
          if (patient.facebook_id && patient.facebook_id !== facebook_id) {
            throw new Error('admin.already_register_with_account');
          }
          if (!patient.facebook_id) {
            patient.facebook_id = facebook_id;
            patient.is_fb_email_verify = 1;
            patient.save();
          }
        }
      }

      /** **************Login Credentials Check ************ */
      if (!patient) {
        if (account_type !== 1) {
          return response.errorResponse(
            req,
            res,
            'admin.login_patient_not_found',
            {
              code: 206,
            },
            206
          );
        }
        throw new Error(
          common.translationTextMessage('admin.login_patient_not_found')
        );
      }
      if (patient.admin_status === 2) {
        throw new Error('admin.patient_status_in_active_error');
      }

      /** **************If we perform normal login process ************ */
      if (account_type === 1) {
        const reqPass = crypto
          .createHash('md5')
          .update(password || '')
          .digest('hex');
        if (reqPass !== patient.password) {
          let resetToken = '';
          let message = 'admin.login_patient_incorrect_password';
          patient.password_wrong_count =
            parseInt(patient.password_wrong_count, 10) + 1;
          if (patient.password_wrong_count >= 6) {
            patient.user_status = 3;
            resetToken = Buffer.from(patient.user_id.toString()).toString(
              'base64'
            );
            const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
            patient.email_otp = reset_pin;
            patient.otp_expire_time = new Date();
            const isSaved = await patient.save();
            if (!isSaved) {
              throw new Error('admin.patient_forgot_password_fail_send_mail');
            }
            const isEmailSent = await this.sendEmailOTP(
              patient,
              'telepath-forget-password'
            );

            if (!isEmailSent) {
              throw new Error('admin.patient_forgot_password_fail_send_mail');
            }
            message = 'admin.patient_forgot_password_mail_send';
          }
          patient.save();
          return response.errorResponse(
            req,
            res,
            message,
            {
              is_password: 2,
              password_wrong_count: patient.password_wrong_count,
              resetToken,
            },
            402
          );
        }
      }
      /** **************User verification Check ************ */
      if (
        (account_type === 1 && patient.is_email_verified === 2) ||
        (account_type === 3 && patient.is_fb_email_verify === 2) ||
        (account_type === 2 && patient.is_gmail_email_verify === 2)
      ) {
        const encodedToken = Buffer.from(patient.user_id.toString()).toString(
          'base64'
        );
        const patientInfo = patient;
        const otp = common.generateUniqueId(6, 'NUMBER_ONLY');
        patientInfo.email_otp = otp;
        patientInfo.otp_expire_time = new Date();
        const isSaved = await patientInfo.save();
        if (!isSaved) {
          throw new Error('admin.patient_fail_send_mail');
        }
        // Send an email
        const isEmailSent = await this.sendEmailOTP(
          patientInfo,
          'telepath-register-verify-email'
        );
        if (!isEmailSent) {
          throw new Error('admin.patient_fail_send_mail');
        }
        return response.errorResponse(
          req,
          res,
          'admin.login_patient_not_verified',
          {
            is_email_verified: false,
            encodedToken,
            account_type,
          }
        );
      }
      const isTokenGenerated = await common.generateAccessToken(patient);
      if (!isTokenGenerated.isSaved) {
        throw new Error('admin.login_patient_fail');
      }
      if (patient.user_status) {
        patient.user_status = 1;
        patient.user_reason = null;
        patient.save();
      }
      let is_hidden = true;
      if (patient.password) {
        is_hidden = false;
      }
      const patientData = {
        profile_image: await patient.profile_image.then((dataUrl) => dataUrl),
        is_email_verified: patient.is_email_verified,
        admin_status: patient.admin_status,
        user_status: patient.user_status,
        profile_setup: patient.profile_setup,
        user_id: patient.user_id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        country_id: patient.country_id,
        phone: patient.phone,
        dob: patient.dob,
        organation_id: patient.organation_id,
        facebook_id: patient.facebook_id,
        gmail_id: patient.gmail_id,
        fill_step: patient.fill_step,
        patient_info: patient.patient_info,
      };
      if (patient.patient_info) {
        patientData.patient_info = patient.patient_info;
      } else {
        patientData.patient_info = '';
      }
      if (patient.timezones) {
        patientData.timezones = patient.timezones;
      } else {
        patientData.timezones = '';
      }
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.login_patient_success',
          {
            accessToken: isTokenGenerated.accessToken,
            is_hidden,
            patientData,
          },
          200
        );
      }, 500);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientForgotPassword
   * @description Patient Forgot password send otp mail to enter>>>>>>> 92734b0d894253171148c394efc067af7438a565ed email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientForgotPassword(req, res) {
    try {
      const { email } = req.body;
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const patientInfo = await models.Users.scope('withSecretColumns').findOne(
        {
          where: {
            email,
            organation_id: user_id,
            user_type: 3,
          },
        }
      );
      if (!patientInfo) {
        throw new Error('admin.patient_forgot_password_email_not_found');
      }
      if (patientInfo.password === null) {
        throw new Error('admin.patient_forgot_password_email_no_password');
      }
      const resetToken = Buffer.from(patientInfo.user_id.toString()).toString(
        'base64'
      );
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      patientInfo.email_otp = reset_pin;
      patientInfo.otp_expire_time = new Date();
      const isSaved = await patientInfo.save();

      if (!isSaved) {
        throw new Error('admin.patient_forgot_password_fail_send_mail');
      }
      const isEmailSent = await this.sendEmailOTP(
        patientInfo,
        'telepath-forget-password'
      );

      if (!isEmailSent) {
        throw new Error('admin.patient_forgot_password_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_forgot_password_mail_send',
        {
          resetToken,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientForgotresendOTP
   * @description Resend OTP to User Email For Forgot Password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientForgotresendOTP(req, res) {
    try {
      const { encoded_token } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');
      const patientInfo = await models.Users.findOne({
        where: {
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (!patientInfo) {
        throw new Error('admin.patient_resend_otp_email_not_found');
      }
      if (patientInfo) {
        const startDate = moment();
        const EndDate = moment(patientInfo.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.patient_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      patientInfo.email_otp = reset_pin;
      patientInfo.otp_expire_time = new Date();

      const isSaved = await patientInfo.save();
      if (!isSaved) {
        throw new Error('admin.patient_resend_otp_fail_send_mail');
      }
      const isEmailSent = await this.sendEmailOTP(
        patientInfo,
        'telepath-forget-resend-password'
      );

      if (!isEmailSent) {
        throw new Error('admin.patient_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_resend_otp_mail_send',
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
   * @name patientVerifyForgotPassword
   * @description Verify Forgot password otp which is send in email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientVerifyForgotPassword(req, res) {
    try {
      const { encoded_token, verification_otp } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const user_id = Buffer.from(encoded_token, 'base64').toString('ascii');
      const patientInfo = await models.Users.findOne({
        where: {
          email_otp: verification_otp,
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (!patientInfo) {
        throw new Error('admin.patient_forgot_password_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(patientInfo.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error(
          'admin.patient_forgot_password_verification_time_expire'
        );
      }
      if (patientInfo.is_email_verified === 2) {
        patientInfo.is_email_verified = 1;
        patientInfo.save();
      }
      const resetToken = Buffer.from(patientInfo.user_id.toString()).toString(
        'base64'
      );
      return response.successResponse(
        req,
        res,
        'admin.patient_otp_verified_success',
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
   * @name patientResetPassword
   * @description Patient Reset new password.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientResetPassword(req, res) {
    try {
      const { resetToken, new_password } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const user_id = Buffer.from(resetToken, 'base64').toString('ascii');
      const patientInfo = await models.Users.findOne({
        where: {
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (!patientInfo) {
        throw new Error('admin.patient_reset_password_fail');
      }
      const patient_password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');
      patientInfo.password = patient_password;
      patientInfo.reset_password_token = '';
      patientInfo.password_wrong_count = 0;
      const isSaved = await patientInfo.save();
      if (!isSaved) {
        throw new Error('admin.patient_reset_password_fail');
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_reset_password_success',
        {},
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editPatientProfile
   * @description Edit Organization Profile Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async editPatientProfile(req, res) {
    try {
      const { first_name, last_name, phone, country_id, user_id } = req.body;
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
        },
        {
          where: {
            user_id,
          },
        }
      );
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      try {
        if (organizationData && organizationData.dosespot_org_id) {
          await PatientDataSync(user_id, organizationData.dosespot_org_id);
        } else {
          await PatientDataSync(user_id);
        }
        return response.successResponse(
          req,
          res,
          'admin.edit_patient_profile_success',
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
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name addnewPatientEmail
   * @description Patient update email, here we share otp on new email for verification
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async addnewPatientEmail(req, res) {
    try {
      const { email } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      /** ***Check Email Already Exists******* */
      const checkEmail = await models.Users.scope('withSecretColumns').findOne({
        where: {
          email,
          user_type: 3,
          organation_id: organizationData.user_id,
        },
      });
      if (checkEmail) {
        if (checkEmail.user_id === user_id) {
          throw new Error('admin.old_email_new_email_same');
        } else {
          throw new Error('admin.edit_patient_profile_email_already_taken');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      const encodedToken = Buffer.from(email.toString()).toString('base64');
      const patientData = await models.Users.findByPk(user_id);
      patientData.email_otp = reset_pin;
      patientData.otp_expire_time = new Date();
      const isSaved = await patientData.save();
      if (!isSaved) {
        throw new Error('admin.edit_patient_profile_fail_email_otp_sent');
      }
      const isEmailSent = await emailHelper.organizationSendEmail({
        to: email,
        organization_id: organizationData.user_id,
        subject: `Verify your New email`,
        template: 'telepath-verify-new-email',
        replacements: {
          FIRSTNAME: `${patientData.first_name}`,
          OTP_CODE: reset_pin,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.edit_patient_profile_fail_email_otp_sent');
      }
      return response.successResponse(
        req,
        res,
        'admin.edit_patient_profile_email_otp_sent',
        { encodedToken }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name verifyNewPatientEmail
   * @description Verify Patient New Emai
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async verifyNewPatientEmail(req, res) {
    try {
      const { encodedToken, verification_otp } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const email = Buffer.from(encodedToken, 'base64').toString('ascii');
      const { user_id } = req.payload.user;
      const patientData = await models.Users.findOne({
        where: {
          email_otp: verification_otp,
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
        include: [
          {
            model: models.PatientInfo,
            as: 'patient_info',
          },
        ],
      });
      if (!patientData) {
        throw new Error('admin.email_otp_verification_fail');
      }
      const startDate = moment();
      const EndDate = moment(patientData.otp_expire_time);
      const duration = moment.duration(startDate.diff(EndDate));
      const minutes = parseInt(duration.asMinutes(), 10) % 60;
      if (minutes >= 5) {
        throw new Error('admin.email_otp_verification_time_expire');
      }
      patientData.email = email;
      patientData.email_otp = null;
      await patientData.save();
      if (organizationData) {
        await PatientDataSync(user_id, organizationData.dosespot_org_id);
      } else {
        await PatientDataSync(user_id);
      }
      return response.successResponse(
        req,
        res,
        'admin.email_otp_verification_success',
        { patientData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name NewPatientEmailResendOTP
   * @description Resend OTP to patient Email.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async NewPatientEmailResendOTP(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { encodedToken } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const email = Buffer.from(encodedToken, 'base64').toString('ascii');

      const patientData = await models.Users.findOne({
        where: {
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (!patientData) {
        throw new Error('admin.auth_resend_otp_email_not_found');
      }
      if (patientData) {
        const startDate = moment();
        const EndDate = moment(patientData.otp_expire_time);
        const duration = moment.duration(startDate.diff(EndDate));
        const minutes = parseInt(duration.asMinutes(), 10) % 60;
        if (minutes < 1) {
          throw new Error('admin.patient_otp_already_send');
        }
      }
      const reset_pin = common.generateUniqueId(6, 'NUMBER_ONLY');
      patientData.email_otp = reset_pin;
      patientData.otp_expire_time = new Date();
      const isSaved = await patientData.save();
      if (!isSaved) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }

      const template = 'telepath-email-resend-password';

      const otp = patientData.email_otp;

      const isEmailSent = await emailHelper.organizationSendEmail({
        to: email,
        organization_id: organizationData.user_id,
        template,
        replacements: {
          FIRSTNAME: `${patientData.first_name}`,
          OTP_CODE: otp,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.auth_resend_otp_fail_send_mail');
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_resend_otp_mail_send',
        {
          encodedToken,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientChangePassword
   * @description Patient update current password by passing old passoword and new password, password will update when old password match.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientChangePassword(req, res) {
    try {
      const { user_id } = req.payload.user;
      const { old_password, new_password } = req.body;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const patient = await models.Users.scope('withSecretColumns').findOne({
        where: {
          user_id,
          organation_id: organizationData.user_id,
          user_type: 3,
        },
      });
      if (patient.password === null) {
        throw new Error('admin.patient_password_email_not_found');
      }
      const encPassword = crypto
        .createHash('md5')
        .update(old_password || '')
        .digest('hex');
      const password = crypto
        .createHash('md5')
        .update(new_password || '')
        .digest('hex');
      if (encPassword !== patient.password) {
        throw new Error('admin.patient_password_incorrect');
      }
      if (password === patient.password) {
        throw new Error('admin.old_and_new_password_same');
      }
      await models.Users.update({ password }, { where: { user_id } });
      return response.successResponse(
        req,
        res,
        'admin.password_change_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientGeneralDetailsStore
   * @description Store patient general Details Data.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientGeneralDetailsStore(req, res) {
    try {
      const { answers, country_id, phone } = req.body;
      const { subdomain } = req.headers;
      const { user_id, dosespot_org_id } =
        await models.OrganizationInfo.findOne({
          where: {
            subdomain_name: subdomain,
          },
        });
      Object.values(answers).map(async (item) => {
        item.user_id = req.payload.user.user_id;
        item.organation_id = user_id;
        item.user_question_ans_option = item.user_question_ans_option.map(
          (value) => ({
            option_value: value.option_value,
            question_option_id: value.question_option_id,
            is_delete: value.is_delete,
            is_new: value.is_new,
            user_question_ans_option_id: value.user_question_ans_option_id,
            user_id: req.payload.user.user_id,
            organation_id: user_id,
          })
        );
        await models.UserQuestionAns.findOne({
          where: {
            user_question_ans_id: item.user_question_ans_id,
          },
        }).then(async (obj) => {
          if (obj && item.is_delete === 1 && item.user_question_ans_id !== 0) {
            if (
              item.user_question_ans_option !== null &&
              item.user_question_ans_option.length > 0
            ) {
              Object.keys(item.user_question_ans_option).map(async (key) => {
                const option_values = item.user_question_ans_option[key];
                option_values.user_id = req.payload.user.user_id;
                option_values.organation_id = user_id;
                await models.UserQuestionAnsOption.findOne({
                  where: {
                    user_question_ans_option_id:
                      option_values.user_question_ans_option_id,
                  },
                }).then(async (objo) => {
                  // update
                  if (objo && option_values.is_delete === 1) {
                    return objo.update({
                      question_option_id: option_values.question_option_id,
                      option_value: option_values.option_value,
                    });
                  }
                  if (
                    objo &&
                    option_values.is_delete === 2 &&
                    option_values.is_new === 1
                  ) {
                    return objo.destroy();
                  }
                  if (
                    (option_values.is_delete === 1 &&
                      option_values.is_new === 2) ||
                    option_values.user_question_ans_option_id === 0
                  ) {
                    // insert
                    return models.UserQuestionAnsOption.create({
                      user_question_ans_id: item.user_question_ans_id,
                      option_value: option_values.option_value,
                      question_id: item.question_id,
                      question_option_id: option_values.question_option_id,
                      user_id: req.payload.user.user_id,
                      organation_id: user_id,
                    });
                  }
                  return null;
                });
              });
            }
            return obj.update(item);
          }
          if (obj && item.is_delete === 2) {
            await models.UserQuestionAnsOption.destroy({
              where: {
                user_question_ans_id: item.user_question_ans_id,
              },
            });
            return obj.destroy();
          }
          if (item.is_delete === 1 && item.user_question_ans_id === 0) {
            return models.UserQuestionAns.create(item, {
              include: [
                {
                  model: models.UserQuestionAnsOption,
                  as: 'user_question_ans_option',
                },
              ],
            });
          }
          return null;
        });
      });
      const gender_array = answers.filter(
        (gender_data) => gender_data.question_id === 466
      );
      const dob_array = answers.filter(
        (dob_data) => dob_data.question_id === 468
      );
      const address_array = answers.filter(
        (address_data) => address_data.question_id === 734
      );
      const city_array = answers.filter(
        (city_data) => city_data.question_id === 733
      );
      const state_array = answers.filter(
        (state_data) => state_data.question_id === 732
      );
      const postcode_array = answers.filter(
        (postcode_data) => postcode_data.question_id === 731
      );
      const country_array = answers.filter(
        (country_data) => country_data.question_id === 730
      );
      let gender = null;
      let dob = null;
      let address = null;
      let city = null;
      let state = null;
      let postcode = null;
      let country = null;
      if (dob_array.length !== 0) {
        dob = dob_array[0].ans_value;
      }
      if (address_array.length !== 0) {
        address = address_array[0].ans_value;
      }
      if (city_array.length !== 0) {
        city = city_array[0].ans_value;
      }
      if (state_array.length !== 0) {
        state = state_array[0].ans_value;
      }
      if (postcode_array.length !== 0) {
        postcode = postcode_array[0].ans_value;
      }
      if (country_array.length !== 0) {
        country = country_array[0].ans_value;
      }
      if (
        gender_array.length !== 0 &&
        gender_array[0].user_question_ans_option
      ) {
        if (
          gender_array[0].user_question_ans_option[0].question_option_id === 607
        )
          gender = 1;
        else if (
          gender_array[0].user_question_ans_option[0].question_option_id === 608
        )
          gender = 2;
        else if (
          gender_array[0].user_question_ans_option[0].question_option_id === 609
        )
          gender = 3;
      }
      await models.Users.update(
        { dob, country_id, phone },
        {
          where: {
            user_id: req.payload.user.user_id,
          },
        }
      );
      await models.PatientInfo.findOne({
        where: {
          user_id: req.payload.user.user_id,
        },
      }).then(async (obj) => {
        // Update
        if (obj) {
          const updatePatientInfoData = obj.update({
            fill_step: 3,
            gender,
            address,
            city,
            state,
            postcode,
            country,
          });
          return updatePatientInfoData;
        }
        // insert
        return models.PatientInfo.create({
          fill_step: 3,
          gender,
          address,
          city,
          state,
          postcode,
          country,
          user_id: req.payload.user.user_id,
        });
      });
      const userData = await models.Users.findOne({
        where: {
          user_id: req.payload.user.user_id,
        },
      });
      if (userData.profile_setup === 1) {
        if (dosespot_org_id) {
          await PatientDataSync(req.payload.user.user_id, dosespot_org_id);
        } else {
          await PatientDataSync(req.payload.user.user_id);
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.store_patient_general_details_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientGeneralDetails
   * @description Get All Patient General Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientGeneralDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const userData = await models.Users.findOne({
        where: { user_id },
      });
      const getPatientGeneralData = await models.Questions.scope(
        'defaultScope',
        'patientSignupQuestionsDetails'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id },
            required: false,
          },
        ],
      });
      const QuestionData = [];
      getPatientGeneralData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        QuestionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_value,
          ans_type,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });

      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_patient_general_details_success',
          { QuestionData, userData }
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientInsuranceDetails
   * @description Get All Patient Insurance Details
   * @param req,res
   * @returns {Json} success
   */
  async getPatientInsuranceDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const getPatientInsuranceData = await models.Questions.scope(
        'defaultScope',
        'patientInsuranceQuestionsDetails'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
            include: [
              {
                model: models.UserQuestionAnsOption,
                as: 'user_question_ans_option',
                where: { user_id },
                required: false,
              },
            ],
          },
          {
            model: models.UserQuestionAns,
            as: 'user_question_ans',
            where: { user_id },
            required: false,
          },
        ],
      });
      const questionData = [];
      getPatientInsuranceData.map(async (value, index) => {
        let ans_type = 1;
        let ans_value =
          value.user_question_ans !== null
            ? value.user_question_ans.ans_value
            : '';
        if (value.question_type === 6 && value.user_question_ans !== null) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            value.user_question_ans.user_question_ans_id
          );
          folder_path += ans_value;

          ans_value = await getFileUrl(folder_path).then((dataUrl) => dataUrl);
          ans_type = 3;
        } else if (value.question_type === 7) {
          ans_type = 4;
        } else if ([3, 4, 5].includes(value.question_type)) {
          ans_type = 2;
        }
        questionData[index] = {
          user_question_ans_id:
            value.user_question_ans !== null
              ? value.user_question_ans.user_question_ans_id
              : 0,
          question_type: value.question_type,
          question_id: value.question_id,
          ans_type,
          ans_value,
          label: value.label,
          is_required: value.is_required,
          question_text:
            value.user_question_ans !== null
              ? value.user_question_ans.question_text
              : '',
          is_delete: 1,
          is_new: 1,
          user_question_ans_option: value.question_options.map((item) => ({
            user_question_ans_option_id:
              item.user_question_ans_option !== null
                ? item.user_question_ans_option.user_question_ans_option_id
                : 0,
            is_delete: 1,
            is_new: item.user_question_ans_option !== null ? 2 : 1,
            question_option_id: item.question_option_id,
            option_value: item.option_value,
          })),
        };
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_patient_insurance_details_success',
          questionData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storePatientInsuranceDetails
   * @description Store Patient Insurance Details.
   * @param req,res
   * @returns {Json} success
   */
  async storePatientInsuranceDetails(req, res) {
    try {
      const { answers } = req.body;
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      Object.values(answers).map(async (item) => {
        item.user_id = req.payload.user.user_id;
        item.organation_id = user_id;
        const random = Math.floor(100000 + Math.random() * 900000);
        const type = item.ans_value.split(';')[0].split('/')[1];
        const filename = `${Date.now()}_${random}.${type}`;
        if (
          item.question_type === 6 &&
          item.is_new === 2 &&
          item.is_delete === 1 &&
          item.user_question_ans_id !== 0 &&
          item.ans_value !== ''
        ) {
          let folder_path = '';
          const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
          folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            item.user_question_ans_id
          );
          folder_path += filename;
          await uploadBase64File(item.ans_value, folder_path);
          item.ans_value = filename;
        }
        if (
          item.question_type === 6 &&
          item.is_new === 1 &&
          item.user_question_ans_id !== 0 &&
          item.ans_value !== ''
        ) {
          const pathArray = item.ans_value.split('/');
          const pathArrayHeader = pathArray[pathArray.length - 1].split('?');
          item.ans_value = pathArrayHeader[pathArrayHeader.length - 2];
        }
        item.user_question_ans_option = item.user_question_ans_option.map(
          (value) => ({
            option_value: value.option_value,
            question_option_id: value.question_option_id,
            is_delete: value.is_delete,
            is_new: value.is_new,
            user_question_ans_option_id: value.user_question_ans_option_id,
            user_id: req.payload.user.user_id,
            organation_id: user_id,
          })
        );
        await models.UserQuestionAns.findOne({
          where: {
            user_question_ans_id: item.user_question_ans_id,
          },
        }).then(async (obj) => {
          if (obj && item.is_delete === 1 && item.user_question_ans_id !== 0) {
            if (
              item.user_question_ans_option !== null &&
              item.user_question_ans_option.length > 0
            ) {
              object.keys(item.user_question_ans_option).map(async (key) => {
                const option_values = item.user_question_ans_option[key];
                option_values.user_id = req.payload.user.user_id;
                option_values.organation_id = user_id;
                await models.UserQuestionAnsOption.findOne({
                  where: {
                    user_question_ans_option_id:
                      option_values.user_question_ans_option_id,
                  },
                }).then(async (objo) => {
                  if (objo && option_values.is_delete === 1) {
                    return objo.update({
                      question_option_id: option_values.question_option_id,
                      option_value: option_values.option_value,
                    });
                  }
                  if (
                    objo &&
                    option_values.is_delete === 2 &&
                    option_values.is_new === 1
                  ) {
                    return objo.destroy();
                  }
                  if (
                    (option_values.is_delete === 1 &&
                      option_values.is_new === 2) ||
                    option_values.user_question_ans_option_id === 0
                  ) {
                    // insert
                    return models.UserQuestionAnsOption.create({
                      user_question_ans_id: item.user_question_ans_id,
                      option_value: option_values.option_value,
                      question_id: item.question_id,
                      question_option_id: option_values.question_option_id,
                      user_id: req.payload.user.user_id,
                      organation_id: user_id,
                    });
                  }
                  return null;
                });
              });
            }
            return obj.update(item);
          }
          if (obj && item.is_delete === 2 && item.is_new === 1) {
            await models.UserQuestionAnsOption.destroy({
              where: {
                user_question_ans_id: item.user_question_ans_id,
              },
            });
            return obj.destroy();
          }
          if (item.is_delete === 1 && item.user_question_ans_id === 0) {
            // insert
            let fileContent = '';
            if (item.question_type === 6) {
              fileContent = item.ans_value;
              item.ans_value = filename;
            }
            const data = await models.UserQuestionAns.create(item, {
              include: [
                {
                  model: models.UserQuestionAnsOption,
                  as: 'user_question_ans_option',
                },
              ],
            });
            if (item.question_type === 6) {
              let folder_path = '';
              const fileFolderPath = FilePath.getFolderConfig().ans_value_image;
              folder_path = fileFolderPath.file_path.replace(
                fileFolderPath.replace,
                data.user_question_ans_id
              );
              folder_path += filename;
              await uploadBase64File(fileContent, folder_path);
              item.ans_value = filename;
              data.update(item);
            }
          }
          return null;
        });
      });
      return response.successResponse(
        req,
        res,
        'admin.store_patient_insurance_details_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deletePatientInsuranceDetails
   * @description Get All Patient Insurance Details
   * @param req,res
   * @returns {Json} success
   */
  async deletePatientInsuranceDetails(req, res) {
    try {
      const { user_id } = req.payload.user;
      const getPatientInsuranceData = await models.Questions.scope(
        'defaultScope',
        'patientInsuranceQuestionsDetails'
      ).findAll({
        order: [
          ['sequence', 'ASC'],
          ['label', 'ASC'],
        ],
        include: [
          {
            model: models.QuestionOptions,
            as: 'question_options',
          },
        ],
      });
      if (getPatientInsuranceData) {
        await models.UserQuestionAnsOption.destroy({
          where: {
            user_id,
            question_option_id: {
              [Op.in]: getPatientInsuranceData.map((val) =>
                val.question_options
                  ? val.question_options.question_option_id
                  : 0
              ),
            },
          },
        }).then(async () => {
          await models.UserQuestionAns.destroy({
            where: {
              user_id,
              question_id: {
                [Op.in]: getPatientInsuranceData.map((val) => val.question_id),
              },
            },
          });
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.delete_patient_insurance_details_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientHowItWorkStore
   * @description Store Patient How It's Work Data.
   * @param req
   * @param res
   * @returns { Json } success
   */
  async patientHowItWorkStore(req, res) {
    try {
      const { fill_step } = req.body;
      const { user_id } = req.payload.user;

      await models.PatientInfo.findOne({
        where: {
          user_id,
        },
      }).then(async (obj) => {
        // Update
        if (obj) {
          if (obj.fill_step === fill_step || fill_step === 3) {
            await models.Users.findOne({
              where: {
                user_id,
              },
            }).then(async (obj1) => {
              // Update
              if (obj1) {
                const updatePatientInfoData = await obj1.update({
                  profile_setup: 1,
                });
                return updatePatientInfoData;
              }
              return obj1;
            });
          }
          const updatePatientInfoData = await obj.update({ fill_step });
          return updatePatientInfoData;
        }
        // insert

        return models.PatientInfo.create({ fill_step, user_id });
      });
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
      };
      if (getuserData.patient_info) {
        userData.patient_info = getuserData.patient_info;
      } else {
        userData.patient_info = '';
      }
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      if (fill_step === 3) {
        if (organizationData && organizationData.dosespot_org_id) {
          await PatientDataSync(user_id, organizationData.dosespot_org_id);
        } else {
          await PatientDataSync(user_id);
        }
      }
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(' ');
      return response.successResponse(
        req,
        res,
        'admin.patient_info_store_success',
        {
          accessToken: bearerToken[1],
          is_email_verified: true,
          userData,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updatePatientStatus
   * @description Patient Update Your Status.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async updatePatientStatus(req, res) {
    try {
      const { reason } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const getPatientData = await models.Users.findOne({
        where: {
          user_id,
          user_type: 3,
          organation_id: organizationData.user_id,
        },
      });
      if (getPatientData) {
        await models.Users.update(
          {
            user_status: getPatientData.user_status === 1 ? 2 : 2,
            user_reason: reason,
          },
          {
            where: {
              user_id,
            },
          }
        );
        if (organizationData) {
          await PatientDataSync(user_id, organizationData.dosespot_org_id);
        } else {
          await PatientDataSync(user_id);
        }
        return response.successResponse(
          req,
          res,
          'admin.patient_deactive_account_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_deactive_account_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new PatientAuthController();
