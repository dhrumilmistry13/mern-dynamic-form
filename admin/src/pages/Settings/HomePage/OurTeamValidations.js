import * as Yup from 'yup';

let validationSchema = Yup.object({
  home_page_our_team_header_title: Yup.string(
    'page.settings_home_page_our_team_title_required'
  ).required('page.settings_home_page_our_team_title_required'),

  home_page_our_team_header_sub_title: Yup.string(
    'page.settings_home_page_our_team_sub_title_required'
  ).required('page.settings_home_page_our_team_sub_title_required'),

  home_page_our_team_header_text: Yup.string(
    'page.settings_home_page_our_team_text_required'
  ).required('page.settings_home_page_our_team_text_required'),
});
export default validationSchema;
