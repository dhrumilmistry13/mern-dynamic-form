const { Op } = require('sequelize');
// const moment = require('moment');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class OrganizationAvailabilityController {
  /**
   * @name getListAvailability
   * @description Get Availability List.
   * @param req,res
   * @returns {Json} success
   */
  async getListAvailability(req, res) {
    try {
      const { user_id, start_date, end_date } = req.query;

      const orgAvailabilities = await models.OrgAvailabilities.findOne({
        where: { organation_id: user_id },
        attributes: [
          'org_availabilities_id',
          'organation_id',
          'is_date_range',
          'start_date',
          'end_date',
        ],
      });
      const orgSlots = await models.OrgSlots.findAll({
        where: {
          organation_id: user_id,
          is_closed: {
            [Op.in]: start_date && end_date ? [1] : [1, 2],
          },
        },
        order: [
          ['day', 'ASC'],
          ['start_time', 'ASC'],
        ],
        attributes: [
          'day',
          'is_closed',
          'org_slot_id',
          'organation_id',
          'org_availabilities_id',
          'start_time',
          'end_time',
        ],
      });
      let orgListDateAvailabilities = [];
      if (orgAvailabilities) {
        orgListDateAvailabilities = await models.OrgSpecificDateSlot.findAll({
          where: {
            organation_id: user_id,
            date:
              orgAvailabilities.is_date_range === 2
                ? {
                    [Op.and]: [
                      {
                        [Op.gte]: start_date,
                      },
                      {
                        [Op.lte]: end_date,
                      },
                    ],
                  }
                : {
                    [Op.ne]: null,
                  },
          },
          attributes: [
            'org_specific_date_slot_id',
            'organation_id',
            'date',
            'start_time',
            'end_time',
            'is_closed',
            'is_booked',
          ],
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organisation_availability_success',
        { orgAvailabilities, orgSlots, orgListDateAvailabilities }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new OrganizationAvailabilityController();
