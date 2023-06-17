const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');

class SpecialitiesController {
  /**
   * @name addSpecialities
   * @description Store Specialities Data.
   * @param req,res
   * @returns {Json} success
   */

  async addSpecialities(req, res) {
    try {
      const { name, sequence, status } = req.body;

      const storeSpecialitiesData = await models.Specialities.create({
        name,
        sequence,
        status,
      });
      return response.successResponse(
        req,
        res,
        'admin.create_specialities_success',
        {
          specialities_id: storeSpecialitiesData.specialities_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editSpecialities
   * @description Update Specialities Data.
   * @param req,res
   * @returns {Json} success
   */
  async editSpecialities(req, res) {
    try {
      const { specialities_id, name, sequence, status } = req.body;
      const updateSpecialitiesData = await models.Specialities.update(
        {
          name,
          sequence,
          status,
        },
        {
          where: {
            specialities_id,
          },
        }
      );
      return response.successResponse(
        req,
        res,
        'admin.update_specialities_success',
        {
          specialities_id: updateSpecialitiesData.specialities_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getSpecialities
   * @description Get specialities Data.
   * @param req,res
   * @returns {Json} success
   */
  async getSpecialities(req, res) {
    try {
      const { specialities_id } = req.query;
      const getSpecialitiesData = await models.Specialities.findOne({
        where: {
          specialities_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.get_specialities_success',
        getSpecialitiesData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listSpecialities
   * @description Get All Specialities Data.
   * @param req,res
   * @returns {Json} success
   */
  async listSpecialities(req, res) {
    try {
      const { page, serach_text, status } = req.query;
      const wherecondition = [];
      wherecondition.push({
        [Op.or]: {
          name: {
            [Op.like]: `%${serach_text}%`,
          },
          sequence: {
            [Op.like]: `%${serach_text}%`,
          },
        },
      });
      const condition = {
        attributes: [
          'specialities_id',
          'name',
          'sequence',
          'status',
          'created_at',
        ],
      };
      if (status !== '') {
        wherecondition.push({ status });
      }
      condition.where = wherecondition;
      condition.page = page;
      condition.paginate = PaginationLength.getSpecialities();
      condition.order = [['specialities_id', 'DESC']];
      const { docs, pages, total } = await models.Specialities.paginate(
        condition
      );
      return response.successResponse(
        req,
        res,
        'admin.get_specialities_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: PaginationLength.getSpecialities(),
            hasMorePages: pages > parseInt(page, 10),
          },
          specialities_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateStatusSpecialities
   * @description Update Status of Specialities.
   * @param req,res
   * @returns {Json} success
   */
  async updateStatusSpecialities(req, res) {
    try {
      const { specialities_id } = req.body;
      const getSpecialitiesData = await models.Specialities.findOne({
        where: {
          specialities_id,
        },
      });
      if (getSpecialitiesData) {
        await models.Specialities.update(
          {
            status: getSpecialitiesData.status === 1 ? 2 : 1,
          },
          {
            where: {
              specialities_id,
            },
          }
        );
        return response.successResponse(
          req,
          res,
          'admin.update_status_specialities_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin,update_status_specialities_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteSpecialities
   * @description Delete sprcialities Data
   * @param req
   * @param res
   * @returns success
   */
  async deleteSpecialities(req, res) {
    try {
      const { specialities_id } = req.query;
      const specialitiesData = await models.OrganizationSpecialities.findOne({
        where: {
          specialities_id,
        },
      });
      if (specialitiesData) {
        throw new Error('admin.specialities_already_use');
      } else {
        await models.Specialities.destroy({
          where: {
            specialities_id,
          },
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.specialities_delete_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new SpecialitiesController();
