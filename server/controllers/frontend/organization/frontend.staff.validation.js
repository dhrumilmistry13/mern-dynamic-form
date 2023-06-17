const { Joi } = require('express-validation');

class StaffValidation {
  addStaffValidation() {
    return {
      body: Joi.object({
        first_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'front.staff_first_name_validation_required',
          'any.required': 'front.staff_first_name_validation_required',
          'string.base': 'front.staff_first_name_validation_required',
          'string.min': 'front.staff_first_name_validation_min',
          'string.max': 'front.staff_first_name_validation_max',
        }),
        last_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'front.staff_last_name_validation_required',
          'any.required': 'front.staff_last_name_validation_required',
          'string.base': 'front.staff_last_name_validation_required',
          'string.min': 'front.staff_last_name_validation_min',
          'string.max': 'front.staff_last_name_validation_max',
        }),
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'front.staff_email_validation_required',
          'any.required': 'front.staff_email_validation_required',
          'string.email': 'front.staff_email_validation_email',
          'string.max': 'front.staff_email_validation_max',
        }),
        admin_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'front.staff_admin_status_validation_required',
          'any.base.valid': 'front.staff_admin_status_validation_valid',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'front.staff_phone_validation_required',
          'string.max': 'front.staff_phone_validation_max',
          'string.min': 'front.staff_phone_validation_min',
          'any.required': 'front.staff_phone_validation_required',
          'string.empty': 'front.staff_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'front.staff_country_id_validation_required',
          'any.required': 'front.staff_country_id_validation_required',
          'string.empty': 'front.staff_country_id_validation_required',
        }),
        user_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'front.staff_user_status_validation_required',
          'any.base.valid': 'front.staff_user_status_validation_valid',
        }),
        type: Joi.number().required().valid(4, 5, 6).messages({
          'any.required': 'front.staff_type_validation_required',
          'any.base.valid': 'front.staff_type_validation_valid',
        }),
      }),
    };
  }

  editStaffValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required': 'front.staff_user_id_validation_required',
        }),
        first_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'front.staff_first_name_validation_required',
          'any.required': 'front.staff_first_name_validation_required',
          'string.base': 'front.staff_first_name_validation_required',
          'string.min': 'front.staff_first_name_validation_min',
          'string.max': 'front.staff_first_name_validation_max',
        }),
        last_name: Joi.string().required().min(3).max(50).messages({
          'string.empty': 'front.staff_last_name_validation_required',
          'any.required': 'front.staff_last_name_validation_required',
          'string.base': 'front.staff_last_name_validation_required',
          'string.min': 'front.staff_last_name_validation_min',
          'string.max': 'front.staff_last_name_validation_max',
        }),
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty': 'front.staff_email_validation_required',
          'any.required': 'front.staff_email_validation_required',
          'string.email': 'front.staff_email_validation_email',
          'string.max': 'front.staff_email_validation_max',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base': 'front.staff_phone_validation_required',
          'string.max': 'front.staff_phone_validation_max',
          'string.min': 'front.staff_phone_validation_min',
          'any.required': 'front.staff_phone_validation_required',
          'string.empty': 'front.staff_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base': 'front.staff_country_id_validation_required',
          'any.required': 'front.staff_country_id_validation_required',
          'string.empty': 'front.staff_country_id_validation_required',
        }),
        admin_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'front.staff_admin_status_validation_required',
          'any.base.valid': 'front.staff_admin_status_validation_valid',
        }),
        user_status: Joi.number().required().valid(1, 2).messages({
          'any.required': 'front.staff_user_status_validation_required',
          'any.base.valid': 'front.staff_user_status_validation_valid',
        }),
        reason: Joi.when('admin_status', {
          is: 2,
          then: Joi.string().required().min(3).max(255).messages({
            'string.empty': 'front.staff_reason_validation_required',
            'any.required': 'front.staff_reason_validation_required',
            'string.base': 'front.staff_reason_validation_required',
            'string.min': 'front.staff_reason_validation_min',
            'string.max': 'front.staff_reason_validation_max',
          }),
        }),
      }),
    };
  }

  staffAdminUserStatusUpdateValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required': 'front.staff_user_id_validation_required',
        }),
        type: Joi.string().required().valid('admin', 'user').messages({
          'any.required': 'front.staff_type_validation_required',
          'any.base.valid': 'front.staff_type_validation_valid',
        }),
        reason: Joi.string().optional().min(3).max(255).messages({
          'string.empty': 'front.staff_reason_validation_required',
          'any.required': 'front.staff_reason_validation_required',
          'string.base': 'front.staff_reason_validation_required',
          'string.min': 'front.staff_reason_validation_min',
          'string.max': 'front.staff_reason_validation_max',
        }),
      }),
    };
  }

  staffGeneralInfoStoreValidation() {
    return {
      body: Joi.object({
        dob: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_dob_validation_required',
          'any.required':
            'admin.organization_general_info_dob_validation_required',
          'string.empty':
            'admin.organization_general_info_dob_validation_required',
        }),
        phone: Joi.optional(),
        country_id: Joi.optional(),
        npi_number: Joi.number().required().messages({
          'number.base':
            'admin.organization_general_info_npi_number_validation_required',
          'any.required':
            'admin.organization_general_info_npi_number_validation_required',
          'number.empty':
            'admin.organization_general_info_npi_number_validation_required',
        }),
        address: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_address_validation_required',
          'any.required':
            'admin.organization_general_info_address_validation_required',
          'string.empty':
            'admin.organization_general_info_address_validation_required',
        }),
        city: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_city_validation_required',
          'any.required':
            'admin.organization_general_info_city_validation_required',
          'string.empty':
            'admin.organization_general_info_city_validation_required',
        }),
        state: Joi.number().required().messages({
          'any.required':
            'admin.organization_general_info_state_validation_required',
        }),
        postcode: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_postcode_validation_required',
          'any.required':
            'admin.organization_general_info_postcode_validation_required',
          'string.empty':
            'admin.organization_general_info_postcode_validation_required',
        }),
        country: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_general_info_country_validation_required',
          'any.required':
            'admin.organization_general_info_country_validation_required',
          'string.empty':
            'admin.organization_general_info_country_validation_required',
        }),
      }),
    };
  }
}
module.exports = new StaffValidation();
