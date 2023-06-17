class FolderPath {
  getUserImagePath() {
    return 'user/profile_image/{user_id}/';
  }

  getOurTeamImagePath() {
    return 'our_team/{our_team_id}/';
  }

  getSettingPath(type) {
    return `setting/${type}/`;
  }

  getFolderConfig() {
    return {
      profile_image: {
        file_path: 'user/profile_image/{user_id}/',
        replace: '{user_id}',
        type: 'user',
      },
      home_page_banner_image: {
        file_path: 'setting/banner_image/',
        replace: '',
        type: 'setting',
      },
      home_page_about_us_image: {
        file_path: 'setting/aboutus_image/',
        replace: '',
        type: 'setting',
      },
      home_page_how_its_work_favicon_1: {
        file_path: 'setting/how_its_work_favicon_1/',
        replace: '',
        type: 'setting',
      },
      home_page_how_its_work_favicon_2: {
        file_path: 'setting/how_its_work_favicon_2/',
        replace: '',
        type: 'setting',
      },
      home_page_how_its_work_favicon_3: {
        file_path: 'setting/how_its_work_favicon_3/',
        replace: '',
        type: 'setting',
      },
      home_page_how_its_work_favicon_4: {
        file_path: 'setting/how_its_work_favicon_4/',
        replace: '',
        type: 'setting',
      },
      home_page_general_header_logo: {
        file_path: 'setting/header_logo/',
        replace: '',
        type: 'setting',
      },
      home_page_general_header_sub_logo: {
        file_path: 'setting/header_sub_logo/',
        replace: '',
        type: 'setting',
      },
      home_page_general_email_logo: {
        file_path: 'setting/email_logo/',
        replace: '',
        type: 'setting',
      },
      home_page_get_in_touch_header_logo: {
        file_path: 'setting/get_in_touch/',
        replace: '',
        type: 'setting',
      },
      home_page_general_step_image: {
        file_path: 'setting/steps_image/',
        replace: '',
        type: 'setting',
      },
      home_page_general_favicon_logo: {
        file_path: 'setting/favicon_logo/',
        replace: '',
        type: 'setting',
      },
      our_team_image: {
        file_path: 'our_team/{our_team_id}/',
        replace: '{our_team_id}',
        type: 'our_team',
      },
      featured_image: {
        file_path: 'formulary/{formulary_id}/',
        replace: '{formulary_id}',
        type: 'formulary',
      },
      formulary_image: {
        file_path: 'formulary/{formulary_id}/other_images/',
        replace: '{formulary_id}',
        type: 'formulary',
      },
      header_logo: {
        file_path: 'user/header_logo/{user_id}/',
        replace: '{user_id}',
        type: 'user',
      },
      footer_logo: {
        file_path: 'user/footer_logo/{user_id}/',
        replace: '{user_id}',
        type: 'user',
      },
      ans_value_image: {
        file_path: 'question/user/{user_question_ans_id}/',
        replace: '{user_question_ans_id}',
        type: 'user',
      },
      home_page_organization_how_its_work_favicon_1: {
        file_path: 'setting/organization/how_its_work_favicon_1/',
        replace: '',
        type: 'setting',
      },
      home_page_organization_how_its_work_favicon_2: {
        file_path: 'setting/organization/how_its_work_favicon_2/',
        replace: '',
        type: 'setting',
      },
      home_page_organization_how_its_work_favicon_3: {
        file_path: 'setting/organization/how_its_work_favicon_3/',
        replace: '',
        type: 'setting',
      },
      home_page_organization_how_its_work_favicon_4: {
        file_path: 'setting/organization/how_its_work_favicon_4/',
        replace: '',
        type: 'setting',
      },
      home_page_organization_banner_image: {
        file_path: 'setting/organization/{user_id}/banner_image/',
        replace: '{user_id}',
        type: 'setting',
      },
      home_page_organization_who_we_are_image: {
        file_path: 'setting/organization/{user_id}/whoweare_image/',
        replace: '{user_id}',
        type: 'setting',
      },
      home_page_organization_client_image_1: {
        file_path: 'setting/organization/{user_id}/client_image_1/',
        replace: '{user_id}',
        type: 'setting',
      },
      home_page_organization_client_image_2: {
        file_path: 'setting/organization/{user_id}/client_image_2/',
        replace: '{user_id}',
        type: 'setting',
      },
      home_page_organization_client_image_3: {
        file_path: 'setting/organization/{user_id}/client_image_3/',
        replace: '{user_id}',
        type: 'setting',
      },
      home_page_organization_get_in_touch_footer_logo: {
        file_path: 'setting/organization/{user_id}/get_in_touch_header_logo/',
        replace: '{user_id}',
        type: 'setting',
      },
      selfi_image: {
        file_path: 'order/selfi_image/{order_id}/',
        replace: '{order_id}',
        type: 'orders',
      },
      document_id: {
        file_path: 'order/document_id/{order_id}/',
        replace: '{order_id}',
        type: 'orders',
      },
      chat_file: {
        file_path: 'chat/{chat_id}/',
        replace: '{chat_id}',
        type: 'user_chat',
      },
    };
  }
}
module.exports = new FolderPath();
