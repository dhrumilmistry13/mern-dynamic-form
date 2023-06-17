const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');

class CMSController {
  /**
   * @name addCMS
   * @description Store CMS Data.
   * @param req,res
   * @returns {Json} success
   */
  async addCMS(req, res) {
    try {
      const {
        slug,
        title,
        description,
        is_active,
        seo_meta_title,
        seo_meta_desc,
      } = req.body;
      const storeCMSData = await models.CMS.create({
        slug,
        title,
        description,
        is_active,
        seo_meta_title,
        seo_meta_desc,
      });
      return response.successResponse(req, res, 'admin.create_cms_success', {
        cms_id: storeCMSData.cms_id,
      });
    } catch (error) {
      if (error.fields && error.fields.slug !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.cms_slug_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editCms
   * @description Update CMS Data.
   * @param req,res
   * @returns {Json} success
   */
  async editCMS(req, res) {
    try {
      const {
        cms_id,
        slug,
        title,
        description,
        is_active,
        seo_meta_title,
        seo_meta_desc,
      } = req.body;
      const updateCMSData = await models.CMS.update(
        {
          slug,
          title,
          description,
          is_active,
          seo_meta_title,
          seo_meta_desc,
        },
        {
          where: {
            cms_id,
          },
        }
      );
      return response.successResponse(req, res, 'admin.update_cms_success', {
        cms_id: updateCMSData.cms_id,
      });
    } catch (error) {
      if (error.fields && error.fields.slug !== undefined) {
        return response.errorResponse(
          req,
          res,
          'admin.cms_slug_validation_unique',
          {},
          422
        );
      }
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getCms
   * @description Get CMS Data.
   * @param req,res
   * @returns {Json} success
   */
  async getCMS(req, res) {
    try {
      const { cms_id } = req.query;
      const getCMSData = await models.CMS.findOne({
        where: {
          cms_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.get_cms_success',
        getCMSData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateStatus
   * @description Update Status of CMS.
   * @param req,res
   * @returns {Json} success
   */
  async updateStatusCMS(req, res) {
    try {
      const { cms_id } = req.body;
      const getCMSData = await models.CMS.findOne({
        where: {
          cms_id,
        },
      });
      if (getCMSData) {
        await models.CMS.update(
          {
            is_active: getCMSData.is_active === 1 ? 2 : 1,
          },
          {
            where: {
              cms_id,
            },
          }
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_status_cms_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listCms
   * @description Get All CMS Data.
   * @param req,res
   * @returns {Json} success
   */
  async listCMS(req, res) {
    try {
      const { page, serach_text, is_active } = req.query;
      const condition = {
        attributes: ['cms_id', 'slug', 'is_active', 'title', 'created_at'],
        where: {
          title: {
            [Op.like]: `%${serach_text}%`,
          },
        },
      };
      if (is_active !== '') {
        condition.where = {
          is_active,
          title: {
            [Op.like]: `%${serach_text}%`,
          },
        };
      }
      condition.page = page;
      condition.paginate = PaginationLength.getCMS();
      condition.order = [['cms_id', 'DESC']];
      const { docs, pages, total } = await models.CMS.paginate(condition);
      return response.successResponse(req, res, 'admin.get_cms_success', {
        pagination: {
          total,
          count: docs.length,
          current_page: page,
          last_page: pages,
          per_page: PaginationLength.getCMS(),
          hasMorePages: pages > parseInt(page, 10),
        },
        cms_list: docs,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteCms
   * @description delete CMS Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteCMS(req, res) {
    try {
      const { cms_id } = req.query;
      if ([1, 2, 3, 4].includes(parseInt(cms_id, 10))) {
        throw new Error('admin.cms_already_used_in_code');
      }
      await models.CMS.destroy({
        where: {
          cms_id,
        },
      });

      return response.successResponse(req, res, 'admin.delete_cms_success');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new CMSController();
