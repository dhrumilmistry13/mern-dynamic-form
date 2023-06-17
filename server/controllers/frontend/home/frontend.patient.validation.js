const { Joi } = require('express-validation');

class FrontendValidator {
  getInTouchSendEmail() {
    return {
      body: Joi.object({
        name: Joi.string().required().min(1).messages({
          'any.required':
            'admin.setting_home_page_get_in_touch_send_email_name_validation_required',
          'string.base':
            'admin.setting_home_page_get_in_touch_send_email_name_validation_required',
          'string.min':
            'admin.setting_home_page_get_in_touch_send_email_name_validation_min',
        }),
        email: Joi.string().max(100).trim(true).email().required().messages({
          'string.base':
            'admin.setting_home_page_get_in_touch_send_email_email_validation_required',
          'string.max':
            'admin.setting_home_page_get_in_touch_send_email_email_validation_max',
          'any.required':
            'admin.setting_home_page_get_in_touch_send_email_validation_required',
          'string.email':
            'admin.setting_home_page_get_in_touch_header_email_validation_email',
        }),
        question: Joi.string().required().min(5).messages({
          'any.required':
            'admin.setting_home_page_get_in_touch_send_email_quetion_validation_required',
          'string.base':
            'admin.setting_home_page_get_in_touch_send_email_quetion_validation_required',
          'string.min':
            'admin.setting_home_page_get_in_touch_send_email_quetion_validation_min',
        }),
      }),
    };
  }
}

module.exports = new FrontendValidator();
