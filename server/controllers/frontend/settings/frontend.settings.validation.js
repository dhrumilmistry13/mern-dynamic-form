const { Joi } = require('express-validation');

class OrganizationSettingValidator {
  homeOrganizationBannerValidation() {
    return {
      body: Joi.object({
        home_page_organization_banner_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_banner_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_banner_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_banner_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_banner_header_title_validation_min',
          }),
        home_page_organization_banner_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_banner_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_banner_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_banner_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_banner_header_text_validation_min',
          }),
        home_page_organization_banner_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_banner_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_banner_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_banner_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_banner_button_text_validation_min',
          }),
        home_page_organization_banner_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_banner_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_organization_banner_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_organization_banner_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_organization_banner_button_link_validation_min',
          }),
        home_page_organization_banner_image: Joi.optional(),
      }),
    };
  }

  homeOrganizationWhoWeAreValidation() {
    return {
      body: Joi.object({
        home_page_organization_who_we_are_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_who_we_are_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_who_we_are_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_who_we_are_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_who_we_are_header_title_validation_min',
          }),
        home_page_organization_who_we_are_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_who_we_are_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_who_we_are_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_who_we_are_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_who_we_are_header_sub_title_validation_min',
          }),
        home_page_organization_who_we_are_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_who_we_are_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_who_we_are_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_who_we_are_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_who_we_are_header_text_validation_min',
          }),
        home_page_organization_who_we_are_button_link: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_who_we_are_button_link_validation_required',
            'any.required':
              'admin.setting_home_page_organization_who_we_are_button_link_validation_required',
            'string.base':
              'admin.setting_home_page_organization_who_we_are_button_link_validation_required',
            'string.min':
              'admin.setting_home_page_organization_who_we_are_button_link_validation_min',
          }),
        home_page_organization_who_we_are_button_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_who_we_are_button_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_who_we_are_button_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_who_we_are_button_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_who_we_are_button_text_validation_min',
          }),
        home_page_organization_who_we_are_image: Joi.optional(),
      }),
    };
  }

  homeOrganizationClientValidation() {
    return {
      body: Joi.object({
        home_page_organization_client_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_client_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_client_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_client_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_client_header_title_validation_min',
          }),
        home_page_organization_client_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_client_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_client_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_client_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_client_header_sub_title_validation_min',
          }),
        home_page_organization_client_header_description: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_client_header_description_validation_required',
            'any.required':
              'admin.setting_home_page_organization_client_header_description_validation_required',
            'string.base':
              'admin.setting_home_page_organization_client_header_description_validation_required',
            'string.min':
              'admin.setting_home_page_organization_client_header_description_validation_min',
          }),
        home_page_organization_client_header_sub_title_2: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_client_header_sub_title_2_validation_required',
            'any.required':
              'admin.setting_home_page_organization_client_header_sub_title_2_validation_required',
            'string.base':
              'admin.setting_home_page_organization_client_header_sub_title_2_validation_required',
            'string.min':
              'admin.setting_home_page_organization_client_header_sub_title_2_validation_min',
          }),
        home_page_organization_client_header_sub_text_1: Joi.optional(),
        home_page_organization_client_header_sub_text_2: Joi.optional(),
        home_page_organization_client_header_sub_text_3: Joi.optional(),
        home_page_organization_client_header_sub_text_4: Joi.optional(),
        home_page_organization_client_blog_description_1: Joi.optional(),
        home_page_organization_client_blog_text_1: Joi.optional(),
        home_page_organization_client_image_1: Joi.optional(),
        home_page_organization_client_blog_description_2: Joi.optional(),
        home_page_organization_client_blog_text_2: Joi.optional(),
        home_page_organization_client_image_2: Joi.optional(),
        home_page_organization_client_blog_description_3: Joi.optional(),
        home_page_organization_client_blog_text_3: Joi.optional(),
        home_page_organization_client_image_3: Joi.optional(),
      }),
    };
  }

  homeOrganizationGetInTouchValidation() {
    return {
      body: Joi.object({
        home_page_organization_get_in_touch_header_join_our_community_instagram_social_media_link:
          Joi.optional(),
        home_page_organization_get_in_touch_header_join_our_community_twitter_social_media_link:
          Joi.optional(),
        home_page_organization_get_in_touch_header_join_our_community_linkdin_social_media_link:
          Joi.optional(),
        home_page_organization_get_in_touch_header_join_our_community_gmail_social_media_link:
          Joi.optional(),
        home_page_organization_get_in_touch_header_join_our_community_facebook_social_media_link:
          Joi.optional(),

        home_page_organization_get_in_touch_header_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_header_title_validation_min',
          }),
        home_page_organization_get_in_touch_header_sub_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_sub_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_sub_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_sub_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_header_sub_title_validation_min',
          }),
        home_page_organization_get_in_touch_header_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_header_text_validation_min',
          }),
        home_page_organization_get_in_touch_header_email: Joi.string()
          .max(100)
          .trim(true)
          .email()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_email_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_email_validation_required',
            'string.max':
              'admin.setting_home_page_organization_get_in_touch_header_email_validation_max',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_email_validation_required',
            'string.email':
              'admin.setting_home_page_organization_get_in_touch_header_email_validation_email',
          }),
        home_page_organization_get_in_touch_header_contact_number: Joi.string()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_contact_number_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_contact_number_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_contact_number_validation_required',
          }),
        home_page_organization_get_in_touch_header_join_our_community:
          Joi.string().required().min(1).messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_header_join_our_community_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_header_join_our_community_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_header_join_our_community_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_header_join_our_community_validation_min',
          }),
        home_page_organization_get_in_touch_send_email: Joi.string()
          .max(100)
          .trim(true)
          .email()
          .required()
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_send_email_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_send_email_validation_required',
            'string.max':
              'admin.setting_home_page_organization_get_in_touch_send_email_validation_max',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_send_email_validation_required',
            'string.email':
              'admin.setting_home_page_organization_get_in_touch_send_email_validation_email',
          }),
        home_page_organization_get_in_touch_footer_logo: Joi.optional(),
        home_page_organization_get_in_touch_footer_headquarters_text:
          Joi.string().required().min(1).messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_headquarters_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_headquarters_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_headquarters_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_headquarters_text_validation_min',
          }),
        home_page_organization_get_in_touch_footer_brand_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_title_validation_min',
          }),
        home_page_organization_get_in_touch_footer_brand_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_brand_text_validation_min',
          }),
        home_page_organization_get_in_touch_header_button_text: Joi.optional(),
        home_page_organization_get_in_touch_header_button_link: Joi.optional(),
        home_page_organization_get_in_touch_footer_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_title_validation_min',
          }),
        home_page_organization_get_in_touch_footer_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_text_validation_min',
          }),
        home_page_organization_get_in_touch_footer_sub_text: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_sub_text_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_sub_text_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_sub_text_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_sub_text_validation_min',
          }),
        home_page_organization_get_in_touch_footer_copyright: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_get_in_touch_footer_copyright_validation_required',
            'any.required':
              'admin.setting_home_page_organization_get_in_touch_footer_copyright_validation_required',
            'string.base':
              'admin.setting_home_page_organization_get_in_touch_footer_copyright_validation_required',
            'string.min':
              'admin.setting_home_page_organization_get_in_touch_footer_copyright_validation_min',
          }),
      }),
    };
  }

  homeOrganizationSeoValidation() {
    return {
      body: Joi.object({
        home_page_organization_seo_title: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_seo_title_validation_required',
            'any.required':
              'admin.setting_home_page_organization_seo_title_validation_required',
            'string.base':
              'admin.setting_home_page_organization_seo_title_validation_required',
            'string.min':
              'admin.setting_home_page_organization_seo_title_validation_min',
          }),
        home_page_organization_seo_description: Joi.string()
          .required()
          .min(1)
          .messages({
            'string.empty':
              'admin.setting_home_page_organization_seo_description_validation_required',
            'any.required':
              'admin.setting_home_page_organization_seo_description_validation_required',
            'string.base':
              'admin.setting_home_page_organization_seo_description_validation_required',
            'string.min':
              'admin.setting_home_page_organization_seo_description_validation_min',
          }),
      }),
    };
  }
}
module.exports = new OrganizationSettingValidator();
