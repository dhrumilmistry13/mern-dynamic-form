const { Joi } = require('express-validation');

class SettingValidator {
  homeBannerValidation() {
    return {
      body: Joi.object({
        home_page_banner_header_title: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_banner_header_title_validation_required',
          'any.required':
            'admin.setting_home_page_banner_header_title_validation_required',
          'string.base':
            'admin.setting_home_page_banner_header_title_validation_required',
          'string.min':
            'admin.setting_home_page_banner_header_title_validation_min',
        }),
        home_page_banner_header_text: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_banner_header_text_validation_required',
          'any.required':
            'admin.setting_home_page_banner_header_text_validation_required',
          'string.base':
            'admin.setting_home_page_banner_header_text_validation_required',
          'string.min':
            'admin.setting_home_page_banner_header_text_validation_min',
        }),
        home_page_banner_button_text: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_banner_button_text_validation_required',
          'any.required':
            'admin.setting_home_page_banner_button_text_validation_required',
          'string.base':
            'admin.setting_home_page_banner_button_text_validation_required',
          'string.min':
            'admin.setting_home_page_banner_button_text_validation_min',
        }),
        home_page_banner_button_link: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_banner_button_link_validation_required',
          'any.required':
            'admin.setting_home_page_banner_button_link_validation_required',
          'string.base':
            'admin.setting_home_page_banner_button_link_validation_required',
          'string.min':
            'admin.setting_home_page_banner_button_link_validation_min',
        }),
        home_page_banner_image: Joi.optional(),
        home_page_banner_blog_link: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_banner_blog_link_validation_required',
          'any.required':
            'admin.setting_home_page_banner_blog_link_validation_required',
          'link.base':
            'admin.setting_home_page_banner_blog_link_validation_required',
          'link.min': 'admin.setting_home_page_banner_blog_link_validation_min',
        }),
      }),
    };
  }

  homeAboutValidation() {
    return {
      body: Joi.object({
        home_page_about_us_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_about_us_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_about_us_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_about_us_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_about_us_header_title_validation_min',
          }),
        home_page_about_us_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_about_us_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_about_us_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_about_us_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_about_us_header_sub_title_validation_min',
          }),
        home_page_about_us_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_about_us_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_about_us_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_about_us_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_about_us_header_text_validation_min',
          }),
        home_page_about_us_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_about_us_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_about_us_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_about_us_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_about_us_button_link_validation_min',
          }),
        home_page_about_us_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_about_us_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_about_us_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_about_us_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_about_us_button_text_validation_min',
          }),
        home_page_about_us_image: Joi.optional(),
      }),
    };
  }

  homeHowItsWorkValidation() {
    return {
      body: Joi.object({
        home_page_how_its_work_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_title_validation_min',
          }),
        home_page_how_its_work_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_sub_title_validation_min',
          }),
        home_page_how_its_work_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_text_validation_min',
          }),
        home_page_how_its_work_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_button_link_validation_min',
          }),
        home_page_how_its_work_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_button_text_validation_min',
          }),
        home_page_how_its_work_favicon_1: Joi.optional(),
        home_page_how_its_work_header_title_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_title_1_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_title_1_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_title_1_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_title_1_validation_min',
          }),
        home_page_how_its_work_header_text_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_text_1_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_text_1_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_text_1_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_text_1_validation_min',
          }),
        home_page_how_its_work_header_button_text_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_text_1_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_text_1_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_text_1_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_text_1_validation_min',
          }),
        home_page_how_its_work_header_button_link_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_link_1_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_link_1_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_link_1_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_link_1_validation_min',
          }),
        home_page_how_its_work_favicon_2: Joi.optional(),
        home_page_how_its_work_header_title_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_title_2_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_title_2_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_title_2_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_title_2_validation_min',
          }),
        home_page_how_its_work_header_text_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_text_2_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_text_2_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_text_2_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_text_2_validation_min',
          }),
        home_page_how_its_work_header_button_text_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_text_2_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_text_2_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_text_2_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_text_2_validation_min',
          }),
        home_page_how_its_work_header_button_link_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_link_2_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_link_2_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_link_2_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_link_2_validation_min',
          }),
        home_page_how_its_work_favicon_3: Joi.optional(),
        home_page_how_its_work_header_title_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_title_3_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_title_3_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_title_3_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_title_3_validation_min',
          }),
        home_page_how_its_work_header_text_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_text_3_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_text_3_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_text_3_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_text_3_validation_min',
          }),
        home_page_how_its_work_header_button_text_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_text_3_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_text_3_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_text_3_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_text_3_validation_min',
          }),
        home_page_how_its_work_header_button_link_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_link_3_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_link_3_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_link_3_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_link_3_validation_min',
          }),
        home_page_how_its_work_favicon_4: Joi.optional(),
        home_page_how_its_work_header_title_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_title_4_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_title_4_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_title_4_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_title_4_validation_min',
          }),
        home_page_how_its_work_header_text_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_text_4_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_text_4_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_text_4_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_text_4_validation_min',
          }),
        home_page_how_its_work_header_button_text_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_text_4_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_text_4_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_text_4_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_text_4_validation_min',
          }),
        home_page_how_its_work_header_button_link_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_how_its_work_header_button_link_4_validation_required',
            'any.required':
              'admin.setting_home_page_how_its_work_header_button_link_4_validation_required',
            'string.base':
              'admin.setting_home_page_how_its_work_header_button_link_4_validation_required',
            'string.min':
              'admin.setting_home_page_how_its_work_header_button_link_4_validation_min',
          }),
      }),
    };
  }

  homeOurTeamValidation() {
    return {
      body: Joi.object({
        home_page_our_team_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_our_team_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_our_team_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_our_team_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_our_team_header_title_validation_min',
          }),
        home_page_our_team_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_our_team_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_our_team_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_our_team_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_our_team_header_sub_title_validation_min',
          }),
        home_page_our_team_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_our_team_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_our_team_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_our_team_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_our_team_header_text_validation_min',
          }),
      }),
    };
  }

  homeGeneralValidation() {
    return {
      body: Joi.object({
        home_page_general_header_logo: Joi.optional(),
        home_page_general_step_image: Joi.optional(),
        home_page_general_header_sub_logo: Joi.optional(),
        home_page_general_email_logo: Joi.optional(),
        home_page_general_favicon_logo: Joi.optional(),
        home_page_general_seo_title: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_general_seo_title_validation_required',
          'any.required':
            'admin.setting_home_page_general_seo_title_validation_required',
          'string.base':
            'admin.setting_home_page_general_seo_title_validation_required',
          'string.min':
            'admin.setting_home_page_general_seo_title_validation_min',
        }),
        home_page_general_seo_description: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_general_seo_description_validation_required',
            'any.required':
              'admin.setting_home_page_general_seo_description_validation_required',
            'string.base':
              'admin.setting_home_page_general_seo_description_validation_required',
            'string.min':
              'admin.setting_home_page_general_seo_description_validation_min',
          }),
        home_page_general_email_address: Joi.string()
          .required()
          .email()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_general_email_address_validation_required',
            'string.email':
              'admin.setting_home_page_general_email_address_validation_email',
            'any.required':
              'admin.setting_home_page_general_email_address_validation_required',
            'string.base':
              'admin.setting_home_page_general_email_address_validation_required',
            'string.min':
              'admin.setting_home_page_general_email_address_validation_min',
          }),
        home_page_general_copyright_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_general_copyright_text_validation_required',
            'any.required':
              'admin.setting_home_page_general_copyright_text_validation_required',
            'string.base':
              'admin.setting_home_page_general_copyright_text_validation_required',
            'string.min':
              'admin.setting_home_page_general_copyright_text_validation_min',
          }),
        home_page_general_doctor_visit_fees: Joi.string()
          .pattern(/^\d{1,3}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required':
              'admin.setting_ home_page_general_doctor_visit_fees_validation_required',
            'string.pattern.base':
              'admin.setting_ home_page_general_doctor_visit_fees_validation_required',
          }),
        home_page_general_telemedicine_platform_Fee: Joi.string()
          .pattern(/^\d{1,3}(\.\d{1,2})?$/)
          .required()
          .messages({
            'any.required':
              'admin.setting_home_page_general_telemedicine_platform_Fee_validation_required',
            'string.pattern.base':
              'admin.setting_home_page_general_telemedicine_platform_Fee_validation_required',
          }),
      }),
    };
  }

  homeGetInTouchValidation() {
    return {
      body: Joi.object({
        home_page_get_in_touch_header_join_our_community_instagram_social_media_link:
          Joi.optional(),
        home_page_get_in_touch_header_join_our_community_twitter_social_media_link:
          Joi.optional(),
        home_page_get_in_touch_header_join_our_community_linkdin_social_media_link:
          Joi.optional(),
        home_page_get_in_touch_header_join_our_community_facebook_social_media_link:
          Joi.optional(),

        home_page_get_in_touch_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_title_validation_min',
          }),
        home_page_get_in_touch_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_sub_title_validation_min',
          }),
        home_page_get_in_touch_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_text_validation_min',
          }),
        home_page_get_in_touch_header_email: Joi.string()
          .max(100)
          .trim(true)
          .email()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_email_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_email_validation_required',
            'string.max':
              'admin.setting_home_page_get_in_touch_header_email_validation_max',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_email_validation_required',
            'string.email':
              'admin.setting_home_page_get_in_touch_header_email_validation_email',
          }),
        home_page_get_in_touch_header_contact_number: Joi.string()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_contact_number_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_contact_number_validation_required',
            'string.max':
              'admin.setting_home_page_get_in_touch_header_contact_number_validation_max',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_contact_number_validation_required',
          }),
        home_page_get_in_touch_header_join_our_community: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_join_our_community_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_join_our_community_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_join_our_community_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_join_our_community_validation_min',
          }),
        home_page_get_in_touch_header_send_email: Joi.string()
          .max(100)
          .trim(true)
          .email()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_send_email_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_send_email_validation_required',
            'string.max':
              'admin.setting_home_page_get_in_touch_header_send_email_validation_max',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_send_email_validation_required',
            'string.email':
              'admin.setting_home_page_get_in_touch_header_send_email_validation_email',
          }),
        home_page_get_in_touch_header_logo: Joi.optional(),
        home_page_get_in_touch_header_headquarters_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_headquarters_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_headquarters_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_headquarters_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_headquarters_text_validation_min',
          }),
        home_page_get_in_touch_header_brand_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_brand_title_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_brand_title_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_brand_title_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_brand_title_validation_min',
          }),
        home_page_get_in_touch_header_brand_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_brand_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_brand_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_brand_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_brand_text_validation_min',
          }),
        home_page_get_in_touch_header_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_button_text_validation_min',
          }),
        home_page_get_in_touch_header_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_header_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_header_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_header_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_header_button_link_validation_min',
          }),
        home_page_get_in_touch_footer_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_footer_title_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_footer_title_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_footer_title_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_footer_title_validation_min',
          }),
        home_page_get_in_touch_footer_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_footer_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_footer_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_footer_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_footer_text_validation_min',
          }),
        home_page_get_in_touch_footer_sub_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_footer_sub_text_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_footer_sub_text_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_footer_sub_text_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_footer_sub_text_validation_min',
          }),
        home_page_get_in_touch_footer_copyright: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_get_in_touch_footer_copyright_validation_required',
            'any.required':
              'admin.setting_home_page_get_in_touch_footer_copyright_validation_required',
            'string.base':
              'admin.setting_home_page_get_in_touch_footer_copyright_validation_required',
            'string.min':
              'admin.setting_home_page_get_in_touch_footer_copyright_validation_min',
          }),
      }),
    };
  }

  homeSeoValidation() {
    return {
      body: Joi.object({
        home_page_seo_title: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_seo_title_validation_required',
          'any.required':
            'admin.setting_home_page_seo_title_validation_required',
          'string.base':
            'admin.setting_home_page_seo_title_validation_required',
          'string.min': 'admin.setting_home_page_seo_title_validation_min',
        }),
        home_page_seo_description: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_seo_description_validation_required',
          'any.required':
            'admin.setting_home_page_seo_description_validation_required',
          'string.base':
            'admin.setting_home_page_seo_description_validation_required',
          'string.min':
            'admin.setting_home_page_seo_description_validation_min',
        }),
      }),
    };
  }

  homeSubScriptionPlanValidation() {
    return {
      body: Joi.object({
        home_page_subscription_title: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_subscription_title_validation_required',
          'any.required':
            'admin.setting_home_page_subscription_title_validation_required',
          'string.base':
            'admin.setting_home_page_subscription_title_validation_required',
          'string.min':
            'admin.setting_home_page_subscription_title_validation_min',
        }),
        home_page_subscription_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_sub_title_validation_min',
          }),
        home_page_subscription_text: Joi.string().required().min(1).messages({
          'string.empty':
            'admin.setting_home_page_subscription_text_validation_required',
          'any.required':
            'admin.setting_home_page_subscription_text_validation_required',
          'string.base':
            'admin.setting_home_page_subscription_text_validation_required',
          'string.min':
            'admin.setting_home_page_subscription_text_validation_min',
        }),
        home_page_subscription_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_button_text_validation_min',
          }),
        home_page_subscription_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_button_link_validation_min',
          }),
        home_page_subscription_plan_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_title_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_title_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_title_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_title_validation_min',
          }),
        home_page_subscription_plan_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_sub_title_validation_min',
          }),
        home_page_subscription_plan_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_button_text_validation_min',
          }),
        home_page_subscription_plan_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_button_link_validation_min',
          }),
        home_page_subscription_plan_type_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_type_title_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_type_title_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_type_title_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_type_title_validation_min',
          }),
        home_page_subscription_plan_type_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_type_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_type_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_type_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_type_sub_title_validation_min',
          }),
        home_page_subscription_plan_type_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_type_text_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_type_text_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_type_text_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_type_text_validation_min',
          }),
        home_page_subscription_plan_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_text_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_text_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_text_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_text_validation_min',
          }),
        home_page_subscription_plan_what_you_will_get_add_new: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_subscription_plan_what_you_will_get_add_new_text_validation_required',
            'any.required':
              'admin.setting_home_page_subscription_plan_what_you_will_get_add_new_text_validation_required',
            'string.base':
              'admin.setting_home_page_subscription_plan_what_you_will_get_add_new_text_validation_required',
            'string.min':
              'admin.setting_home_page_subscription_plan_what_you_will_get_add_new_text_validation_min',
          }),
      }),
    };
  }

  organizationHowItsWorkValidation() {
    return {
      body: Joi.object({
        home_page_organization_how_its_work_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_title_validation_min',
          }),
        home_page_organization_how_its_work_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_sub_title_validation_min',
          }),
        home_page_organization_how_its_work_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_text_validation_min',
          }),
        home_page_organization_how_its_work_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_button_link_validation_min',
          }),
        home_page_organization_how_its_work_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_button_text_validation_min',
          }),
        home_page_organization_how_its_work_favicon_1: Joi.optional(),
        home_page_organization_how_its_work_header_title_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_title_1_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_title_1_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_title_1_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_title_1_validation_min',
          }),
        home_page_organization_how_its_work_header_text_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_text_1_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_text_1_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_text_1_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_text_1_validation_min',
          }),
        home_page_organization_how_its_work_header_button_text_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_text_1_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_text_1_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_text_1_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_text_1_validation_min',
          }),
        home_page_organization_how_its_work_header_button_link_1: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_link_1_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_link_1_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_link_1_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_link_1_validation_min',
          }),
        home_page_organization_how_its_work_favicon_2: Joi.optional(),
        home_page_organization_how_its_work_header_title_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_title_2_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_title_2_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_title_2_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_title_2_validation_min',
          }),
        home_page_organization_how_its_work_header_text_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_text_2_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_text_2_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_text_2_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_text_2_validation_min',
          }),
        home_page_organization_how_its_work_header_button_text_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_text_2_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_text_2_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_text_2_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_text_2_validation_min',
          }),
        home_page_organization_how_its_work_header_button_link_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_link_2_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_link_2_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_link_2_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_link_2_validation_min',
          }),
        home_page_organization_how_its_work_favicon_3: Joi.optional(),
        home_page_organization_how_its_work_header_title_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_title_3_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_title_3_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_title_3_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_title_3_validation_min',
          }),
        home_page_organization_how_its_work_header_text_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_text_3_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_text_3_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_text_3_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_text_3_validation_min',
          }),
        home_page_organization_how_its_work_header_button_text_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_text_3_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_text_3_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_text_3_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_text_3_validation_min',
          }),
        home_page_organization_how_its_work_header_button_link_3: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_link_3_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_link_3_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_link_3_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_link_3_validation_min',
          }),
        home_page_organization_how_its_work_favicon_4: Joi.optional(),
        home_page_organization_how_its_work_header_title_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_title_4_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_title_4_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_title_4_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_title_4_validation_min',
          }),
        home_page_organization_how_its_work_header_text_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_text_4_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_text_4_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_text_4_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_text_4_validation_min',
          }),
        home_page_organization_how_its_work_header_button_text_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_text_4_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_text_4_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_text_4_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_text_4_validation_min',
          }),
        home_page_organization_how_its_work_header_button_link_4: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_how_its_work_header_button_link_4_validation_required',
            'any.required':
              'admin.setting_home_page_organization_how_its_work_header_button_link_4_validation_required',
            'string.base':
              'admin.setting_home_page_organization_how_its_work_header_button_link_4_validation_required',
            'string.min':
              'admin.setting_home_page_organization_how_its_work_header_button_link_4_validation_min',
          }),
      }),
    };
  }
}

module.exports = new SettingValidator();
