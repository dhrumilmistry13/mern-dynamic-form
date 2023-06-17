const { Op } = require('sequelize');
const { getFolderConfig } = require('../../../config/upload.config');
const response = require('../../../helpers/response.helper');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');
const models = require('../../../models/index');

class OrganizationSettingController {
  constructor() {
    this.updateHomeOrganizationBannerSettingsData =
      this.updateHomeOrganizationBannerSettingsData.bind(this);
    this.updateHomeOrganizationWhoWeAreSettingsData =
      this.updateHomeOrganizationWhoWeAreSettingsData.bind(this);
    this.updateHomeOrganizationClientSettingsData =
      this.updateHomeOrganizationClientSettingsData.bind(this);
    this.updateOrganizationGetInTouchSettingsData =
      this.updateOrganizationGetInTouchSettingsData.bind(this);
    this.updateOrganizationSeoSettingsData =
      this.updateOrganizationSeoSettingsData.bind(this);
  }

  /**
   * @name organizationSettingDataUpdateAndStore
   * @description Organization Setting Data Store and update.
   * @param {object} req
   * @returns success uploadimagearray
   */
  async organizationSettingDataUpdateAndStore(req) {
    const { organization_id } = req.payload.user;
    const { body } = req;
    Object.keys(body).map(async (key) => {
      let text_value = body[key];
      const type = 1;
      await models.OrganizationSetting.findOne({
        where: {
          text_key: key,
          user_id: organization_id,
        },
      }).then((obj) => {
        // update
        if (obj) {
          if (obj.type === 2 && text_value !== '') {
            const pathArray = text_value.split('/');
            const pathArray1 = pathArray[pathArray.length - 1].split('?');
            text_value = pathArray1[pathArray1.length - 2];
          }
          return obj.update({
            text_value,
          });
        }
        // insert
        return models.OrganizationSetting.create({
          text_value,
          text_key: key,
          type,
          user_id: organization_id,
        });
      });
    });
    const uploadPromises = [];
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          const fileFolderPath = getFolderConfig()[file.fieldname];

          const folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            organization_id
          );
          const fileurl = await fileUploadUrl(file, folder_path);
          let text_value = fileurl.filename;
          const pathArray = text_value.split('/');
          text_value = pathArray[pathArray.length - 1];
          await models.OrganizationSetting.findOne({
            where: {
              text_key: file.fieldname,
              user_id: organization_id,
            },
          }).then((obj) => {
            // update
            if (obj) {
              return obj.update({
                text_value,
              });
            }
            // insert
            return models.OrganizationSetting.create({
              text_value,
              text_key: file.fieldname,
              type: 2,
              user_id: organization_id,
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
   * @name updateHomeOrganizationBannerSettingsData
   * @description Store and Update Settings Organization Banner Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeOrganizationBannerSettingsData(req, res) {
    try {
      const uploadPromises = await this.organizationSettingDataUpdateAndStore(
        req
      );
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_banner_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationBannerSettingsData
   * @description Get Settings Organization Banner Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationBannerSettingsData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const organizationBannerData = await models.OrganizationSetting.findAll({
        where: {
          user_id: organization_id,
          text_key: { [Op.like]: `%home_page_organization_banner%` },
        },
      });
      const getOrganizationBannerData = {};
      organizationBannerData.forEach(async (value) => {
        getOrganizationBannerData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_banner_data_success',
          getOrganizationBannerData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeOrganizationWhoWeAreSettingsData
   * @description Store and Update Settings Organization Who We Are Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeOrganizationWhoWeAreSettingsData(req, res) {
    try {
      const uploadPromises = await this.organizationSettingDataUpdateAndStore(
        req
      );
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_who_we_are_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationWhoWeAreSettingsData
   * @description Get Settings Organization Who We Are Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationWhoWeAreSettingsData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const organizationWhoWeAreData = await models.OrganizationSetting.findAll(
        {
          where: {
            user_id: organization_id,
            text_key: { [Op.like]: `%home_page_organization_who_we_are%` },
          },
        }
      );
      const getOrganizationWhoWeAreData = {};
      organizationWhoWeAreData.forEach(async (value) => {
        getOrganizationWhoWeAreData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_who_we_are_data_success',
          getOrganizationWhoWeAreData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateHomeOrganizationClientSettingsData
   * @description Store and Update Settings Organization Client Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateHomeOrganizationClientSettingsData(req, res) {
    try {
      const uploadPromises = await this.organizationSettingDataUpdateAndStore(
        req
      );
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_client_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationClientSettingsData
   * @description Get Settings Organization Client Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationClientSettingsData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const organizationClientData = await models.OrganizationSetting.findAll({
        where: {
          user_id: organization_id,
          text_key: { [Op.like]: `%home_page_organization_client%` },
        },
      });
      const getOrganizationClientData = {};
      organizationClientData.forEach(async (value) => {
        getOrganizationClientData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_client_data_success',
          getOrganizationClientData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateOrganizationGetInTouchSettingsData
   * @description store and update Settings Organization Get In Touch Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateOrganizationGetInTouchSettingsData(req, res) {
    try {
      const uploadPromises = await this.organizationSettingDataUpdateAndStore(
        req
      );
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_get_in_touch_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationGetInTouchSettingsData
   * @description Get Settings Organization Get In Touch Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationGetInTouchSettingsData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const organizationGetInTouchData =
        await models.OrganizationSetting.findAll({
          where: {
            user_id: organization_id,
            text_key: { [Op.like]: `%home_page_organization_get_in_touch%` },
          },
        });
      const getOrganizationGetInTouchData = {};
      organizationGetInTouchData.forEach(async (value) => {
        getOrganizationGetInTouchData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_get_in_touch_data_success',
          getOrganizationGetInTouchData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateOrganizationSeoSettingsData
   * @description Store and Update Organization Seo Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async updateOrganizationSeoSettingsData(req, res) {
    try {
      const uploadPromises = await this.organizationSettingDataUpdateAndStore(
        req
      );
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_organization_seo_data_save_success',
          uploadPromises,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOrganizationSeoSettingsData
   * @description Get Settings Organization Seo Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getOrganizationSeoSettingsData(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const organizationSeoData = await models.OrganizationSetting.findAll({
        where: {
          user_id: organization_id,
          text_key: { [Op.like]: `%home_page_organization_seo%` },
        },
      });
      const getOrganizationSeoData = {};
      organizationSeoData.forEach(async (value) => {
        getOrganizationSeoData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_organization_seo_data_success',
          getOrganizationSeoData,
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new OrganizationSettingController();
