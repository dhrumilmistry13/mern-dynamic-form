const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const { sendEmail } = require('../../../helpers/email.helper');
const common = require('../../../helpers/common.helper');

class HomePageController {
  /**
   * @name getHomePageData
   * @description get Home Page Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHomePageData(req, res) {
    try {
      const homeSeoData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_seo%` },
        },
      });
      const getHomeSeoData = {};
      homeSeoData.forEach(async (value) => {
        getHomeSeoData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const homeGeneralData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_general%` },
        },
      });
      const getHomeGeneralData = {};
      homeGeneralData.forEach(async (value) => {
        getHomeGeneralData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const homeBannerData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_banner%` },
        },
      });
      const getHomeBannerData = {};
      homeBannerData.forEach(async (value) => {
        getHomeBannerData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const aboutUsData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_about_us%` },
        },
      });
      const getAboutUsData = {};
      aboutUsData.forEach(async (value) => {
        getAboutUsData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const howItsWorkData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_how_its_work%` },
        },
      });
      const getHowItsWorkData = {};
      howItsWorkData.forEach(async (value) => {
        getHowItsWorkData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const ourTeamData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_our_team%` },
        },
      });
      const getOurTeamData = {};
      ourTeamData.forEach(async (value) => {
        getOurTeamData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const getInTouchData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_get_in_touch%` },
        },
      });
      const getGetInTouchData = {};
      getInTouchData.forEach(async (value) => {
        getGetInTouchData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });

      const subscriptionplanData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_subscription%` },
        },
      });
      const subScriptionPlanData = {};
      subscriptionplanData.forEach(async (value) => {
        subScriptionPlanData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const ourTeamListData = [];
      const ourTeamList = await models.OurTeam.findAll({
        where: {
          is_active: 1,
          deleted_at: null,
        },
      });
      ourTeamList.forEach(async (value, index) => {
        ourTeamListData[index] = {
          our_team_id: value.our_team_id,
          name: value.name,
          designation: value.designation,
          image: await value.image.then((dataurl) => dataurl),
        };
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_home_page_data_success',
          {
            seo_data: getHomeSeoData,
            general_data: getHomeGeneralData,
            home_banner_data: getHomeBannerData,
            about_us_data: getAboutUsData,
            how_its_work: getHowItsWorkData,
            our_team_data: getOurTeamData,
            get_in_touch_data: getGetInTouchData,
            sub_scription_plan_data: subScriptionPlanData,
            our_team_list_data: ourTeamListData,
          },
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
  /**
   * @name getInTouchSendEmail
   * @description get In Touch Send Email.
   * @param req
   * @param res
   * @returns {Json} success
   */

  async getInTouchSendEmail(req, res) {
    try {
      const { name, email, question } = req.body;

      const adminEmail = await common.getSettingvalue(
        'home_page_get_in_touch_header_send_email'
      );
      const isEmailSent = await sendEmail({
        to: adminEmail,
        template: 'telepath-get-in-touch-inquiry',
        replacements: {
          FULLNAME: name,
          EMAILADDRESS: email,
          QUESTION_TEXT: question,
        },
      });
      if (!isEmailSent) {
        throw new Error('admin.setting_get_in_touch_email_send_fail');
      }
      return response.successResponse(
        req,
        res,
        'admin.setting_get_in_touch_email_send_success',
        { isEmailSent },
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new HomePageController();
