const { Joi } = require('express-validation');

class SpecialitiesValidation {
  addSpecialitiesValidation() {
    return {
      body: Joi.object({
        name: Joi.string().required().min(4).messages({
          'string.empty': 'admin.specialities_name_validation_required',
          'any.required': 'admin.specialities_name_validation_required',
          'string.base': 'admin.specialities_name_validation_required',
          'string.min': 'admin.specialities_name_validation_min',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.specialities_sequence_validation_required',
            'any.required': 'admin.specialities_sequence_validation_required',
            'any.min': 'admin.specialities_sequence_validation_min',
            'any.max': 'admin.specialities_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.specialities_status_validation_required',
          'any.valid': 'admin.specialities_status_validation_valid',
        }),
      }),
    };
  }

  editSpecialitiesValidation() {
    return {
      body: Joi.object({
        specialities_id: Joi.number().required().messages({
          'any.required': 'admin.specialities_id_validation_required',
        }),
        name: Joi.string().required().min(3).messages({
          'string.empty': 'admin.specialities_name_validation_required',
          'any.required': 'admin.specialities_name_validation_required',
          'string.base': 'admin.specialities_name_validation_required',
          'string.min': 'admin.specialities_name_validation_min',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.specialities_sequence_validation_required',
            'any.required': 'admin.specialities_sequence_validation_required',
            'any.min': 'admin.specialities_sequence_validation_min',
            'any.max': 'admin.specialities_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.specialities_status_validation_required',
          'any.valid': 'admin.specialities_status_validation_valid',
        }),
      }),
    };
  }
}

module.exports = new SpecialitiesValidation();
