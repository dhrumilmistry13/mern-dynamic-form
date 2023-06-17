const { Joi } = require('express-validation');

class PatientValidation {
  patientStatusUpdateValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required': 'admin.patient_user_id_validation_required',
        }),
        type: Joi.string().required().valid('admin', 'user').messages({
          'any.required': 'admin.patient_type_validation_required',
          'any.base.valid': 'admin.patient_type_validation_valid',
        }),
        reason: Joi.string().optional().min(3).max(255).messages({
          'string.empty': 'admin.patient_reason_validation_required',
          'any.required': 'admin.patient_reason_validation_required',
          'string.base': 'admin.patient_reason_validation_required',
          'string.min': 'admin.patient_reason_validation_min',
          'string.max': 'admin.patient_reason_validation_max',
        }),
      }),
    };
  }

  editPatientProfileValidation() {
    return {
      body: Joi.object({
        user_id: Joi.number().required().messages({
          'any.required':
            'admin.patient_general_details_user_id_validation_required',
        }),
        first_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.patient_general_details_first_name_validation_required',
          'string.base':
            'admin.patient_general_details_first_name_validation_required',
          'string.max':
            'admin.patient_general_details_first_name_validation_max',
          'any.required':
            'admin.patient_general_details_first_name_validation_required',
        }),
        last_name: Joi.string().max(25).trim(true).required().messages({
          'string.empty':
            'admin.patient_general_details_last_name_validation_required',
          'string.base':
            'admin.patient_general_details_last_name_validation_required',
          'string.max':
            'admin.patient_general_details_last_name_validation_max',
          'any.required':
            'admin.patient_general_details_last_name_validation_required',
        }),
        email: Joi.string().max(100).trim(true).required().messages({
          'string.empty':
            'admin.patient_general_details__email_validation_required',
          'any.required':
            'admin.patient_general_details__email_validation_required',
          'string.email':
            'admin.patient_general_details__email_validation_email',
          'string.max': 'admin.patient_general_details__email_validation_max',
        }),
        dob: Joi.string().max(100).trim(true).required().messages({
          'string.empty':
            'admin.patient_general_details__dob_validation_required',
          'any.required':
            'admin.patient_general_details__dob_validation_required',
          'string.max': 'admin.patient_general_details__dob_validation_max',
        }),
        admin_status: Joi.number().required().valid(1, 2).messages({
          'any.required':
            'admin.patient_general_details__admin_status_validation_required',
          'any.base.valid':
            'admin.patient_general_details__admin_status_validation_valid',
        }),
        user_status: Joi.number().required().valid(1, 2).messages({
          'any.required':
            'admin.patient_general_details__user_status_validation_required',
          'any.base.valid':
            'admin.patient_general_details__user_status_validation_valid',
        }),
        phone: Joi.string().required().min(10).max(10).trim(true).messages({
          'string.base':
            'admin.patient_general_details_phone_validation_required',
          'string.max': 'admin.patient_general_details_phone_validation_max',
          'string.min': 'admin.patient_general_details_phone_validation_min',
          'any.required':
            'admin.patient_general_details_phone_validation_required',
          'string.empty':
            'admin.patient_general_details_phone_validation_required',
        }),
        country_id: Joi.number().required().messages({
          'string.base':
            'admin.patient_general_details_country_id_validation_required',
          'any.required':
            'admin.patient_general_details_country_id_validation_required',
          'string.empty':
            'admin.patient_general_details_country_id_validation_required',
        }),
        reason: Joi.when('admin_status', {
          is: 2,
          then: Joi.string().required().min(3).max(255).messages({
            'string.empty':
              'admin.patient_general_details__reason_validation_required',
            'any.required':
              'admin.patient_general_details__reason_validation_required',
            'string.base':
              'admin.patient_general_details__reason_validation_required',
            'string.min':
              'admin.patient_general_details__reason_validation_min',
            'string.max':
              'admin.patient_general_details__reason_validation_max',
          }),
        }),
        organation_id: Joi.number().optional(),
      }),
    };
  }
}

module.exports = new PatientValidation();
