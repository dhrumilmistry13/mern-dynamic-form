import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  // How it works section Info

  home_page_organization_how_its_work_header_title: Yup.string(
    'page.settings_home_page_organization_how_its_work_header_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_its_work_header_title_min')
    .required('page.settings_home_page_organization_how_its_work_header_title_required'),

  home_page_organization_how_its_work_header_sub_title: Yup.string(
    'page.settings_home_page_organization_how_its_work_header_sub_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_its_work_header_sub_title_min')
    .required('page.settings_home_page_organization_how_its_work_header_sub_title_required'),

  home_page_organization_how_its_work_header_text: Yup.string(
    'page.settings_home_page_organization_how_its_work_header_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_its_work_header_text_min')
    .required('page.settings_home_page_organization_how_its_work_header_text_required'),
  home_page_organization_how_its_work_button_text: Yup.string(
    'page.settings_home_page_organization_how_it_works_btn_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_btn_text_min')
    .required('page.settings_home_page_organization_how_it_works_btn_text_required'),
  home_page_organization_how_its_work_button_link: Yup.string(
    'page.settings_home_page_organization_how_it_works_btn_link_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_btn_link_min')
    .required('page.settings_home_page_organization_how_it_works_btn_link_required'),

  // Card One Validations

  home_page_organization_how_its_work_favicon_1: Yup.mixed()
    .required('page.settings_home_page_organization_how_its_work_favicon_one_required')
    .icon_file('page.settings_home_page_organization_how_its_work_favicon_one_type'),
  home_page_organization_how_its_work_header_text_1: Yup.string(
    'page.settings_home_page_organization_how_it_works_card_one_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_card_one_text_min')
    .required('page.settings_home_page_organization_how_it_works_card_one_text_required'),
  home_page_organization_how_its_work_header_title_1: Yup.string(
    'page.settings_home_page_organization_how_it_works_card_one_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_card_one_title_min')
    .required('page.settings_home_page_organization_how_it_works_card_one_title_required'),
  home_page_organization_how_its_work_header_button_text_1: Yup.string(
    'page.settings_home_page_organization_how_it_works_card_one_btn_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_card_one_btn_text_min')
    .required('page.settings_home_page_organization_how_it_works_card_one_btn_text_required'),
  home_page_organization_how_its_work_header_button_link_1: Yup.string(
    'page.settings_home_page_organization_how_it_works_card_one_btn_link_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_card_one_btn_link_min')
    .required('page.settings_home_page_organization_how_it_works_card_one_btn_link_required'),

  // Card Two Validations

  home_page_organization_how_its_work_favicon_2: Yup.mixed()
    .required('page.settings_home_page_organization_how_it_works_two_favicon_required')
    .icon_file('page.settings_home_page_organization_how_it_works_two_favicon_type'),
  home_page_organization_how_its_work_header_text_2: Yup.string(
    'page.settings_home_page_organization_how_it_works_two_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_two_text_min')
    .required('page.settings_home_page_organization_how_it_works_two_text_required'),
  home_page_organization_how_its_work_header_title_2: Yup.string(
    'page.settings_home_page_organization_how_it_works_two_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_two_title_min')
    .required('page.settings_home_page_organization_how_it_works_two_title_required'),
  home_page_organization_how_its_work_header_button_text_2: Yup.string(
    'page.settings_home_page_organization_how_it_works_two_btn_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_two_btn_text_min')
    .required('page.settings_home_page_organization_how_it_works_two_btn_text_required'),
  home_page_organization_how_its_work_header_button_link_2: Yup.string(
    'page.settings_home_page_organization_how_it_works_two_btn_link_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_two_btn_link_min')
    .required('page.settings_home_page_organization_how_it_works_two_btn_link_required'),

  // Card Three Validations

  home_page_organization_how_its_work_favicon_3: Yup.mixed()
    .required('page.settings_home_page_organization_how_it_works_three_favicon_required')
    .icon_file('page.settings_home_page_organization_how_it_works_three_favicon_type'),
  home_page_organization_how_its_work_header_text_3: Yup.string(
    'page.settings_home_page_organization_how_it_works_three_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_three_text_min')
    .required('page.settings_home_page_organization_how_it_works_three_text_required'),
  home_page_organization_how_its_work_header_title_3: Yup.string(
    'page.settings_home_page_organization_how_it_works_three_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_three_title_min')
    .required('page.settings_home_page_organization_how_it_works_three_title_required'),
  home_page_organization_how_its_work_header_button_text_3: Yup.string(
    'page.settings_home_page_organization_how_it_works_three_btn_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_three_btn_text_min')
    .required('page.settings_home_page_organization_how_it_works_three_btn_text_required'),
  home_page_organization_how_its_work_header_button_link_3: Yup.string(
    'page.settings_home_page_organization_how_it_works_three_btn_link_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_three_btn_link_min')
    .required('page.settings_home_page_organization_how_it_works_three_btn_link_required'),

  // Card Four Validations

  home_page_organization_how_its_work_favicon_4: Yup.mixed()
    .required('page.settings_home_page_organization_how_it_works_four_favicon_required')
    .icon_file('page.settings_home_page_organization_how_it_works_four_favicon_type'),
  home_page_organization_how_its_work_header_text_4: Yup.string(
    'page.settings_home_page_organization_how_it_works_four_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_four_text_min')
    .required('page.settings_home_page_organization_how_it_works_four_text_required'),
  home_page_organization_how_its_work_header_title_4: Yup.string(
    'page.settings_home_page_organization_how_it_works_four_title_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_four_title_min')
    .required('page.settings_home_page_organization_how_it_works_four_title_required'),
  home_page_organization_how_its_work_header_button_text_4: Yup.string(
    'page.settings_home_page_organization_how_it_works_four_btn_text_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_four_btn_text_min')
    .required('page.settings_home_page_organization_how_it_works_four_btn_text_required'),
  home_page_organization_how_its_work_header_button_link_4: Yup.string(
    'page.settings_home_page_organization_how_it_works_four_btn_link_required'
  )
    .min(3, 'page.settings_home_page_organization_how_it_works_four_btn_link_min')
    .required('page.settings_home_page_organization_how_it_works_four_btn_link_required'),
});

export default validationSchema;
