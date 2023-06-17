const { Joi } = require('express-validation');

class AdminAuthValidator {
  loginValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.empty': 'admin.auth_email_validation_required',
          'string.base': 'admin.auth_email_validation_required',
          'string.max': 'admin.login_email_validation_max',
          'any.required': 'admin.auth_email_validation_required',
          'string.email': 'admin.auth_email_validation_email',
        }),
        password: Joi.string().required().messages({
          'string.empty': 'admin.auth_password_validation_required',
          'string.base': 'admin.auth_password_validation_required',
          'any.required': 'admin.auth_password_validation_required',
        }),
      }),
    };
  }

  forgotPasswordValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'admin.forgot_email_validation_required',
          'any.required': 'admin.forgot_email_validation_required',
          'string.email': 'admin.forgot_email_validation_email',
          'string.max': 'admin.forgot_email_validation_max',
        }),
      }),
    };
  }

  resendOTPValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty': 'admin.resend_otp_encoded_token_validation_required',
          'string.base': 'admin.resend_otp_encoded_token_validation_required',
          'any.required': 'admin.resend_otp_encoded_token_validation_required',
        }),
      }),
    };
  }

  verifyForgotEmailOtpValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty': 'admin.verify_otp_encoded_token_validation_required',
          'string.base': 'admin.verify_otp_encoded_token_validation_required',
          'any.required': 'admin.verify_otp_encoded_token_validation_required',
        }),
        verification_otp: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base':
              'admin.verify_otp_verification_otp_validation_required',
            'any.required':
              'admin.verify_otp_verification_otp_validation_required',
            'any.min': 'admin.verify_otp_verification_otp_validation_min',
            'any.max': 'admin.verify_otp_verification_otp_validation_max',
          }),
      }),
    };
  }

  resetPasswordValidation() {
    return {
      body: Joi.object({
        reset_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.reset_password_reset_token_validation_required',
          'string.base': 'admin.reset_password_reset_token_validation_required',
          'any.required':
            'admin.reset_password_reset_token_validation_required',
        }),
        new_password: Joi.string()
          .min(6)
          .max(255)
          .trim(true)
          .required()
          .label('New password')
          .messages({
            'string.empty':
              'admin.reset_password_new_password_validation_required',
            'string.base':
              'admin.reset_password_new_password_validation_required',
            'string.min': 'admin.reset_password_new_password_validation_min',
            'string.max': 'admin.reset_password_new_password_validation_max',
            'any.required':
              'admin.reset_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(6)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .label('Confirm password')
          .messages({
            'string.empty': 'admin.auth_confirm_password_validation_required',
            'string.base': 'admin.auth_confirm_password_validation_required',
            'string.min':
              'admin.reset_password_confirm_password_min_length_error',
            'string.max':
              'admin.reset_password_confirm_password_max_length_exceed',
            'any.required': 'admin.auth_confirm_password_validation_required',
            'string.valid':
              'admin.reset_password_confirm_password_validation_valid',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    };
  }
}
module.exports = new AdminAuthValidator();
