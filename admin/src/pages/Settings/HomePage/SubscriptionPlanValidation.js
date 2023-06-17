import * as Yup from 'yup';

let validationSchema = Yup.object({
  home_page_subscription_title: Yup.string(
    'page.settings_home_page_subscription_title__required'
  ).required('page.settings_home_page_subscription_title__required'),
  home_page_subscription_sub_title: Yup.string(
    'page.settings_home_page_subscription_sub_title__required'
  ).required('page.settings_home_page_subscription_sub_title__required'),
  home_page_subscription_text: Yup.string(
    'page.settings_home_page_subscription_text__required'
  ).required('page.settings_home_page_subscription_text__required'),
  home_page_subscription_button_text: Yup.string(
    'page.settings_home_page_subscription_button_text__required'
  ).required('page.settings_home_page_subscription_button_text__required'),
  home_page_subscription_button_link: Yup.string(
    'page.settings_home_page_subscription_button_link__required'
  ).required('page.settings_home_page_subscription_button_link__required'),

  home_page_subscription_plan_title: Yup.string(
    'page.settings_home_page_subscription_plan_title__required'
  ).required('page.settings_home_page_subscription_plan_title__required'),
  home_page_subscription_plan_sub_title: Yup.string(
    'page.home_page_home_page_subscription_plan_sub_title_required'
  ).required('page.home_page_home_page_subscription_plan_sub_title_required'),
  home_page_subscription_plan_button_text: Yup.string(
    'page.settings_home_page_subscription_plan_button_text_required'
  ).required('page.settings_home_page_subscription_plan_button_text_required'),
  home_page_subscription_plan_button_link: Yup.string(
    'page.settings_home_page_subscription_plan_button_link__required'
  ).required('page.settings_home_page_subscription_plan_button_link__required'),

  home_page_subscription_plan_type_title: Yup.string(
    'page.settings_home_page_subscription_plan_type_title__required'
  ).required('page.settings_home_page_subscription_plan_type_title__required'),
  home_page_subscription_plan_type_sub_title: Yup.string(
    'page.settings_home_page_subscription_plan_type_sub_title__required'
  ).required('page.settings_home_page_subscription_plan_type_sub_title__required'),
  home_page_subscription_plan_type_text: Yup.string(
    'page.settings_home_page_subscription_plan_type_type_text__required'
  ).required('page.settings_home_page_subscription_plan_type_type_text__required'),
  home_page_subscription_plan_text: Yup.string(
    'page.settings_home_page_subscription_plan_what_you_will_get_text__required'
  ).required('page.settings_home_page_subscription_plan_what_you_will_get_text__required'),
  home_page_subscription_plan_what_you_will_get_add_new: Yup.array().of(
    Yup.object().shape({
      subscription_text: Yup.string()
        .trim()
        .required('page.settings_home_page_subscription_plan_what_you_will_get_add_new_required'),
    })
  ),
});

export default validationSchema;
