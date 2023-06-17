const { Joi } = require('express-validation');

class OrganizationValidation {
  addOrganizationValidation() {
    return {
      body: Joi.object({
        first_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.organization_first_name_validation_required',
          'any.required': 'admin.organization_first_name_validation_required',
          'string.base': 'admin.organization_first_name_validation_required',
          'string.min': 'admin.organization_first_name_validation_min',
          'string.max': 'admin.organization_first_name_validation_max',
        }),
        last_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.organization_last_name_validation_required',
          'any.required': 'admin.organization_last_name_validation_required',
          'string.base': 'admin.organization_last_name_validation_required',
          'string.min': 'admin.organization_last_name_validation_min',
          'string.max': 'admin.organization_last_name_validation_max',
        }),
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'admin.organization_email_validation_required',
          'any.required': 'admin.organization_email_validation_required',
          'string.email': 'admin.organization_email_validation_email',
          'string.max': 'admin.organization_email_validation_max',
        }),
        admin_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.organization_admin_status_validation_required',
          'any.base.valid': 'admin.organization_admin_status_validation_valid',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'admin.organization_phone_validation_required',
          'string.max': 'admin.organization_phone_validation_max',
          'string.min': 'admin.organization_phone_validation_min',
          'any.required': 'admin.organization_phone_validation_required',
          'string.empty': 'admin.organization_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.organization_country_id_validation_required',
          'any.required': 'admin.organization_country_id_validation_required',
          'string.empty': 'admin.organization_country_id_validation_required',
        }),
        user_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.organization_user_status_validation_required',
          'any.base.valid': 'admin.organization_user_status_validation_valid',
        }),
      }),
    };
  }

  editOrganizationValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required': 'admin.organization_user_id_validation_required',
        }),
        first_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.organization_first_name_validation_required',
          'any.required': 'admin.organization_first_name_validation_required',
          'string.base': 'admin.organization_first_name_validation_required',
          'string.min': 'admin.organization_first_name_validation_min',
          'string.max': 'admin.organization_first_name_validation_max',
        }),
        last_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'admin.organization_last_name_validation_required',
          'any.required': 'admin.organization_last_name_validation_required',
          'string.base': 'admin.organization_last_name_validation_required',
          'string.min': 'admin.organization_last_name_validation_min',
          'string.max': 'admin.organization_last_name_validation_max',
        }),
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'admin.organization_email_validation_required',
          'any.required': 'admin.organization_email_validation_required',
          'string.email': 'admin.organization_email_validation_email',
          'string.max': 'admin.organization_email_validation_max',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'admin.organization_phone_validation_required',
          'string.max': 'admin.organization_phone_validation_max',
          'string.min': 'admin.organization_phone_validation_min',
          'any.required': 'admin.organization_phone_validation_required',
          'string.empty': 'admin.organization_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'admin.organization_country_id_validation_required',
          'any.required': 'admin.organization_country_id_validation_required',
          'string.empty': 'admin.organization_country_id_validation_required',
        }),
        admin_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.organization_admin_status_validation_required',
          'any.base.valid': 'admin.organization_admin_status_validation_valid',
        }),
        user_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'admin.organization_user_status_validation_required',
          'any.base.valid': 'admin.organization_user_status_validation_valid',
        }),
        reason: Joi.when('admin_status', {
          is: 2,
          then: Joi.string().required().min(3).max(255).messages({
            'string.empty': 'admin.organization_reason_validation_required',
            'any.required': 'admin.organization_reason_validation_required',
            'string.base': 'admin.organization_reason_validation_required',
            'string.min': 'admin.organization_reason_validation_min',
            'string.max': 'admin.organization_reason_validation_max',
          }),
        }),
        timezone_id: Joi.number().required().messages({
          'string.base': 'admin.organization_timezone_id_validation_required',
          'any.required': 'admin.organization_timezone_id_validation_required',
          'string.empty': 'admin.organization_timezone_id_validation_required',
        }),
        is_insurance_required: Joi.number().required().valid(1, 2).messages({
          'any.required':
            'admin.organization_admin_is_insurence_validation_required',
          'any.base.valid':
            'admin.organization_admin_is_insurence_validation_valid',
        }),
        doctor_visit_fee: Joi.optional(),
        telemedicine_platform_fee: Joi.optional(),
      }),
    };
  }

  organizationAdminUserStatusUpdateValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required': 'admin.organization_user_id_validation_required',
        }),
        type: Joi.string().required().valid('admin', 'user').messages({
          'any.required': 'admin.organization_type_validation_required',
          'any.base.valid': 'admin.organization_type_validation_valid',
        }),
        reason: Joi.string().optional().min(3).max(255).messages({
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
module.exports = new OrganizationValidation();
