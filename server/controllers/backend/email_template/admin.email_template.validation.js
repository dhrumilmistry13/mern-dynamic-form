const { Joi } = require('express-validation');

class EmailTemplateValidation {
  addEmailTemplateValidation() {
    return {
      body: Joi.object({
        email_template_key: Joi.string()
          .required()
          .min(5)
          .lowercase()
          .max(50)
          .pattern(/^[A-Za-z&-]*$/)
          .messages({
            'string.empty':
              'admin.email_template_email_template_key_validation_required',
            'any.required':
              'admin.email_template_email_template_key_validation_required',
            'string.lowercase':
              'admin.email_template_email_template_key_validation_lowercase',
            'string.pattern.base':
              'admin.email_template_email_template_key_validation_pattern',
            'string.base':
              'admin.email_template_email_template_key_validation_required',
            'string.min':
              'admin.email_template_email_template_key_validation_min',
            'string.max':
              'admin.email_template_email_template_key_validation_max',
          }),
        title: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_title_validation_required',
          'any.required': 'admin.email_template_title_validation_required',
          'string.base': 'admin.email_template_title_validation_required',
          'string.min': 'admin.email_template_title_validation_min',
          'string.max': 'admin.email_template_title_validation_max',
        }),
        parameter: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_parameter_validation_required',
          'any.required': 'admin.email_template_parameter_validation_required',
          'string.base': 'admin.email_template_parameter_validation_required',
          'string.min': 'admin.email_template_parameter_validation_min',
          'string.max': 'admin.email_template_parameter_validation_max',
        }),
        subject: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_subject_validation_required',
          'any.required': 'admin.email_template_subject_validation_required',
          'string.base': 'admin.email_template_subject_validation_required',
          'string.min': 'admin.email_template_subject_validation_min',
          'string.max': 'admin.email_template_subject_validation_max',
        }),
        content: Joi.string().required().messages({
          'string.empty': 'admin.email_template_content_validation_required',
          'any.required': 'admin.email_template_content_validation_required',
          'string.base': 'admin.email_template_content_validation_required',
        }),
      }),
    };
  }

  editEmailTemplateValidation() {
    return {
      body: Joi.object({
        email_template_id: Joi.number().required().messages({
          'any.required':
            'admin.email_template_email_template_id_validation_required',
        }),
        email_template_key: Joi.string()
          .required()
          .min(5)
          .lowercase()
          .max(50)
          .pattern(/^[A-Za-z&-]*$/)
          .messages({
            'string.empty':
              'admin.email_template_email_template_key_validation_required',
            'any.required':
              'admin.email_template_email_template_key_validation_required',
            'string.pattern.base':
              'admin.email_template_email_template_key_validation_pattern',
            'string.lowercase':
              'admin.email_template_email_template_key_validation_lowercase',
            'string.base':
              'admin.email_template_email_template_key_validation_required',
            'string.min':
              'admin.email_template_email_template_key_validation_min',
            'string.max':
              'admin.email_template_email_template_key_validation_max',
          }),
        title: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_title_validation_required',
          'any.required': 'admin.email_template_title_validation_required',
          'string.base': 'admin.email_template_title_validation_required',
          'string.min': 'admin.email_template_title_validation_min',
          'string.max': 'admin.email_template_title_validation_max',
        }),
        parameter: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_parameter_validation_required',
          'any.required': 'admin.email_template_parameter_validation_required',
          'string.base': 'admin.email_template_parameter_validation_required',
          'string.min': 'admin.email_template_parameter_validation_min',
          'string.max': 'admin.email_template_parameter_validation_max',
        }),
        subject: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.email_template_subject_validation_required',
          'any.required': 'admin.email_template_subject_validation_required',
          'string.base': 'admin.email_template_subject_validation_required',
          'string.min': 'admin.email_template_subject_validation_min',
          'string.max': 'admin.email_template_subject_validation_max',
        }),
        content: Joi.string().required().messages({
          'string.empty': 'admin.email_template_content_validation_required',
          'any.required': 'admin.email_template_content_validation_required',
          'string.base': 'admin.email_template_content_validation_required',
        }),
      }),
    };
  }
}
module.exports = new EmailTemplateValidation();
