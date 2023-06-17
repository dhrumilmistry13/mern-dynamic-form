const { Joi } = require('express-validation');

class TranslationValidation {
  addTranslationValidation() {
    return {
      body: Joi.object({
        key: Joi.string()
          .required()
          .min(3)
          .lowercase()
          .max(200)
          .pattern(/^[A-Za-z0-9&_.]*$/)
          .messages({
            'any.required': 'admin.translation_key_validation_required',
            'string.empty': 'admin.translation_key_validation_required',
            'string.lowercase': 'admin.translation_key_validation_lowercase',
            'string.pattern.base': 'admin.translation_key_validation_pattern',
            'string.base': 'admin.translation_key_validation_required',
            'string.min': 'admin.translation_key_validation_min',
            'string.max': 'admin.translation_key_validation_max',
          }),
        text: Joi.string().required().min(3).messages({
          'any.required': 'admin.translation_text_validation_required',
          'string.empty': 'admin.translation_text_validation_required',
          'string.base': 'admin.translation_text_validation_required',
          'string.min': 'admin.translation_text_validation_min',
          'string.max': 'admin.translation_text_validation_max',
        }),
      }),
    };
  }

  editTranslationValidation() {
    return {
      body: Joi.object({
        translation_id: Joi.number().required().messages({
          'any.required':
            'admin.translation_translation_id_validation_required',
        }),
        key: Joi.string()
          .required()
          .min(1)
          .lowercase()
          .max(200)
          .pattern(/^[A-Za-z0-9&_.]*$/)
          .messages({
            'any.required': 'admin.translation_key_validation_required',
            'string.empty': 'admin.translation_key_validation_required',
            'string.lowercase': 'admin.translation_key_validation_lowercase',
            'string.pattern.base': 'admin.translation_key_validation_pattern',
            'string.base': 'admin.translation_key_validation_required',
            'string.min': 'admin.translation_key_validation_min',
            'string.max': 'admin.translation_key_validation_max',
          }),
        text: Joi.string().required().min(3).messages({
          'any.required': 'admin.translation_text_validation_required',
          'string.empty': 'admin.translation_text_validation_required',
          'string.base': 'admin.translation_text_validation_required',
          'string.min': 'admin.translation_text_validation_min',
          'string.max': 'admin.translation_text_validation_max',
        }),
      }),
    };
  }
}
module.exports = new TranslationValidation();
