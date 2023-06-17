import Yup from 'helpers/customValidation';
const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};
let validationSchema = Yup.object({
  home_page_banner_image: Yup.mixed().file_type('page.settings_home_page_banner_image_required'),
  home_page_banner_header_title: Yup.string(
    'page.settings_home_page_banner_title_required'
  ).required('page.settings_home_page_banner_title_required'),
  home_page_banner_header_text: Yup.string(
    'page.settings_home_page_banner_description_required'
  ).required('page.settings_home_page_banner_description_required'),
  home_page_banner_button_text: Yup.string(
    'page.settings_home_page_banner_started_btn_required'
  ).required('page.settings_home_page_banner_started_btn_required'),
  home_page_banner_button_link: Yup.string(
    'page.settings_home_page_banner_started_btn_link_required'
  ).required('page.settings_home_page_banner_started_btn_link_required'),
  home_page_banner_blog_link: Yup.string()
    .required('page.settings_home_page_banner_blog_link_required')
    .test('is-url-valid', 'page.settings_home_page_banner_blog_link_url', (value) =>
      isValidUrl(value)
    ),
});

export default validationSchema;
