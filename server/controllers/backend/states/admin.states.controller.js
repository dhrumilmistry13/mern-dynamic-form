const { Op, Sequelize } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');

class StatesController {
  /**
   * @name addStates
   * @description Store States Data.
   * @param req , res
   * @returns {Json} success
   */

  async addStates(req, res) {
    try {
      const { name, short_code, sequence, status } = req.body;
      const storeStatesData = await models.States.create({
        country_id: 1,
        name,
        short_code,
        sequence,
        status,
      });
      return response.successResponse(req, res, 'admin.create_states_success', {
        state_id: storeStatesData.state_id,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editStates
   * @description Update States Data
   * @param req,res
   * @return {Json} success
   */

  async editStates(req, res) {
    try {
      const { state_id, name, short_code, sequence, status } = req.body;
      const updateStatesData = await models.States.update(
        {
          name,
          short_code,
          sequence,
          status,
        },
        {
          where: {
            state_id,
          },
        }
      );
      return response.successResponse(req, res, 'admin.update_states_success', {
        state_id: updateStatesData.state_id,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getStates
   * @description Get States Data
   * @param req,res
   * @return {Json} success
   */
  async getStates(req, res) {
    try {
      const { state_id } = req.query;
      const getStatesData = await models.States.findOne({
        where: {
          state_id,
        },
      });
      return response.successResponse(
        req,
        res,
        'admin.get_states_success',
        getStatesData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listStates
   * @description Get All States Data.
   * @param req,res
   * @returns {Json} success
   */
  async listStates(req, res) {
    try {
      const { page, serach_text, status } = req.query;
      const wherecondition = [];
      wherecondition.push({
        [Op.or]: {
          name: {
            [Op.like]: `%${serach_text}%`,
          },
          short_code: {
            [Op.like]: `%${serach_text}%`,
          },
          sequence: {
            [Op.like]: `%${serach_text}%`,
          },
        },
      });
      const condition = {
        attributes: [
          'state_id',
          'name',
          'short_code',
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
      condition.paginate = PaginationLength.getStates();
      condition.order = [['state_id', 'DESC']];
      const { docs, pages, total } = await models.States.paginate(condition);
      return response.successResponse(req, res, 'admin.get_states_success', {
        pagination: {
          total,
          count: docs.length,
          current_page: page,
          last_page: pages,
          per_page: PaginationLength.getStates(),
          hasMorePages: pages > parseInt(page, 10),
        },
        states_list: docs,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateStatusStates
   * @description Update Status of States.
   * @param req,res
   * @returns {Json} success
   */
  async updateStatusStates(req, res) {
    try {
      const { state_id } = req.body;
      const getStatesData = await models.States.findOne({
        where: {
          state_id,
        },
      });
      if (getStatesData) {
        await models.States.update(
          {
            status: getStatesData.status === 1 ? 2 : 1,
          },
          {
            where: {
              state_id,
            },
          }
        );
        return response.successResponse(
          req,
          res,
          'admin.update_status_States_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_status_States_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteStates
   * @description State Delete Api
   * @param req
   * @param res
   * @return success
   */
  async deleteStates(req, res) {
    try {
      const { state_id } = req.query;
      const stateData = await models.OrganizationInfo.count({
        where: [
          {
            where: Sequelize.literal(`FIND_IN_SET('${state_id}', state_ids)`),
          },
        ],
      });
      if (stateData) {
        throw new Error('admin.state_already_use');
      } else {
        await models.States.destroy({
          where: {
            state_id,
          },
        });
      }
      return response.successResponse(req, res, 'admin.state_delete_success');
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new StatesController();
