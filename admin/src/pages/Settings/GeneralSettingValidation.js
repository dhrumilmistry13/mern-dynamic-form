import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  home_page_general_seo_title: Yup.string(
    'page.general_setting_home_page_general_seo_title_required'
  ).required('page.general_setting_home_page_general_seo_title_required'),
  home_page_general_email_address: Yup.string(
    'page.general_setting_home_page_general_email_address_required'
  )
    .required('page.general_setting_home_page_general_email_address_required')
    .email('page.general_setting_home_page_general_email_address_email'),
  home_page_general_seo_description: Yup.string(
    'page.general_setting_home_page_general_seo_description_required'
  ).required('page.general_setting_home_page_general_seo_description_required'),
  home_page_general_email_logo: Yup.mixed(
    'page.general_setting_home_page_general_email_logo_required'
  )
    .required('page.general_setting_home_page_general_email_logo_required')
    .file_type('page.general_setting_home_page_general_email_logo_file_type'),
  home_page_general_header_logo: Yup.mixed(
    'page.general_setting_home_page_general_header_logo_required'
  )
    .required('page.general_setting_home_page_general_header_logo_required')
    .file_type('page.general_setting_home_page_general_header_logo_file_type'),
  home_page_general_header_sub_logo: Yup.mixed(
    'page.general_setting_home_page_general_header_sub_logo_required'
  )
    .required('page.general_setting_home_page_general_header_sub_logo_required')
    .file_type('page.general_setting_home_page_general_header_sub_logo_file_type'),
  home_page_general_favicon_logo: Yup.mixed(
    'page.general_setting_home_page_general_favicon_logo_required'
  )
    .required('page.general_setting_home_page_general_favicon_logo_required')
    .icon_file('page.general_setting_home_page_general_favicon_logo_file_type'),
  home_page_general_step_image: Yup.mixed(
    'page.general_setting_home_page_general_step_image_required'
  )
    .required('page.general_setting_home_page_general_step_image_required')
    .file_type('page.general_setting_home_page_general_step_image_file_type'),
  home_page_general_doctor_visit_fees: Yup.string(
    'page.general_setting_home_page_general_doctor_visit_fees_required'
  )
    .required('page.general_setting_home_page_general_doctor_visit_fees_required')
    .maxlength('page.general_setting_home_page_general_doctor_visit_fees_max')
    .priceValidation('page.general_setting_home_page_general_doctor_visit_fees_valid'),
  home_page_general_telemedicine_platform_Fee: Yup.string(
    'page.general_setting_home_page_general_telemedicine_platform_fee_required'
  )
    .required('page.general_setting_home_page_general_telemedicine_platform_fee_required')
    .maxlength('page.general_setting_home_page_general_telemedicine_platform_fee_max')
    .priceValidation('page.general_setting_home_page_general_telemedicine_platform_fee_valid'),
});
export default validationSchema;
