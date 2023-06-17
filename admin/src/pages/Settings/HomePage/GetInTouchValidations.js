import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  home_page_get_in_touch_header_title: Yup.string(
    'page.settings_home_page_get_in_touch_title__required'
  ).required('page.settings_home_page_get_in_touch_title__required'),
  home_page_get_in_touch_header_sub_title: Yup.string(
    'page.home_page_get_in_touch_sub_title_required'
  ).required('page.home_page_get_in_touch_sub_title_required'),
  home_page_get_in_touch_header_text: Yup.string(
    'page.settings_home_page_get_in_touch_text_required'
  ).required('page.settings_home_page_get_in_touch_text_required'),

  // Email
  home_page_get_in_touch_header_email: Yup.string(
    'page.settings_home_page_get_in_touch_email_required'
  )
    .required('page.settings_home_page_get_in_touch_email_required')
    .email('page.settings_home_page_get_in_touch_email_valid'),

  // Contact number Validations
  home_page_get_in_touch_header_contact_number: Yup.string(
    'page.settings_home_page_get_in_touch_contact_required'
  ).required('page.settings_home_page_get_in_touch_contact_required'),

  home_page_get_in_touch_header_send_email: Yup.string(
    'page.settings_home_page_get_in_touch_send_email_button_text_required'
  )
    .required('page.settings_home_page_get_in_touch_send_email_button_text_required')
    .email('page.settings_home_page_get_in_touch_email_valid'),

  // Join Community message text
  home_page_get_in_touch_header_join_our_community: Yup.string(
    'page.settings_home_page_get_in_touch_community_msg_required'
  ).required('page.settings_home_page_get_in_touch_community_msg_required'),

  // Social media Link

  home_page_get_in_touch_header_join_our_community_instagram_social_media_link: Yup.string(
    'page.settings_home_page_get_in_touch_social_insta_link_required'
  ),
  home_page_get_in_touch_header_join_our_community_twitter_social_media_link: Yup.string(
    'page.settings_home_page_get_in_touch_social_twitter_link_required'
  ),
  home_page_get_in_touch_header_join_our_community_linkdin_social_media_link: Yup.string(
    'page.settings_home_page_get_in_touch_social_linked_in_link_required'
  ),
  home_page_get_in_touch_header_join_our_community_facebook_social_media_link: Yup.string(
    'page.settings_home_page_get_in_touch_social_facebook_link_required'
  ),

  // Button Text and Link
  home_page_get_in_touch_header_button_text: Yup.string(
    'page.settings_home_page_get_in_touch_header_button_text_required'
  ).required('page.settings_home_page_get_in_touch_header_button_text_required'),
  home_page_get_in_touch_header_button_link: Yup.string(
    'page.settings_home_page_get_in_touch_header_button_link_required'
  ).required('page.settings_home_page_get_in_touch_header_button_link_required'),

  home_page_get_in_touch_header_logo: Yup.mixed()
    .required('page.settings_home_page_get_in_touch_logo_required')
    .file_type('page.settings_home_page_get_in_touch_logo_type_required'),
  home_page_get_in_touch_header_brand_title: Yup.string(
    'page.settings_home_page_get_in_touch_brand_title_required'
  ).required('page.settings_home_page_get_in_touch_brand_title_required'),
  home_page_get_in_touch_header_headquarters_text: Yup.string(
    'page.settings_home_page_get_in_touch_headquarters_text_required'
  ).required('page.settings_home_page_get_in_touch_headquarters_text_required'),
  home_page_get_in_touch_header_brand_text: Yup.string(
    'page.settings_home_page_get_in_touch_brand_text_required'
  ).required('page.settings_home_page_get_in_touch_brand_text_required'),

  home_page_get_in_touch_footer_title: Yup.string(
    'page.settings_home_page_get_in_touch_footer_title_required'
  ).required('page.settings_home_page_get_in_touch_footer_title_required'),
  home_page_get_in_touch_footer_text: Yup.string(
    'page.settings_home_page_get_in_touch_footer_text_required'
  ).required('page.settings_home_page_get_in_touch_footer_text_required'),
  home_page_get_in_touch_footer_sub_text: Yup.string(
    'page.settings_home_page_get_in_touch_footer_sub_text_required'
  ).required('page.settings_home_page_get_in_touch_footer_sub_text_required'),
  home_page_get_in_touch_footer_copyright: Yup.string(
    'page.settings_home_page_get_in_touch_footer_copyright_required'
  ).required('page.settings_home_page_get_in_touch_footer_copyright_required'),
});

export default validationSchema;
