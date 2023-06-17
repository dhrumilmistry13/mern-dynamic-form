const { Joi } = require('express-validation');

class FormularyValidation {
  addFormularyValidation() {
    return {
      body: Joi.object({
        name: Joi.string().required().min(3).max(150).messages({
          'string.empty': 'admin.formulary_name_validation_required',
          'any.required': 'admin.formulary_name_validation_required',
          'string.base': 'admin.formulary_name_validation_required',
          'string.min': 'admin.formulary_name_validation_min',
          'string.max': 'admin.formulary_name_validation_max',
        }),
        dosage_amount: Joi.string().required().min(0).max(150).messages({
          'string.empty': 'admin.formulary_dosage_amount_validation_required',
          'any.required': 'admin.formulary_dosage_amount_validation_required',
          'string.base': 'admin.formulary_dosage_amount_validation_required',
          'string.min': 'admin.formulary_dosage_amount_validation_min',
          'string.max': 'admin.formulary_dosage_amount_validation_max',
        }),
        ndc: Joi.string().required().min(3).max(150).messages({
          'string.empty': 'admin.formulary_ndc_validation_required',
          'any.required': 'admin.formulary_ndc_validation_required',
          'string.base': 'admin.formulary_ndc_validation_required',
          'string.min': 'admin.formulary_ndc_validation_min',
          'string.max': 'admin.formulary_ndc_validation_max',
        }),

        featured_image: Joi.optional(),
        price: Joi.string()
          .pattern(/^\d{1,3}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.formulary_price_validation_required',
            'string.pattern.base':
              'admin.formulary_price_validation_required_pattern',
          }),
        description: Joi.string().required().min(3).messages({
          'string.empty': 'admin.formulary_description_validation_required',
          'any.required': 'admin.formulary_description_validation_required',
          'string.base': 'admin.formulary_description_validation_required',
          'string.min': 'admin.formulary_description_validation_min',
          'string.max': 'admin.formulary_description_validation_max',
        }),
        short_description: Joi.string().required().min(3).messages({
          'string.empty':
            'admin.formulary_short_description_validation_required',
          'any.required':
            'admin.formulary_short_description_validation_required',
          'string.base':
            'admin.formulary_short_description_validation_required',
          'string.min': 'admin.formulary_short_description_validation_min',
          'string.max': 'admin.formulary_short_description_validation_max',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.formulary_sequence_validation_required',
            'any.required': 'admin.formulary_sequence_validation_required',
            'any.min': 'admin.formulary_sequence_validation_min',
            'any.max': 'admin.formulary_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.formulary_status_validation_required',
          'any.base.valid': 'admin.formulary_status_validation_valid',
        }),
        is_appointment_required: Joi.string()
          .required()
          .valid('1', '2')
          .messages({
            'any.required':
              'admin.formulary_is_appointment_required_validation_required',
            'any.base.valid':
              'admin.formulary_is_appointment_required_validation_valid',
          }),
        packing_shipping_fee: Joi.optional(),
        formulary_image: Joi.array().items(
          Joi.object().keys({
            image_name: Joi.optional(),
          })
        ),
      }),
    };
  }

  editFormularyValidation() {
    return {
      body: Joi.object({
        formulary_id: Joi.number().required().messages({
          'any.required': 'admin.formulary_formulary_id_validation_required',
        }),
        name: Joi.string().required().min(3).max(150).messages({
          'string.empty': 'admin.formulary_name_validation_required',
          'any.required': 'admin.formulary_name_validation_required',
          'string.base': 'admin.formulary_name_validation_required',
          'string.min': 'admin.formulary_name_validation_min',
          'string.max': 'admin.formulary_name_validation_max',
        }),
        dosage_amount: Joi.string().required().min(0).max(150).messages({
          'string.empty': 'admin.formulary_dosage_amount_validation_required',
          'any.required': 'admin.formulary_dosage_amount_validation_required',
          'string.base': 'admin.formulary_dosage_amount_validation_required',
          'string.min': 'admin.formulary_dosage_amount_validation_min',
          'string.max': 'admin.formulary_dosage_amount_validation_max',
        }),
        ndc: Joi.string().required().min(3).max(150).messages({
          'string.empty': 'admin.formulary_ndc_validation_required',
          'any.required': 'admin.formulary_ndc_validation_required',
          'string.base': 'admin.formulary_ndc_validation_required',
          'string.min': 'admin.formulary_ndc_validation_min',
          'string.max': 'admin.formulary_ndc_validation_max',
        }),
        featured_image: Joi.optional(),
        price: Joi.string()
          .pattern(/^\d{1,3}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required': 'admin.formulary_price_validation_required',
            'string.pattern.base':
              'admin.formulary_price_validation_required_pattern',
          }),
        description: Joi.string().required().min(3).messages({
          'string.empty': 'admin.formulary_description_validation_required',
          'any.required': 'admin.formulary_description_validation_required',
          'string.base': 'admin.formulary_description_validation_required',
          'string.min': 'admin.formulary_description_validation_min',
          'string.max': 'admin.formulary_description_validation_max',
        }),
        short_description: Joi.string().required().min(3).messages({
          'string.empty':
            'admin.formulary_short_description_validation_required',
          'any.required':
            'admin.formulary_short_description_validation_required',
          'string.base':
            'admin.formulary_short_description_validation_required',
          'string.min': 'admin.formulary_short_description_validation_min',
          'string.max': 'admin.formulary_short_description_validation_max',
        }),
        sequence: Joi.number()
          .integer()
          .max(999999)
          .min(0)
          .required()
          .messages({
            'number.base': 'admin.formulary_sequence_validation_required',
            'any.required': 'admin.formulary_sequence_validation_required',
            'any.min': 'admin.formulary_sequence_validation_min',
            'any.max': 'admin.formulary_sequence_validation_max',
          }),
        status: Joi.string().required().valid('1', '2').messages({
          'any.required': 'admin.formulary_status_validation_required',
          'any.base.valid': 'admin.formulary_status_validation_valid',
        }),
        is_appointment_required: Joi.string()
          .required()
          .valid('1', '2')
          .messages({
            'any.required':
              'admin.formulary_is_appointment_required_validation_required',
            'any.base.valid':
              'admin.formulary_is_appointment_required_validation_valid',
          }),
        packing_shipping_fee: Joi.optional(),
        formulary_image: Joi.any().optional(),
      }),
    };
  }
}
module.exports = new FormularyValidation();
