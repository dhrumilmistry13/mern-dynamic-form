const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const { sendEmail } = require('../../../helpers/email.helper');
const common = require('../../../helpers/common.helper');

class PatientHomePageController {
  /**
   * @name getHomePageData
   * @description get Home Page Data.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getHomePageData(req, res) {
    try {
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const homeSeoData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_seo%` },
          user_id,
        },
      });
      const getHomeSeoData = {};
      homeSeoData.forEach(async (value) => {
        getHomeSeoData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });

      const homeBannerData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_banner%` },
          user_id,
        },
      });
      const getHomeBannerData = {};
      homeBannerData.forEach(async (value) => {
        getHomeBannerData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const aboutUsData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_who_we_are%` },
          user_id,
        },
      });
      const getAboutUsData = {};
      aboutUsData.forEach(async (value) => {
        getAboutUsData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const clientData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_client%` },
          user_id,
        },
      });
      const getClientData = {};
      clientData.forEach(async (value) => {
        getClientData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });
      const howItsWorkData = await models.Settings.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_how_its_work%` },
        },
      });
      const getHowItsWorkData = {};
      howItsWorkData.forEach(async (value) => {
        getHowItsWorkData[value.text_key] =
          typeof value.text_value === 'string'
            ? value.text_value
            : await value.text_value.then((dataurl) => dataurl);
      });

      const getInTouchData = await models.OrganizationSetting.findAll({
        where: {
          text_key: { [Op.like]: `%home_page_organization_get_in_touch%` },
          user_id,
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
          'admin.setting_get_home_page_data_success',
          {
            seo_data: getHomeSeoData,
            home_banner_data: getHomeBannerData,
            about_us_data: getAboutUsData,
            how_its_work: getHowItsWorkData,
            get_in_touch_data: getGetInTouchData,
            client_data: getClientData,
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
      const { subdomain } = req.headers;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const adminEmail = await common.getOrgSettingvalue(
        'home_page_organization_get_in_touch_send_email',
        user_id
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

  /**
   * @name getFormularyPageData
   * @description get Formulary Page Data in Home Page.
   * @param req
   * @param res
   * @returns {Json} success
   */
  async getFormularyPageData(req, res) {
    try {
      const { subdomain } = req.headers;
      const { serach_text } = req.query;
      const { user_id } = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const condition = [];
      if (serach_text) {
        condition.push({
          name: {
            [Op.like]: `%${serach_text}%`,
          },
        });
      }
      const prescriptionProductFormulary =
        await models.OrganizationFormulary.findAll({
          where: { organization_id: user_id, prescription_product: 1 },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              where: condition,
            },
          ],
        });
      const getPrescriptionProductFormulary = [];
      prescriptionProductFormulary.map(async (value, index) => {
        const data = value.dataValues;
        data.prescription_product = value.prescription_product;
        data.top_discount_product = value.top_discount_product;
        data.popular_product = value.popular_product;
        data.formulary = value.dataValues.formulary.dataValues;
        data.formulary.status = value.formulary.status;
        data.formulary.featured_image =
          await value.formulary.featured_image.then((dataUrl) => dataUrl);

        getPrescriptionProductFormulary[index] = data;
        return value;
      });
      const topDiscountProductFormulary =
        await models.OrganizationFormulary.findAll({
          where: { organization_id: user_id, top_discount_product: 1 },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              where: condition,
            },
          ],
        });
      const getTopDiscountProductFormulary = [];
      topDiscountProductFormulary.map(async (value, index) => {
        const data = value.dataValues;
        data.prescription_product = value.prescription_product;
        data.top_discount_product = value.top_discount_product;
        data.popular_product = value.popular_product;
        data.formulary = value.dataValues.formulary.dataValues;
        data.formulary.status = value.formulary.status;
        data.formulary.featured_image =
          await value.formulary.featured_image.then((dataUrl) => dataUrl);
        getTopDiscountProductFormulary[index] = data;
        return value;
      });
      const popularProductFormulary =
        await models.OrganizationFormulary.findAll({
          where: { organization_id: user_id, popular_product: 1 },
          include: [
            {
              model: models.Formulary,
              as: 'formulary',
              where: condition,
            },
          ],
        });
      const getPopularProductFormulary = [];
      popularProductFormulary.map(async (value, index) => {
        const data = value.dataValues;
        data.prescription_product = value.prescription_product;
        data.top_discount_product = value.top_discount_product;
        data.popular_product = value.popular_product;
        data.formulary = value.dataValues.formulary.dataValues;
        data.formulary.status = value.formulary.status;
        data.formulary.featured_image =
          await value.formulary.featured_image.then((dataUrl) => dataUrl);
        getPopularProductFormulary[index] = data;
        return value;
      });
      const allProductFormulary = await models.OrganizationFormulary.findAll({
        where: {
          organization_id: user_id,
          popular_product: 2,
          top_discount_product: 2,
          prescription_product: 2,
        },
        include: [
          {
            model: models.Formulary,
            as: 'formulary',
            where: condition,
          },
        ],
      });
      const getAllProductFormulary = [];
      allProductFormulary.map(async (value, index) => {
        const data = value.dataValues;
        data.prescription_product = value.prescription_product;
        data.top_discount_product = value.top_discount_product;
        data.popular_product = value.popular_product;
        data.formulary = value.dataValues.formulary.dataValues;
        data.formulary.status = value.formulary.status;
        data.formulary.featured_image =
          await value.formulary.featured_image.then((dataUrl) => dataUrl);
        getAllProductFormulary[index] = data;
        return value;
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.setting_get_formulary_home_page_data_success',
          {
            prescription_product_data: common.spliceIntoChunks(
              getPrescriptionProductFormulary,
              8
            ),
            top_discount_product_data: getTopDiscountProductFormulary,
            popular_product_data: common.spliceIntoChunks(
              getPopularProductFormulary,
              8
            ),
            all_product_data: common.spliceIntoChunks(
              getAllProductFormulary,
              8
            ),
          },
          200
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new PatientHomePageController();
