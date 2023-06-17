const { Op } = require('sequelize');
const moment = require('moment');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class AvailabilityController {
  constructor() {
    this.addUpdateAvailability = this.addUpdateAvailability.bind(this);
  }
  /**
   * @name commonAvailabilityAddUpdate
   * @description Store and update Availability Data.
   * @param req,res
   * @returns {Json} success
   */

  async commonAvailabilityAddUpdate(slotData, day, user_id) {
    const isAvailabilityExists = await models.OrgAvailabilities.findOne({
      where: {
        organation_id: user_id,
      },
      attributes: ['org_availabilities_id'],
    });
    Object.values(slotData).map(async (item) => {
      await models.OrgSlots.findOne({
        where: {
          org_slot_id: item.org_slot_id,
        },
      }).then(async (obj) => {
        if (
          obj &&
          item.is_delete === 1 &&
          item.is_new === 1 &&
          item.is_closed === 1
        ) {
          item.organation_id = user_id;
          item.org_availabilities_id =
            isAvailabilityExists.org_availabilities_id;
          models.OrgSlots.update(item, {
            where: {
              org_slot_id: item.org_slot_id,
            },
          });
        }
        if (obj && item.is_delete === 2 && item.is_new === 1) {
          await obj.destroy({
            force: true,
            truncate: false,
            where: {
              org_slot_id: item.org_slot_id,
            },
          });
        }
        if (
          obj &&
          item.is_new === 1 &&
          item.is_delete === 1 &&
          item.is_closed === 2
        ) {
          const isDayOff = await models.OrgSlots.findAll({
            where: {
              day,
              is_closed: 1,
            },
          });

          if (isDayOff.length !== 0) {
            const detroyed = await models.OrgSlots.destroy({
              force: true,
              truncate: false,
              where: {
                day,
              },
            });
            if (detroyed) {
              item.organation_id = user_id;
              item.org_availabilities_id =
                isAvailabilityExists.org_availabilities_id;
              item.day = day;
              item.is_closed = 2;
              item.org_slot_id = 0;
              item.start_time = null;
              item.end_time = null;
              models.OrgSlots.create(item);
            }
          }
        }
      });
      if (item.is_delete === 1 && item.is_new === 2) {
        item.organation_id = user_id;
        item.org_availabilities_id = isAvailabilityExists.org_availabilities_id;
        item.day = day;
        if (item.org_slot_id === 0) {
          models.OrgSlots.create(item);
        } else {
          models.OrgSlots.update(item, {
            where: {
              org_slot_id: item.org_slot_id,
            },
          });
        }
      }
    });
  }

  /**
   * @name commonAvailabilityCreate
   * @description Store Availability Data.
   * @param req,res
   * @returns {Json} success
   */

  async commonAvailabilityCreate(slotData, day, user_id, availabilityId) {
    Object.values(slotData).map(async (item) => {
      if (item.is_delete === 1 && item.is_new === 2) {
        item.organation_id = user_id;
        item.org_availabilities_id = availabilityId;
        item.day = day;
        await models.OrgSlots.create(item);
      }
    });
  }

  /**
   * @name addAvailability
   * @description Store Availability Data.
   * @param req,res
   * @returns {Json} success
   */

  async addUpdateAvailability(req, res) {
    try {
      const {
        is_date_range,
        start_date,
        end_date,
        days_slot_1,
        days_slot_2,
        days_slot_3,
        days_slot_4,
        days_slot_5,
        days_slot_6,
        days_slot_7,
      } = req.body;
      const { organization_id } = req.payload.user;
      const isAvailabilityExists = await models.OrgAvailabilities.findOne({
        where: {
          organation_id: organization_id,
        },
        attributes: ['org_availabilities_id'],
      });
      if (isAvailabilityExists) {
        await models.OrgAvailabilities.update(
          {
            organation_id: organization_id,
            is_date_range,
            start_date: is_date_range === 2 ? start_date : null,
            end_date: is_date_range === 2 ? end_date : null,
          },
          {
            where: [
              {
                organation_id: organization_id,
                org_availabilities_id:
                  isAvailabilityExists.org_availabilities_id,
              },
            ],
          }
        );
        if (is_date_range === 2) {
          await models.OrgSpecificDateSlot.destroy({
            force: true,
            truncate: false,
            where: {
              date: {
                [Op.or]: [
                  {
                    [Op.lt]: start_date,
                  },
                  {
                    [Op.gt]: end_date,
                  },
                ],
              },
              is_booked: 1,
            },
          });
        }
        if (days_slot_1 && days_slot_1.length) {
          this.commonAvailabilityAddUpdate(days_slot_1, 1, organization_id);
        }

        if (days_slot_2 && days_slot_2.length) {
          this.commonAvailabilityAddUpdate(days_slot_2, 2, organization_id);
        }

        if (days_slot_3 && days_slot_3.length) {
          this.commonAvailabilityAddUpdate(days_slot_3, 3, organization_id);
        }

        if (days_slot_4 && days_slot_4.length) {
          this.commonAvailabilityAddUpdate(days_slot_4, 4, organization_id);
        }

        if (days_slot_5 && days_slot_5.length) {
          this.commonAvailabilityAddUpdate(days_slot_5, 5, organization_id);
        }

        if (days_slot_6 && days_slot_6.length) {
          this.commonAvailabilityAddUpdate(days_slot_6, 6, organization_id);
        }

        if (days_slot_7 && days_slot_7.length) {
          this.commonAvailabilityAddUpdate(days_slot_7, 7, organization_id);
        }
      } else {
        const availabilityId = await models.OrgAvailabilities.create({
          organation_id: organization_id,
          is_date_range,
          start_date: is_date_range === 2 ? start_date : null,
          end_date: is_date_range === 2 ? end_date : null,
        });
        if (days_slot_1 && days_slot_1.length) {
          this.commonAvailabilityCreate(
            days_slot_1,
            1,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_2 && days_slot_2.length) {
          this.commonAvailabilityCreate(
            days_slot_2,
            2,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_3 && days_slot_3.length) {
          this.commonAvailabilityCreate(
            days_slot_3,
            3,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_4 && days_slot_4.length) {
          this.commonAvailabilityCreate(
            days_slot_4,
            4,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_5 && days_slot_5.length) {
          this.commonAvailabilityCreate(
            days_slot_5,
            5,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_6 && days_slot_6.length) {
          this.commonAvailabilityCreate(
            days_slot_6,
            6,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
        if (days_slot_7 && days_slot_7.length) {
          this.commonAvailabilityCreate(
            days_slot_7,
            7,
            organization_id,
            availabilityId.org_availabilities_id
          );
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.organisation_availability_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getListAvailability
   * @description Get Availability List.
   * @param req,res
   * @returns {Json} success
   */
  async getListAvailability(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { start_date, end_date } = req.query;

      const orgAvailabilities = await models.OrgAvailabilities.findOne({
        where: { organation_id: organization_id },
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
          organation_id: organization_id,
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
            organation_id: organization_id,
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

  /**
   * @name addUpdateDateSpecificAvailability
   * @description Get Availability List.
   * @param req,res
   * @returns {Json} success
   */
  async addUpdateDateSpecificAvailability(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { date, slots } = req.body;

      const existingSlotErrorData = [];

      const isInDateRange = await models.OrgAvailabilities.findOne({
        where: {
          organation_id: organization_id,
          start_date: {
            [Op.or]: {
              [Op.lte]: date,
              [Op.eq]: null,
            },
          },
          end_date: {
            [Op.or]: {
              [Op.gte]: date,
              [Op.eq]: null,
            },
          },
        },
      });

      if (isInDateRange) {
        if (slots && slots.length) {
          const existingSlotData = await Promise.all(
            Object.values(slots).map(async (item) => {
              await models.OrgSpecificDateSlot.findOne({
                where: {
                  org_specific_date_slot_id: item.org_specific_date_slot_id,
                },
              }).then(async (obj) => {
                if (
                  obj &&
                  item.is_delete === 1 &&
                  item.is_new === 1 &&
                  item.is_closed === 1
                ) {
                  item.organation_id = organization_id;
                  models.OrgSpecificDateSlot.update(item, {
                    where: {
                      org_specific_date_slot_id: item.org_specific_date_slot_id,
                    },
                  });
                }
                if (obj && item.is_delete === 2 && item.is_new === 1) {
                  models.OrgSpecificDateSlot.destroy({
                    force: true,
                    truncate: false,
                    where: {
                      org_specific_date_slot_id: item.org_specific_date_slot_id,
                      is_booked: 1,
                    },
                  });
                }
                if (
                  obj &&
                  item.is_new === 1 &&
                  item.is_delete === 1 &&
                  item.is_closed === 2
                ) {
                  const isDayOff = await models.OrgSpecificDateSlot.findAll({
                    where: {
                      date,
                      is_closed: 1,
                      is_booked: 1,
                    },
                  });

                  if (isDayOff.length !== 0) {
                    const destroyed = await models.OrgSpecificDateSlot.destroy({
                      force: true,
                      truncate: false,
                      where: {
                        date,
                        is_booked: 1,
                      },
                    });
                    if (destroyed) {
                      item.organation_id = organization_id;
                      item.org_specific_date_slot_id = 0;
                      item.date = date;
                      item.is_closed = 2;
                      item.org_slot_id = 0;
                      item.start_time = null;
                      item.end_time = null;
                      models.OrgSpecificDateSlot.create(item);
                    }
                  }
                }
              });
              if (
                item.org_specific_date_slot_id === 0 &&
                item.is_delete === 1 &&
                item.is_new === 2
              ) {
                const isExistData = await models.OrgSpecificDateSlot.findOne({
                  where: {
                    organation_id: organization_id,
                    date,
                    start_time: item.start_time,
                    end_time: item.end_time,
                  },
                });
                if (isExistData) {
                  existingSlotErrorData.push(
                    `${isExistData.start_time} to ${isExistData.end_time}`
                  );
                } else {
                  item.organation_id = organization_id;
                  item.date = date;
                  if (item.is_closed === 2) {
                    item.start_time = null;
                    item.end_time = null;
                    await models.OrgSpecificDateSlot.create(item);
                  } else {
                    await models.OrgSpecificDateSlot.create(item);
                  }
                }
              }
              return existingSlotErrorData;
            })
          );
          if (
            existingSlotData &&
            existingSlotData.length &&
            existingSlotData[existingSlotData.length - 1] &&
            existingSlotData[existingSlotData.length - 1].length
          ) {
            return response.errorResponse(
              req,
              res,
              `admin.availability_slots_are_available_error_message`,
              existingSlotData[existingSlotData.length - 1],
              422
            );
          }
        } else {
          await models.OrgSpecificDateSlot.destroy({
            force: true,
            truncate: false,
            where: {
              organation_id: organization_id,
              date,
              is_booked: 1,
            },
          });

          await models.OrgSpecificDateSlot.create({
            organation_id: organization_id,
            date,
            is_closed: 2,
          });
        }
      } else {
        return response.errorResponse(
          req,
          res,
          'admin.organisation_availability_date_specific_valid_date_error',
          {},
          422
        );
      }

      return response.successResponse(
        req,
        res,
        'admin.organisation_availability_date_specific_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getListDateSpecificAvailability
   * @description Get Date Specific Availabilities List.
   * @param req,res
   * @returns {Json} success
   */
  async getListDateSpecificAvailabilities(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { date } = req.query;

      const orgAvailabilities = await models.OrgAvailabilities.findOne({
        where: {
          organation_id: organization_id,
        },
        attributes: ['is_date_range', 'start_date', 'end_date'],
      });

      let day = moment(date).day();
      if (day === 0) {
        day = 7;
      }
      let orgSpecificDateAvailabilities = [];
      let orgDaySlotsData = [];
      if (orgAvailabilities) {
        orgSpecificDateAvailabilities =
          await models.OrgSpecificDateSlot.findAll({
            where: {
              organation_id: organization_id,
              date:
                orgAvailabilities.is_date_range === 2
                  ? {
                      [Op.and]: [
                        {
                          [Op.between]: [
                            orgAvailabilities.start_date,
                            orgAvailabilities.end_date,
                          ],
                        },
                        {
                          [Op.like]: `%${date}%`,
                        },
                      ],
                    }
                  : {
                      [Op.like]: `%${date}%`,
                    },
            },
            order: [['start_time', 'ASC']],
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
      if (
        (orgAvailabilities &&
          (orgAvailabilities.start_date <= date,
          orgAvailabilities.end_date >= date)) ||
        (orgAvailabilities && orgAvailabilities.is_date_range === 1)
      ) {
        orgDaySlotsData = await models.OrgSlots.findAll({
          where: {
            organation_id: organization_id,
            day,
          },
          attributes: [
            'day',
            'is_closed',
            'org_slot_id',
            'organation_id',
            'org_availabilities_id',
            'start_time',
            'end_time',
          ],
          order: [['start_time', 'ASC']],
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.get_organisation_availability_success',
        orgSpecificDateAvailabilities.length
          ? orgSpecificDateAvailabilities
          : orgDaySlotsData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}

module.exports = new AvailabilityController();
