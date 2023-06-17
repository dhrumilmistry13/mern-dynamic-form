import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  // How it works section Info

  home_page_how_its_work_header_title: Yup.string(
    'page.settings_home_page_how_it_works_title_required'
  ).required('page.settings_home_page_how_it_works_title_required'),

  home_page_how_its_work_header_sub_title: Yup.string(
    'page.settings_home_page_how_it_works_sub_title_required'
  ).required('page.settings_home_page_how_it_works_sub_title_required'),

  home_page_how_its_work_header_text: Yup.string(
    'page.settings_home_page_how_it_works_text_required'
  ).required('page.settings_home_page_how_it_works_text_required'),

  // Card One Validations

  home_page_how_its_work_favicon_1: Yup.mixed()
    .required('page.settings_home_page_how_it_works_card_one_favicon_required')
    .icon_file('page.settings_home_page_how_it_works_card_one_favicon_type'),
  home_page_how_its_work_header_text_1: Yup.string(
    'page.settings_home_page_how_it_works_card_one_text_required'
  ).required('page.settings_home_page_how_it_works_card_one_text_required'),
  home_page_how_its_work_header_title_1: Yup.string(
    'page.settings_home_page_how_it_works_card_one_title_required'
  ).required('page.settings_home_page_how_it_works_card_one_title_required'),
  home_page_how_its_work_header_button_text_1: Yup.string(
    'page.settings_home_page_how_it_works_card_one_btn_text_required'
  ).required('page.settings_home_page_how_it_works_card_one_btn_text_required'),
  home_page_how_its_work_header_button_link_1: Yup.string(
    'page.settings_home_page_how_it_works_card_one_btn_link_required'
  ).required('page.settings_home_page_how_it_works_card_one_btn_link_required'),

  // Card Two Validations

  home_page_how_its_work_favicon_2: Yup.mixed()
    .required('page.settings_home_page_how_it_works_two_favicon_required')
    .icon_file('page.settings_home_page_how_it_works_two_favicon_type'),
  home_page_how_its_work_header_text_2: Yup.string(
    'page.settings_home_page_how_it_works_two_text_required'
  ).required('page.settings_home_page_how_it_works_two_text_required'),
  home_page_how_its_work_header_title_2: Yup.string(
    'page.settings_home_page_how_it_works_two_title_required'
  ).required('page.settings_home_page_how_it_works_two_title_required'),
  home_page_how_its_work_header_button_text_2: Yup.string(
    'page.settings_home_page_how_it_works_two_btn_text_required'
  ).required('page.settings_home_page_how_it_works_two_btn_text_required'),
  home_page_how_its_work_header_button_link_2: Yup.string(
    'page.settings_home_page_how_it_works_two_btn_link_required'
  ).required('page.settings_home_page_how_it_works_two_btn_link_required'),

  // Card Three Validations

  home_page_how_its_work_favicon_3: Yup.mixed()
    .required('page.settings_home_page_how_it_works_three_favicon_required')
    .icon_file('page.settings_home_page_how_it_works_three_favicon_type'),
  home_page_how_its_work_header_text_3: Yup.string(
    'page.settings_home_page_how_it_works_three_text_required'
  ).required('page.settings_home_page_how_it_works_three_text_required'),
  home_page_how_its_work_header_title_3: Yup.string(
    'page.settings_home_page_how_it_works_three_title_required'
  ).required('page.settings_home_page_how_it_works_three_title_required'),
  home_page_how_its_work_header_button_text_3: Yup.string(
    'page.settings_home_page_how_it_works_three_btn_text_required'
  ).required('page.settings_home_page_how_it_works_three_btn_text_required'),
  home_page_how_its_work_header_button_link_3: Yup.string(
    'page.settings_home_page_how_it_works_three_btn_link_required'
  ).required('page.settings_home_page_how_it_works_three_btn_link_required'),

  // Card Four Validations

  home_page_how_its_work_favicon_4: Yup.mixed()
    .required('page.settings_home_page_how_it_works_four_favicon_required')
    .icon_file('page.settings_home_page_how_it_works_four_favicon_type'),
  home_page_how_its_work_header_text_4: Yup.string(
    'page.settings_home_page_how_it_works_four_text_required'
  ).required('page.settings_home_page_how_it_works_four_text_required'),
  home_page_how_its_work_header_title_4: Yup.string(
    'page.settings_home_page_how_it_works_four_title_required'
  ).required('page.settings_home_page_how_it_works_four_title_required'),
  home_page_how_its_work_header_button_text_4: Yup.string(
    'page.settings_home_page_how_it_works_four_btn_text_required'
  ).required('page.settings_home_page_how_it_works_four_btn_text_required'),
  home_page_how_its_work_header_button_link_4: Yup.string(
    'page.settings_home_page_how_it_works_four_btn_link_required'
  ).required('page.settings_home_page_how_it_works_four_btn_link_required'),
});

export default validationSchema;
