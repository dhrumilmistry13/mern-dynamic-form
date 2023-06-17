const { Joi } = require('express-validation');

class CMSValidation {
  addCMSValidation() {
    return {
      body: Joi.object({
        slug: Joi.string()
          .required()
          .min(5)
          .lowercase()
          .max(100)
          .pattern(/^[A-Za-z&-]*$/)
          .messages({
            'string.empty': 'admin.cms_slug_validation_required',
            'any.required': 'admin.cms_slug_validation_required',
            'string.lowercase': 'admin.cms_slug_validation_lowercase',
            'string.pattern.base': 'admin.cms_slug_validation_pattern',
            'string.base': 'admin.cms_slug_validation_required',
            'string.min': 'admin.cms_slug_validation_min',
            'string.max': 'admin.cms_slug_validation_max',
          }),
        title: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.cms_title_validation_required',
          'any.required': 'admin.cms_title_validation_required',
          'string.base': 'admin.cms_title_validation_required',
          'string.min': 'admin.cms_title_validation_min',
          'string.max': 'admin.cms_title_validation_max',
        }),
        description: Joi.string().required().messages({
          'string.empty': 'admin.cms_description_validation_required',
          'any.required': 'admin.cms_description_validation_required',
          'string.base': 'admin.cms_description_validation_required',
        }),
        seo_meta_title: Joi.string().required().min(5).max(150).messages({
          'string.empty': 'admin.cms_seo_meta_title_validation_required',
          'any.required': 'admin.cms_seo_meta_title_validation_required',
          'string.base': 'admin.cms_seo_meta_title_validation_required',
          'string.min': 'admin.cms_seo_meta_title_validation_min',
          'string.max': 'admin.cms_seo_meta_title_validation_max',
        }),
        seo_meta_desc: Joi.string().required().messages({
          'string.empty': 'admin.cms_seo_meta_desc_validation_required',
          'any.required': 'admin.cms_seo_meta_desc_validation_required',
          'string.base': 'admin.cms_seo_meta_desc_validation_required',
        }),
        is_active: Joi.string().required().valid(1, 2).messages({
          'any.required': 'admin.cms_is_active_validation_required',
          'any.valid': 'admin.cms_is_active_validation_valid',
        }),
      }),
    };
  }

  editCMSValidation() {
    return {
      body: Joi.object({
        cms_id: Joi.number().required().messages({
          'any.required': 'admin.cms_cms_id_validation_required',
        }),
        slug: Joi.string()
          .required()
          .min(5)
          .lowercase()
          .max(100)
          .pattern(/^[A-Za-z&-]*$/)
          .messages({
            'string.empty': 'admin.cms_slug_validation_required',
            'any.required': 'admin.cms_slug_validation_required',
            'string.lowercase': 'admin.cms_slug_validation_lowercase',
            'string.pattern.base': 'admin.cms_slug_validation_pattern',
            'string.base': 'admin.cms_slug_validation_required',
            'string.min': 'admin.cms_slug_validation_min',
            'string.max': 'admin.cms_slug_validation_max',
          }),
        title: Joi.string().required().min(5).max(100).messages({
          'string.empty': 'admin.cms_title_validation_required',
          'any.required': 'admin.cms_title_validation_required',
          'string.base': 'admin.cms_title_validation_required',
          'string.min': 'admin.cms_title_validation_min',
          'string.max': 'admin.cms_title_validation_max',
        }),
        description: Joi.string().required().messages({
          'string.empty': 'admin.cms_description_validation_required',
          'any.required': 'admin.cms_description_validation_required',
          'string.base': 'admin.cms_description_validation_required',
        }),
        seo_meta_title: Joi.string().required().min(5).max(150).messages({
          'string.empty': 'admin.cms_seo_meta_title_validation_required',
          'any.required': 'admin.cms_seo_meta_title_validation_required',
          'string.base': 'admin.cms_seo_meta_title_validation_required',
          'string.min': 'admin.cms_seo_meta_title_validation_min',
          'string.max': 'admin.cms_seo_meta_title_validation_max',
        }),
        seo_meta_desc: Joi.string().required().messages({
          'string.empty': 'admin.cms_seo_meta_desc_validation_required',
          'any.required': 'admin.cms_seo_meta_desc_validation_required',
          'string.base': 'admin.cms_seo_meta_desc_validation_required',
        }),
        is_active: Joi.string().required().valid(1, 2).messages({
          'any.required': 'admin.cms_is_active_validation_required',
          'any.valid': 'admin.cms_is_active_validation_valid',
        }),
      }),
    };
  }
}
module.exports = new CMSValidation();
