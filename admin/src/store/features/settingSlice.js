import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial Values of globally declared states in redux
 */
const intialState = {
  setting_get: true,
  home_page_general_header_logo: '',
  home_page_general_header_sub_logo: '',
  home_page_general_email_logo: '',
  home_page_general_favicon_logo: '',
  home_page_general_seo_title: '',
  home_page_general_seo_description: '',
  home_page_general_copyright_text: '',
};

/**
 * Slice for Setting Data
 */
export const settingSlice = createSlice({
  name: 'setting',
  initialState: intialState,
  /**
   * Reducer functions for settings info
   */
  reducers: {
    addSetting: (state, { payload }) => {
      state.home_page_general_header_logo = payload.home_page_general_header_logo;
      state.home_page_general_header_sub_logo = payload.home_page_general_header_sub_logo;
      state.home_page_general_email_logo = payload.home_page_general_email_logo;
      state.home_page_general_favicon_logo = payload.home_page_general_favicon_logo;
      state.home_page_general_seo_title = payload.home_page_general_seo_title;
      state.home_page_general_seo_description = payload.home_page_general_seo_description;
      state.home_page_general_copyright_text = payload.home_page_general_copyright_text;
      state.home_page_general_email_address = payload.home_page_general_email_address;
      state.setting_get = payload.setting_get;

      return state;
    },
    clearSetting: () => intialState,
  },
});
export const { addSetting, clearSetting } = settingSlice.actions;
export const settingData = (state) => state.setting;
export default settingSlice.reducer;
