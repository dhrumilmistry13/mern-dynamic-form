const { Op } = require('sequelize');
const i18next = require('i18next');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const common = require('../../../helpers/common.helper');
const PaginationLength = require('../../../config/pagination.config');

class TranslationController {
  /**
   * @name addTranslation
   * @description Store Translation Data.
   * @param req,res
   * @returns {Json} success
   */
  async addTranslation(req, res) {
    try {
      const { text, key } = req.body;
      const splitkey = key.split('.');
      if (splitkey[1] === undefined) {
        throw new Error('admin.translation_key_validation_required');
      }
      const storeTranslationData = await models.Translations.create({
        key: splitkey[1],
        group: splitkey[0],
        text,
      });
      await models.Settings.update(
        {
          text_value: 1,
        },
        {
          where: { text_key: 'translation_status' },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.create_translation_success',
        {
          translation_id: storeTranslationData.translation_id,
        }
      );
    } catch (error) {
      if (error.fields && error.fields.key !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.translation_key_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editTranslation
   * @description Update Translation Data.
   * @param req,res
   * @returns {Json} success
   */
  async editTranslation(req, res) {
    try {
      const { translation_id, text, key } = req.body;
      const splitkey = key.split('.');
      if (splitkey[1] === undefined) {
        throw new Error('admin.translation_key_validation_required');
      }
      const updateTranslationData = await models.Translations.update(
        {
          key: splitkey[1],
          group: splitkey[0],
          text,
        },
        {
          where: {
            translation_id,
          },
        }
      );
      await models.Settings.update(
        {
          text_value: 1,
        },
        {
          where: { text_key: 'translation_status' },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.update_translation_success',
        {
          translation_id: updateTranslationData.translation_id,
        }
      );
    } catch (error) {
      if (error.fields && error.fields.key !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.translation_key_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteTranslation
   * @description delete Translation Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteTranslation(req, res) {
    try {
      const { translation_id } = req.query;
      await models.Translations.destroy({
        where: {
          translation_id,
        },
      });
      await models.Settings.update(
        {
          text_value: 1,
        },
        {
          where: { text_key: 'translation_status' },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.delete_translation_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getTranslation
   * @description Get Translation Data.
   * @param req,res
   * @returns {Json} success
   */
  async getTranslation(req, res) {
    try {
      const { translation_id } = req.query;
      const getTranslationData = await models.Translations.findOne({
        where: {
          translation_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.get_translation_success',
        getTranslationData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listTranslation
   * @description Get All Translation Data.
   * @param req,res
   * @returns {Json} success
   */
  async listTranslation(req, res) {
    try {
      const { page, serach_text } = req.query;
      const condition = {
        where: {
          [Op.or]: {
            key: {
              [Op.like]: `%${serach_text}%`,
            },
            text: {
              [Op.like]: `%${serach_text}%`,
            },
          },
        },
      };
      condition.page = parseInt(page, 10);
      condition.paginate = PaginationLength.getTranslation();
      condition.order = [['translation_id', 'DESC']];
      const { docs, pages, total } = await models.Translations.paginate(
        condition
      );
      const setttingdata = await models.Settings.findOne({
        where: { text_key: 'translation_status' },
      });
      return response.successResponse(
        req,
        res,
        'admin.get_translation_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: parseInt(page, 10),
            last_page: pages,
            per_page: PaginationLength.getTranslation(),
            hasMorePages: pages > parseInt(page, 10),
          },
          translations_list: docs,
          setting: setttingdata,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  async syncData(req, res) {
    try {
      const setttingdata = await models.Settings.findOne({
        where: { text_key: 'translation_status' },
      });
      if (setttingdata) {
        await models.Settings.update(
          {
            text_value: 2,
          },
          {
            where: { text_key: 'translation_status' },
          }
        );
      }
      await common.getTranslationData('patient');
      await common.getTranslationData('backend');
      await common.getTranslationData('frontend');
      await common.getTranslationData('admin');
      await i18next.reloadResources();
      return response.successResponse(
        req,
        res,
        'admin.transction_data_sysc_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new TranslationController();
