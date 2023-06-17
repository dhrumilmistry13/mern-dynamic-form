import * as Yup from 'yup';

let validationSchema = Yup.object({
  home_page_seo_title: Yup.string('page.general_setting_home_page_seo_title_required').required(
    'page.general_setting_home_page_seo_title_required'
  ),
  home_page_seo_description: Yup.string(
    'page.general_setting_home_page_seo_description_required'
  ).required('page.general_setting_home_page_seo_description_required'),
});
export default validationSchema;
