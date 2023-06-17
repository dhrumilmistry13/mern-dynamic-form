import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  home_page_about_us_image: Yup.mixed()
    .required('page.settings_home_page_about_us_image_required')
    .file_type('page.settings_home_page_banner_image_type_required'),
  home_page_about_us_header_title: Yup.string(
    'page.settings_home_page_banner_title_required'
  ).required('page.settings_home_page_banner_title_required'),
  home_page_about_us_header_sub_title: Yup.string(
    'page.settings_home_page_banner_sub_title_required'
  ).required('page.settings_home_page_banner_sub_title_required'),
  home_page_about_us_header_text: Yup.string(
    'page.settings_home_page_banner_description_required'
  ).required('page.settings_home_page_banner_description_required'),
  home_page_about_us_button_text: Yup.string(
    'page.settings_home_page_banner_about_btn_required'
  ).required('page.settings_home_page_banner_about_btn_required'),
  home_page_about_us_button_link: Yup.string(
    'page.settings_home_page_banner_about_btn_link_required'
  ).required('page.settings_home_page_banner_about_btn_link_required'),
});

export default validationSchema;
