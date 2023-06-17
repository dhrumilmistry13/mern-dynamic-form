const { Op } = require('sequelize');
const { getFolderConfig } = require('../../../config/upload.config');
const response = require('../../../helpers/response.helper');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');
const models = require('../../../models/index');

class SettingController {
  constructor() {
    this.updateHomeBannerSettingsData =
      this.updateHomeBannerSettingsData.bind(this);
    this.updateAboutUsSettingsData = this.updateAboutUsSettingsData.bind(this);
    this.updateHomeOurTeamSettingsData =
      this.updateHomeOurTeamSettingsData.bind(this);
    this.updateHowItsWorkSettingsData =
      this.updateHowItsWorkSettingsData.bind(this);
    this.updateHomeOurTeamSettingsData =
      this.updateHomeOurTeamSettingsData.bind(this);
    this.updateHomeGeneralSettingsData =
      this.updateHomeGeneralSettingsData.bind(this);
    this.updateGetInTouchSettingsData =
      this.updateGetInTouchSettingsData.bind(this);
    this.updateHomeSeoSettingsData = this.updateHomeSeoSettingsData.bind(this);
    this.updateSubScriptionPlanSettingsData =
      this.updateSubScriptionPlanSettingsData.bind(this);
    this.updateOrganizationHowItsWorkSettingsData =
      this.updateOrganizationHowItsWorkSettingsData.bind(this);
  }

  /**
   * @name settingDataUpdateAndStore
   * @description Setting Data Store and update.
   * @param {object} req
   * @returns success uploadimagearray
   */
  async settingDataUpdateAndStore(req) {
    const { body } = req;
    Object.keys(body).map(async (key) => {
      let text_value = body[key];
      const type = 1;
      await models.Settings.findOne({
        where: {
          text_key: key,
        },
      }).then((obj) => {
        // update
        if (obj) {
          if (obj.type === 2) {
            const pathArray = text_value.split('/');
            const pathArray1 = pathArray[pathArray.length - 1].split('?');
            text_value = pathArray1[pathArray1.length - 2];
          }
          return obj.update({
            text_value,
          });
        }
        // insert
        return models.Settings.create({
          text_value,
          text_key: key,
          type,
        });
      });
    });
    const uploadPromises = [];
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          const fileurl = await fileUploadUrl(
            file,
            getFolderConfig()[file.fieldname].file_path
          );
          let text_value = fileurl.filename;
          const pathArray = text_value.split('/');
          text_value = pathArray[pathArray.length - 1];

          await models.Settings.findOne({
            where: {
              text_key: file.fieldname,
            },
          }).then((obj) => {
            // update
            if (obj) {
              return obj.update({
                text_value,
              });
            }
            // insert
            return models.Settings.create({
              text_value,
              text_key: file.fieldname,
              type: 2,
            });
          });
          uploadPromises.push(fileurl);
          return fileurl;
        })
      );
    }
    return uploadPromises;
  }

  /**
   * @name getHomeSeoSettingsData
   * @description get Settings Home Seo Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHomeSeoSettingsData(req, res) {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_seo_data_success',
          getHomeSeoData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getHomeGeneralSettingsData
   * @description get Settings Home General Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHomeGeneralSettingsData(req, res) {
    try {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_general_data_success',
          getHomeGeneralData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getHomeBanerSettingsData
   * @description get Settings Home Banner Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHomeBanerSettingsData(req, res) {
    try {
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
      return setTimeout(
        () =>
          response.successResponse(
            req,
            res,
            'admin.setting_get_banner_data_success',
            getHomeBannerData,
            200
          ),
        500
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getAboutUsSettingsData
   * @description get Settings About Us Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getAboutUsSettingsData(req, res) {
    try {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_about_us_data_success',
          getAboutUsData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getHowItsWorkSettingsData
   * @description get Settings How It's Work Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHowItsWorkSettingsData(req, res) {
    try {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_how_its_work_data_success',
          getHowItsWorkData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOurTeamSettingsData
   * @description get Settings Our Team Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOurTeamSettingsData(req, res) {
    try {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_out_team_data_success',
          getOurTeamData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeBannerSettingsData
   * @description store and update Settings Banner Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeBannerSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(
        () =>
          response.successResponse(
            req,
            res,
            'admin.setting_banner_data_save_success',
            uploadPromises,
            200
          ),
        1000
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateAboutUsSettingsData
   * @description store and update Settings About Us Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateAboutUsSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_about_us_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHowItsWorkSettingsData
   * @description store and update Settings How It Work Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHowItsWorkSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_how_its_work_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeOurTeamSettingsData
   * @description store and update Settings OurTeam Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeOurTeamSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_our_team_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeGeneralSettingsData
   * @description store and update Settings General Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeGeneralSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_general_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateGetInTouchSettingsData
   * @description store and update Settings Get In Touch Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateGetInTouchSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return response.successResponse(
        req,
        res,
        'admin.setting_get_in_touch_data_save_success',
        uploadPromises,
        200
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getGetInTouchSettingsData
   * @description get Settings Get In Touch Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getGetInTouchSettingsData(req, res) {
    try {
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
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_get_in_touch_data_success',
          getGetInTouchData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeSeoSettingsData
   * @description store and update Settings Seo Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeSeoSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_seo_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getSubScriptionPlanSettingsData
   * @description  get Settings Subscription Plan Data.
   * @param req
   * @param res
   * @returns {Json} success
   */

  async getSubScriptionPlanSettingsData(req, res) {
    try {
      const subScriptionPlanData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_subscription%` },
        },
      });
      const subScriptionPlan = {};
      subScriptionPlanData.forEach(async (value) => {
        subScriptionPlan[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_subscription_plan_data_success',
          subScriptionPlan,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateSubScriptionPlanSettingsData
   * @description store and update Settings Subscriptionplan Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateSubScriptionPlanSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_subscriptionplan_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateOrganizationHowItsWorkSettingsData
   * @description Store and Update Settings Organization How Its Work Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateOrganizationHowItsWorkSettingsData(req, res) {
    try {
      const uploadPromises = await this.settingDataUpdateAndStore(req);
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_how_its_work_data_save_success',
          uploadPromises,
          200
        );
      }, 1000);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationHowItsWorkSettingsData
   * @description Get Settings Organization How Its Work Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationHowItsWorkSettingsData(req, res) {
    try {
      const organizationHowItsWorkData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_how_its_work%` },
        },
      });
      const getOrganizationHowItsWorkData = {};
      organizationHowItsWorkData.forEach(async (value) => {
        getOrganizationHowItsWorkData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_how_its_work_data_success',
          getOrganizationHowItsWorkData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new SettingController();
