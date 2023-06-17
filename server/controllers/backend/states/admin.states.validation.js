const { Joi } = require('express-validation');

class StatesValidation {
  addStatesValidation() {
    return {
      body: Joi.object({
        name: Joi.string().required().min(4).messages({
          'any.required': 'admin.states_name_validation_required',
          'string.empty': 'admin.states_name_validation_required',
          'string.base': 'admin.states_name_validation_required',
          'string.min': 'admin.states_name_validation_min',
        }),
        short_code: Joi.string().required().min(0).messages({
          'any.required': 'admin.states_short_code_validation_required',
          'string.empty': 'admin.states_short_code_validation_required',
          'string.base': 'admin.states_short_code_validation_required',
          'string.min': 'admin.states_short_code_validation_min',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.states_sequence_validation_required',
            'any.required': 'admin.states_sequence_validation_required',
            'any.min': 'admin.states_sequence_validation_min',
            'any.max': 'admin.states_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.states_status_validation_required',
          'any.valid': 'admin.states_status_validation_valid',
        }),
      }),
    };
  }

  editStatesValidation() {
    return {
      body: Joi.object({
        state_id: Joi.number().required().messages({
          'any.required': 'admin.states_id_validation_required',
        }),
        name: Joi.string().required().min(4).messages({
          'any.required': 'admin.states_name_validation_required',
          'string.empty': 'admin.states_name_validation_required',
          'string.base': 'admin.states_name_validation_required',
          'string.min': 'admin.states_name_validation_min',
        }),
        short_code: Joi.string().required().min(0).messages({
          'any.required': 'admin.states_short_code_validation_required',
          'string.empty': 'admin.states_short_code_validation_required',
          'string.base': 'admin.states_short_code_validation_required',
          'string.min': 'admin.states_short_code_validation_min',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.states_sequence_validation_required',
            'any.required': 'admin.states_sequence_validation_required',
            'any.min': 'admin.states_sequence_validation_min',
            'any.max': 'admin.states_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.states_status_validation_required',
          'any.valid': 'admin.states_status_validation_valid',
        }),
      }),
    };
  }
}
module.exports = new StatesValidation();
