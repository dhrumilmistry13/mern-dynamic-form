const { Joi } = require('express-validation');

class UserAuthValidator {
  organizationSignupValidation() {
    return {
      body: Joi.object({
        first_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.organization_signup_first_name_validation_required',
          'string.base':
            'admin.organization_signup_first_name_validation_required',
          'string.max': 'admin.organization_signup_first_name_validation_max',
          'any.required':
            'admin.organization_signup_first_name_validation_required',
        }),
        last_name: Joi.string()
          .max(25)
          .trim(true)
          .required()
          .label('Last Name')
          .messages({
            'string.empty':
              'admin.organization_signup_last_name_validation_required',
            'string.base':
              'admin.organization_signup_last_name_validation_required',
            'string.max': 'admin.organization_signup_last_name_validation_max',
            'any.required':
              'admin.organization_signup_last_name_validation_required',
          }),
        email: Joi.string()
          .max(100)
          .email()
          .trim(true)
          .required()
          .label('Email')
          .messages({
            'string.empty':
              'admin.organization_signup_email_validation_required',
            'string.base':
              'admin.organization_signup_email_validation_required',
            'string.max': 'admin.organization_signup_email_validation_max',
            'string.email': 'admin.organization_signup_email_validation_valid',
            'any.required':
              'admin.organization_signup_email_validation_required',
          }),
        country_id: Joi.number().required().messages({
          'string.base':
            'admin.organization_signup_country_id_validation_required',
          'any.required':
            'admin.organization_signup_country_id_validation_required',
          'string.empty':
            'admin.organization_signup_country_id_validation_required',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'admin.organization_signup_phone_validation_required',
          'string.max': 'admin.organization_signup_phone_validation_max',
          'string.min': 'admin.organization_signup_phone_validation_min',
          'any.required': 'admin.organization_signup_phone_validation_required',
          'string.empty': 'admin.organization_signup_phone_validation_required',
        }),
        password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.organization_signup_password_validation_required',
            'string.base':
              'admin.organization_signup_password_validation_required',
            'string.min': 'admin.organization_signup_password_validation_min',
            'string.pattern.base':
              'admin.organization_signup_password_validation_pattern',
            'string.max': 'admin.organization_signup_password_validation_max',
            'any.required':
              'admin.organization_signup_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(6)
          .max(255)
          .valid(Joi.ref('password'))
          .required()
          .label('Confirm password')
          .messages({
            'string.empty':
              'admin.organization_signup_confirm_password_validation_required',
            'string.base':
              'admin.organization_signup_confirm_password_validation_required',
            'string.min':
              'admin.organization_signup_confirm_password_validation_min',
            'string.max':
              'admin.organization_signup_confirm_password_validation_max',
            'any.required':
              'admin.organization_signup_confirm_password_validation_required',
            'string.valid':
              'admin.organization_signup_confirm_password_validation_valid',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
        confirmation_check: Joi.optional(),
      }),
    };
  }

  resendEmailOTPValidation() {
    return {
      body: Joi.object({
        encodedToken: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_verify_email_encoded_token_validation_required',
          'string.base':
            'admin.organization_verify_email_encoded_token_required',
          'any.required':
            'admin.organization_verify_email_encoded_token_required',
        }),
      }),
    };
  }

  verifyOtpValidation() {
    return {
      body: Joi.object({
        encodedToken: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_verify_otp_encoded_token_validation_required',
          'string.base':
            'admin.organization_verify_otp_encoded_token_validation_required',
          'any.required':
            'admin.organization_verify_otp_encoded_token_validation_required',
        }),
        verification_otp: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base':
              'admin.organization_verify_otp_verification_otp_validation_required',
            'any.required':
              'admin.organization_verify_otp_verification_otp_validation_required',
            'any.min':
              'admin.organization_verify_otp_verification_otp_validation_min',
            'any.max':
              'admin.organization_verify_otp_verification_otp_validation_max',
          }),
      }),
    };
  }

  organizationLoginValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.empty': 'admin.organization_login_email_validation_required',
          'string.base': 'admin.organization_login_email_validation_required',
          'string.max': 'admin.organization_login_email_validation_max',
          'any.required': 'admin.organization_login_email_validation_required',
          'string.email': 'admin.organization_login_email_validation_email',
        }),
        password: Joi.string().required().messages({
          'string.empty':
            'admin.organization_login_password_validation_required',
          'string.base':
            'admin.organization_login_password_validation_required',
          'any.required':
            'admin.organization_login_password_validation_required',
        }),
      }),
    };
  }

  organizationForgotPasswordValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'admin.organization_forgot_email_validation_required',
          'any.required': 'admin.organization_forgot_email_validation_required',
          'string.email': 'admin.organization_forgot_email_validation_email',
          'string.max': 'admin.organization_forgot_email_validation_max',
        }),
      }),
    };
  }

  organizationResendOTPValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_resend_otp_encoded_token_validation_required',
          'string.base':
            'admin.organization_resend_otp_encoded_token_validation_required',
          'any.required':
            'admin.organization_resend_otp_encoded_token_validation_required',
        }),
      }),
    };
  }

  organizationverifyForgotEmailOtpValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_verify_otp_encoded_token_validation_required',
          'string.base':
            'admin.organization_verify_otp_encoded_token_validation_required',
          'any.required':
            'admin.organization_verify_otp_encoded_token_validation_required',
        }),
        verification_otp: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base':
              'admin.organization_verify_otp_verification_otp_validation_required',
            'any.required':
              'admin.organization_verify_otp_verification_otp_validation_required',
            'any.min':
              'admin.organization_verify_otp_verification_otp_validation_min',
            'any.max':
              'admin.organization_verify_otp_verification_otp_validation_max',
          }),
      }),
    };
  }

  organizationResetPasswordValidation() {
    return {
      body: Joi.object({
        reset_token: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_reset_password_reset_token_validation_required',
          'string.base':
            'admin.organization_reset_password_reset_token_validation_required',
          'any.required':
            'admin.organization_reset_password_reset_token_validation_required',
        }),
        new_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.organization_reset_password_new_password_validation_required',
            'string.base':
              'admin.organization_reset_password_new_password_validation_required',
            'string.min':
              'admin.organization_reset_password_new_password_validation_min',
            'string.pattern.base':
              'admin.organization_reset_password_new_password_validation_pattern',
            'string.max':
              'admin.organization_reset_password_new_password_validation_max',
            'any.required':
              'admin.organization_reset_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(8)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .messages({
            'string.empty':
              'admin.organization_reset_password_confirm_password_validation_required',
            'string.base':
              'admin.organization_reset_password_confirm_password_validation_required',
            'string.min':
              'admin.organization_reset_password_confirm_password_min_length_error',
            'string.max':
              'admin.organization_reset_password_confirm_password_max_length_exceed',
            'any.required':
              'admin.organization_reset_password_confirm_password_validation_required',
            'string.valid':
              'admin.organization_reset_password_confirm_password_validation_valid',
            'string.pattern.base':
              'admin.organization_reset_password_new_password_validation_pattern',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    };
  }

  organizationSetPasswordValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'number.empty':
            'admin.organization_set_password_user_id_validation_required',
          'number.base':
            'admin.organization_set_password_user_id_validation_required',
          'any.required':
            'admin.organization_set_password_user_id_validation_required',
        }),
        new_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.organization_set_password_new_password_validation_required',
            'string.base':
              'admin.organization_set_password_new_password_validation_required',
            'string.min':
              'admin.organization_set_password_new_password_validation_min',
            'string.pattern.base':
              'admin.organization_set_password_new_password_validation_pattern',
            'string.max':
              'admin.organization_set_password_new_password_validation_max',
            'any.required':
              'admin.organization_set_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(8)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .messages({
            'string.empty':
              'admin.organization_set_password_confirm_password_validation_required',
            'string.base':
              'admin.organization_set_password_confirm_password_validation_required',
            'string.min':
              'admin.organization_set_password_confirm_password_min_length_error',
            'string.max':
              'admin.organization_set_password_confirm_password_max_length_exceed',
            'any.required':
              'admin.organization_set_password_confirm_password_validation_required',
            'string.valid':
              'admin.organization_set_password_confirm_password_validation_valid',
            'string.pattern.base':
              'admin.organization_set_password_confirm_password_validation_pattern',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),

        timezone: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_set_password_timezone_validation_required',
          'string.base':
            'admin.organization_set_password_timezone_validation_required',
          'any.required':
            'admin.organization_set_password_timezone_validation_required',
        }),
      }),
    };
  }

  editOrganizationProfileValidation() {
    return {
      body: Joi.object({
        user_id: Joi.string().trim(true).required().messages({
          'string.empty':
            'admin.organization_profile_user_id_validation_required',
          'string.base':
            'admin.organization_profile_user_id_validation_required',
          'any.required':
            'admin.organization_profile_user_id_validation_required',
        }),
        first_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.organization_profile_first_name_validation_required',
          'string.base':
            'admin.organization_profile_first_name_validation_required',
          'string.max': 'admin.organization_profile_first_name_validation_max',
          'any.required':
            'admin.organization_profile_first_name_validation_required',
        }),
        last_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.organization_profile_last_name_validation_required',
          'string.base':
            'admin.organization_profile_last_name_validation_required',
          'string.max': 'admin.organization_profile_last_name_validation_max',
          'any.required':
            'admin.organization_profile_last_name_validation_required',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base':
            'admin.edit_organization_profile_phone_validation_required',
          'string.max': 'admin.edit_organization_profile_phone_validation_max',
          'string.min': 'admin.edit_organization_profile_phone_validation_min',
          'any.required':
            'admin.edit_organization_profile_phone_validation_required',
          'string.empty':
            'admin.edit_organization_profile_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.edit_profile_country_id_validation_required',
          'any.required': 'admin.edit_profile_country_id_validation_required',
          'string.empty': 'admin.edit_profile_country_id_validation_required',
        }),
        profile_image: Joi.optional(),
        timezone_id: Joi.number().required().messages({
          'string.base': 'admin.edit_profile_timezone_id_validation_required',
          'any.required': 'admin.edit_profile_timezone_id_validation_required',
          'string.empty': 'admin.edit_profile_timezone_id_validation_required',
        }),
        is_insurance_required: Joi.optional(),
        doctor_visit_fee: Joi.optional(),
      }),
    };
  }

  editOrganizationEmailValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.base':
            'admin.edit_organization_profile_email_validation_required',
          'string.max': 'admin.edit_organization_profile_email_validation_max',
          'any.required':
            'admin.edit_organization_profile_email_validation_required',
          'string.email':
            'admin.edit_organization_profile_email_validation_email',
        }),
      }),
    };
  }

  verifyNewOrganizationEmailValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.base':
            'admin.organization_verify_email_endcode_token_required',
          'any.required':
            'admin.organization_verify_email_endcode_token_required',
        }),
        verification_otp: Joi.string()
          .trim(true)
          .required()
          .min(6)
          .max(6)
          .messages({
            'string.base':
              'admin.organization_verify_email_verification_otp_required',
            'string.max':
              'admin.organization_verify_email_verification_otp_max',
            'string.min':
              'admin.organization_verify_email_verification_otp_min',
            'any.required':
              'admin.organization_verify_email_verification_otp_required',
          }),
      }),
    };
  }

  organizationResendEmailValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.base':
            'admin.organization_verify_email_endcode_token_required',
          'any.required':
            'admin.organization_verify_email_endcode_token_required',
        }),
      }),
    };
  }

  organizationchangePasswordValidation() {
    return {
      body: Joi.object({
        old_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .required()
          .messages({
            'string.base':
              'admin.organization_change_password_old_password_validation_required',
            'string.min':
              'admin.organization_change_password_old_password_validation_min',
            'string.max':
              'admin.organization_change_password_old_password_validation_max',
            'any.required':
              'admin.organization_change_password_old_password_validation_required',
          }),
        new_password: Joi.string()
          .min(8)
          .max(255)
          .trim(true)
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .required()
          .messages({
            'string.empty':
              'admin.organization_change_password_new_password_validation_required',
            'string.base':
              'admin.organization_change_password_new_password_validation_required',
            'string.min':
              'admin.organization_change_password_new_password_validation_min',
            'string.pattern.base':
              'admin.organization_change_password_new_password_validation_pattern',
            'string.max':
              'admin.organization_change_password_new_password_validation_max',
            'any.required':
              'admin.organization_change_password_new_password_validation_required',
          }),
        confirm_password: Joi.string()
          .min(8)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
          .messages({
            'string.empty':
              'admin.organization_change_password_confirm_password_validation_required',
            'string.base':
              'admin.organization_change_password_confirm_password_validation_required',
            'string.min':
              'admin.organization_change_password_confirm_password_min_length_error',
            'string.max':
              'admin.organization_change_password_confirm_password_max_length_exceed',
            'any.required':
              'admin.organization_change_password_confirm_password_validation_required',
            'string.valid':
              'admin.organization_change_password_confirm_password_validation_valid',
            'string.pattern.base':
              'admin.organization_change_password_confirm_password_validation_pattern',
          })
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      }),
    };
  }

  organizationStatusUpdateValidation() {
    return {
      body: Joi.object({
        reason: Joi.string().required().min(3).max(255).messages({
          'string.empty': 'admin.organization_reason_validation_required',
          'any.required': 'admin.organization_reason_validation_required',
          'string.base': 'admin.organization_reason_validation_required',
          'string.min': 'admin.organization_reason_validation_min',
          'string.max': 'admin.organization_reason_validation_max',
        }),
      }),
    };
  }
}
module.exports = new UserAuthValidator();
