const { Joi } = require('express-validation');

class UserValidator {
  editProfileValidation() {
    return {
      body: Joi.object({
        first_name: Joi.string().max(100).trim(true).required().messages({
          'string.base': 'admin.edit_profile_first_name_validation_required',
          'string.max': 'admin.edit_profile_first_name_validation_max',
          'any.required': 'admin.edit_profile_first_name_validation_required',
          'string.empty': 'admin.edit_profile_first_name_validation_required',
        }),
        last_name: Joi.string().max(100).trim(true).required().messages({
          'string.base': 'admin.edit_profile_last_name_validation_required',
          'string.max': 'admin.edit_profile_last_name_validation_max',
          'any.required': 'admin.edit_profile_last_name_validation_required',
          'string.empty': 'admin.edit_profile_last_name_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.edit_profile_country_id_validation_required',
          'any.required': 'admin.edit_profile_country_id_validation_required',
          'string.empty': 'admin.edit_profile_country_id_validation_required',
        }),
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.base': 'admin.edit_profile_email_validation_required',
          'string.max': 'admin.edit_profile_email_validation_max',
          'any.required': 'admin.edit_profile_email_validation_required',
          'string.empty': 'admin.edit_profile_email_validation_required',
          'string.email': 'admin.edit_profile_email_validation_email',
        }),
        phone: Joi.string().required().max(10).trim(true).messages({
          'string.base': 'admin.edit_profile_phone_validation_required',
          'string.max': 'admin.edit_profile_phone_validation_max',
          'any.required': 'admin.edit_profile_phone_validation_required',
          'string.empty': 'admin.edit_profile_phone_validation_required',
        }),
        profile_image: Joi.optional(),
      }),
    };
  }

  editEmailValidation() {
    return {
      body: Joi.object({
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.base': 'admin.edit_profile_email_validation_required',
          'string.max': 'admin.edit_profile_email_validation_max',
          'any.required': 'admin.edit_profile_email_validation_required',
          'string.email': 'admin.edit_profile_email_validation_email',
        }),
      }),
    };
  }

  verifyNewEmailValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.base': 'admin.verify_email_endcode_token_required',
          'any.required': 'admin.verify_email_endcode_token_required',
        }),
        verification_otp: Joi.string()
          .trim(true)
          .required()
          .min(6)
          .max(6)
          .messages({
            'string.base': 'admin.verify_email_verification_otp_required',
            'string.max': 'admin.verify_email_verification_otp_max',
            'string.min': 'admin.verify_email_verification_otp_min',
            'any.required': 'admin.verify_email_verification_otp_required',
          }),
      }),
    };
  }

  resendEmailValidation() {
    return {
      body: Joi.object({
        encoded_token: Joi.string().trim(true).required().messages({
          'string.base': 'admin.verify_email_endcode_token_required',
          'any.required': 'admin.verify_email_endcode_token_required',
        }),
      }),
    };
  }

  changePasswordValidation() {
    return {
      body: Joi.object({
        old_password: Joi.string()
          .min(6)
          .max(255)
          .trim(true)
          .required()
          .label('Old password')
          .messages({
            'string.base': 'admin.old_password_not_empty',
            'string.min': 'admin.old_password_min_length_error',
            'string.max': 'admin.old_password_max_length_exceed',
            'any.required': 'admin.old_password_required',
          }),
        new_password: Joi.string()
          .min(6)
          .max(255)
          .trim(true)
          .required()
          .label('New password')
          .messages({
            'string.base': 'admin.new_password_not_empty',
            'string.min': 'admin.new_password_min_length_error',
            'string.max': 'admin.new_password_max_length_exceed',
            'any.required': 'admin.new_password_required',
          }),
        confirm_password: Joi.string()
          .min(6)
          .max(255)
          .valid(Joi.ref('new_password'))
          .required()
          .label('Confirm password')
          .options({ messages: { 'any.only': '{{#label}} does not match' } })
          .messages({
            'string.base': 'admin.confirm_password_not_empty',
            'string.min': 'admin.confirm_password_min_length_error',
            'string.max': 'admin.confirm_password_max_length_exceed',
            'any.required': 'admin.confirm_password_required',
          }),
      }),
    };
  }

  userImageUploadValidation() {
    return {
      body: Joi.object({
        profile_image: Joi.any().required().messages({
          'string.base': 'admin.user_image_path_required',
          'any.required': 'admin.user_image_path_required',
        }),
      }),
    };
  }
}

module.exports = new UserValidator();
