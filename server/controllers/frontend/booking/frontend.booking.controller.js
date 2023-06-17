const { Op, Sequelize } = require('sequelize');
const moment = require('moment');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const {
  sendEmail,
  organizationSendEmail,
} = require('../../../helpers/email.helper');
const { momentTimezoneChange } = require('../../../helpers/common.helper');
const emailHelper = require('../../../helpers/email.helper');
const {
  generateUUID,
  setFormatDate,
  defaultDateTimeFormate,
  defaultTimeFormate,
  defaultDateFormate,
} = require('../../../helpers/common.helper');

class BookingController {
  /**
   * @name organizationBookinglist
   * @description Get All Organization Booking Data.
   * @param req,res
   * @returns {Json} success
   */
  async organizationBookinglist(req, res) {
    try {
      const {
        page,
        start_date,
        end_date,
        booking_status,
        patient_id,
        serach_text,
      } = req.query;
      const { organization_id } = req.payload.user;
      const paginate = 10;
      const condition = [];
      const wherecondition = [];
      if (start_date) {
        condition.push({
          book_date: {
            [Op.gte]: start_date,
          },
        });
      }
      if (end_date) {
        condition.push({
          book_date: {
            [Op.lte]: end_date,
          },
        });
      }
      if (booking_status) {
        condition.push({
          booking_status: {
            [Op.in]: booking_status.split(','),
          },
        });
      }
      if (patient_id) {
        condition.push({
          user_id: {
            [Op.in]: patient_id.split(','),
          },
        });
      }
      if (serach_text) {
        condition.push({
          [Op.or]: {
            user_id: {
              [Op.in]: [
                Sequelize.literal(`(
             SELECT Users.user_id FROM users AS Users WHERE (concat(first_name, ' ', last_name)) LIKE "%${serach_text}%"
            )`),
              ],
            },
            bookings_id: {
              [Op.like]: `%${serach_text}%`,
            },
          },
        });
      }

      condition.push({ organation_id: organization_id });
      const { docs, pages, total } = await models.Bookings.paginate({
        where: condition,
        attributes: [
          'bookings_id',
          'organation_id',
          'user_id',
          'book_date',
          'start_time',
          'end_time',
          'booking_status',
          'cancellation_by',
          'booking_notes',
          'reason',
          'cancellation_by',
          'cancellation_timestamp',
          'created_at',
        ],
        order: [
          ['booking_status', 'asc'],
          [
            Sequelize.fn(
              'concat',
              Sequelize.col('book_date'),
              ' ',
              Sequelize.col('start_time')
            ),
            'asc',
          ],
        ],
        include: [
          {
            model: models.Users,
            as: 'users',
            where: wherecondition,
            attributes: ['user_id', 'first_name', 'last_name'],
            require: true,
            paranoid: false,
          },
        ],
        page,
        paginate,
      });
      return response.successResponse(
        req,
        res,
        'admin.get_organization_booking_list_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: paginate,
            hasMorePages: pages > parseInt(page, 10),
          },
          data_list: docs,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name patientBookinglist
   * @description Get All Patient Booking Data.
   * @param req,res
   * @returns {Json} success
   */
  async patientBookinglist(req, res) {
    try {
      const {
        page,
        start_date,
        end_date,
        booking_status,
        serach_text,
        timezone_id,
        timezone,
      } = req.query;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const paginate = 10;
      const condition = [];
      let default_timezone = '';
      let default_timezone_id = '';
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      if (start_date) {
        condition.push({
          book_date: {
            [Op.gte]: start_date,
          },
        });
      }
      if (end_date) {
        condition.push({
          book_date: {
            [Op.lte]: end_date,
          },
        });
      }
      if (booking_status) {
        condition.push({
          booking_status: {
            [Op.in]: booking_status.split(','),
          },
        });
      }
      condition.push({ organation_id: organizationData.user_id, user_id });
      if (serach_text) {
        condition.push({
          bookings_id: {
            [Op.like]: `%${serach_text}%`,
          },
        });
      }
      let timezone_data = '';
      if (timezone_id) {
        timezone_data = await models.Timezones.findOne({
          where: {
            timezone_id,
          },
        });
      } else {
        timezone_data = await models.Timezones.findOne({
          where: {
            utc: {
              [Op.like]: `%${timezone}%`,
            },
          },
        });
      }
      if (timezone_data) {
        timezone_data = await models.Timezones.findOne({
          where: {
            title: {
              [Op.like]: `%${timezone_data.title}%`,
            },
            text: {
              [Op.like]: `%${timezone_data.text}%`,
            },
          },
          group: [['title']],
        });
      }
      default_timezone = timezone_data.utc;
      default_timezone_id = timezone_data.timezone_id;
      const { docs, pages, total } = await models.Bookings.paginate({
        where: condition,
        attributes: [
          'bookings_id',
          'organation_id',
          'user_id',
          'book_date',
          'start_time',
          'end_time',
          'booking_status',
          'cancellation_by',
          'booking_notes',
          'reason',
          'cancellation_by',
          'cancellation_timestamp',
          'created_at',
        ],
        order: [
          ['booking_status', 'asc'],
          [
            Sequelize.fn(
              'concat',
              Sequelize.col('book_date'),
              ' ',
              Sequelize.col('start_time')
            ),
            'asc',
          ],
        ],
        page,
        paginate,
      });
      return response.successResponse(
        req,
        res,
        'admin.get_patient_booking_list_success',
        {
          pagination: {
            total,
            count: docs.length,
            current_page: page,
            last_page: pages,
            per_page: paginate,
            hasMorePages: pages > parseInt(page, 10),
          },
          data_list: docs,
          default_timezone,
          default_timezone_id,
        }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name organizationSlotBooking
   * @description organization slot booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationSlotBookingStore(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const {
        org_slot_id,
        org_specific_date_slot_id,
        patient_user_id,
        book_date,
        note,
        timezone_id,
        start_time,
        end_time,
      } = req.body;
      let book = '';
      if (org_specific_date_slot_id && org_slot_id === 0) {
        const org_specific_date_slot = await models.OrgSpecificDateSlot.findOne(
          {
            where: {
              org_specific_date_slot_id,
            },
          }
        );
        if (org_specific_date_slot) {
          if (
            org_specific_date_slot.is_closed === 2 ||
            org_specific_date_slot.is_booked === 2
          ) {
            throw new Error('admin.slot_not_available');
          } else {
            org_specific_date_slot.is_booked = 2;
            org_specific_date_slot.save();
            book = await models.Bookings.create({
              user_id: patient_user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_specific_date_slot.start_time,
              end_time: org_specific_date_slot.end_time,
              organation_id: organization_id,
              timezone_id,
              booking_notes: note,
            });
          }
        }
      } else {
        const org_slot = await models.OrgSlots.findOne({
          where: {
            org_slot_id,
          },
        });
        if (org_slot) {
          if (org_slot.is_closed === 2) {
            throw new Error('admin.slot_not_available');
          } else {
            book = await models.Bookings.create({
              user_id: patient_user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_slot.start_time,
              end_time: org_slot.end_time,
              organation_id: organization_id,
              timezone_id,
              booking_notes: note,
            });
          }
        }
      }

      if (book) {
        const { first_name, last_name, email } = await models.Users.findOne({
          where: {
            user_id: patient_user_id,
          },
        });
        const org = await models.Users.findOne({
          where: {
            user_id: organization_id,
          },
        });
        const { company_name } = await models.OrganizationInfo.findOne({
          where: {
            user_id: organization_id,
          },
        });

        const timezone_data = await models.Timezones.findOne({
          where: { timezone_id },
        });
        const bookDate = setFormatDate(book.book_date);
        const patient_name = `${first_name} ${last_name}`;
        const org_name = `${org.first_name} ${org.last_name}`;
        // send email to patient
        await organizationSendEmail({
          to: email,
          organization_id,
          template: 'organization-book-appointment',
          replacements: {
            BOOKINGID: book.bookings_id,
            FIRSTNAME: patient_name,
            ORGNAME: company_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
        // send email to organization
        await sendEmail({
          to: org.email,
          template: 'patient-book-appointment',
          replacements: {
            BOOKINGID: book.bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: patient_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_slot_booking_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name patientSlotBooking
   * @description patient slot booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientSlotBookingStore(req, res) {
    try {
      const { user_id, fullname, email } = req.payload.user;
      const { subdomain } = req.headers;
      const {
        org_slot_id,
        org_specific_date_slot_id,
        timezone_id,
        book_date,
        note,
        start_time,
        end_time,
      } = req.body;
      let book = '';

      const organization_info = await models.OrganizationInfo.findOne({
        where: { subdomain_name: subdomain },
      });
      if (org_specific_date_slot_id && org_slot_id === 0) {
        const org_specific_date_slot = await models.OrgSpecificDateSlot.findOne(
          {
            where: {
              org_specific_date_slot_id,
            },
          }
        );
        if (org_specific_date_slot) {
          if (
            org_specific_date_slot.is_closed === 2 ||
            org_specific_date_slot.is_booked === 2
          ) {
            throw new Error('admin.slot_not_available');
          } else {
            org_specific_date_slot.is_booked = 2;
            org_specific_date_slot.save();
            book = await models.Bookings.create({
              user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_specific_date_slot.start_time,
              end_time: org_specific_date_slot.end_time,
              organation_id: organization_info.user_id,
              timezone_id,
              booking_status: 2,
              booking_notes: note,
            });
          }
        }
      } else {
        const org_slot = await models.OrgSlots.findOne({
          where: {
            org_slot_id,
          },
        });
        if (org_slot) {
          if (org_slot.is_closed === 2) {
            throw new Error('admin.slot_not_available');
          } else {
            book = await models.Bookings.create({
              user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_slot.start_time,
              end_time: org_slot.end_time,
              organation_id: organization_info.user_id,
              timezone_id,
              booking_status: 2,
              booking_notes: note,
            });
          }
        }
      }
      if (book) {
        const org = await models.Users.findOne({
          where: {
            user_id: organization_info.user_id,
          },
        });
        const timezone_data = await models.Timezones.findOne({
          where: { timezone_id },
        });
        const org_name = `${org.first_name} ${org.last_name}`;
        const bookDate = setFormatDate(book.book_date);
        // send email to organization
        await sendEmail({
          to: org.email,
          template: 'patient-book-appointment',
          replacements: {
            BOOKINGID: book.bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: fullname,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
        // send email to patient
        await organizationSendEmail({
          to: email,
          organization_id: organization_info.user_id,
          template: 'organization-book-appointment',
          replacements: {
            BOOKINGID: book.bookings_id,
            FIRSTNAME: fullname,
            ORGNAME: organization_info.company_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_slot_booking_save_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name getBookingOrgSpecificSlotTime
   * @description get booking slot time.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getBookingOrgSpecificSlotTime(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const { date, timezone_id } = req.query;
      const start_time = [];
      const end_time = [];
      const org_specific = [];
      const data = [];
      let timezone_data = '';
      let check_date = 0;
      if (timezone_id) {
        timezone_data = await models.Timezones.findOne({
          where: {
            timezone_id,
          },
        });
      }
      await models.Bookings.findAll({
        attributes: ['start_time', 'end_time'],
        where: {
          organation_id: organization_id,
          book_date: date,
          booking_status: { [Op.in]: [1, 2] },
          cancellation_by: null,
        },
      }).then(async (obj) => {
        obj.map((v) => {
          start_time.push(v.start_time);
          end_time.push(v.end_time);
          return true;
        });
      });
      const orgAvailabilities = await models.OrgAvailabilities.findOne({
        where: {
          organation_id: organization_id,
        },
        attributes: ['is_date_range', 'start_date', 'end_date'],
      });
      if (orgAvailabilities && orgAvailabilities.is_date_range === 2) {
        if (
          orgAvailabilities.start_date <= date &&
          orgAvailabilities.end_date >= date
        ) {
          check_date = 1;
        }
      } else {
        check_date = 1;
      }
      if (check_date === 1) {
        await models.OrgSpecificDateSlot.findAll({
          where: {
            organation_id: organization_id,
            date,
          },
        }).then(async (obj) => {
          let day = moment(date).day();
          if (day === 0) {
            day = 7;
          }
          obj.map((object) => {
            start_time.push(object.start_time);
            end_time.push(object.end_time);
            if (object.is_closed === 1 && object.is_booked === 1) {
              const temp = object.dataValues;
              temp.org_slot_id = 0;
              org_specific.push(temp);
            }
            return true;
          });
          await models.OrgSlots.findAll({
            where: {
              organation_id: organization_id,
              is_closed: 1,
              day,
              [Op.and]: [
                {
                  start_time: { [Op.notIn]: start_time },
                },
                {
                  end_time: { [Op.notIn]: end_time },
                },
              ],
            },
          }).then(async (org_obj) => {
            org_obj.map((v) => {
              const t = v.dataValues;
              t.org_specific_date_slot_id = 0;
              org_specific.push(t);
              return t;
            });
          });
        });
        const user = await models.Users.findOne({
          where: { user_id: organization_id },
          include: [
            {
              model: models.Timezones,
              as: 'timezones',
            },
          ],
        });
        await Promise.all(
          org_specific.map((slot) => {
            const startTime = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                `${date} ${slot.start_time}`
              ),
              'DD-MM-YYYY hh:mm A'
            );
            const endTime = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                `${date} ${slot.end_time}`
              ),
              'DD-MM-YYYY hh:mm A'
            );
            const current_date_time = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                moment().format('YYYY-MM-DD HH:mm:ss')
              ),
              'DD-MM-YYYY hh:mm A'
            );
            let stime = '';
            let etime = '';
            if (startTime.valueOf() > current_date_time.valueOf()) {
              if (
                startTime.format('YYYY-MM-DD') < endTime.format('YYYY-MM-DD')
              ) {
                stime = startTime.format('hh:mm A');
                etime = endTime.format('MM-DD-YYYY hh:mm A');
              } else {
                stime = startTime.format('hh:mm A');
                etime = endTime.format('hh:mm A');
              }
              slot.start_time = stime;
              slot.end_time = etime;
              data.push(slot);
            }
            return true;
          })
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.get_booking_org_specific_slot_data_success',
        data
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getBookingPatientSpecificSlotTime
   * @description get booking slot time for patient.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async getBookingPatientSpecificSlotTime(req, res) {
    try {
      const { date, timezone_id, timezone } = req.query;
      const start_time = [];
      const end_time = [];
      const org_specific = [];
      const data = [];
      let check_date = 0;
      let timezone_data = '';
      let default_timezone = '';
      let default_timezone_id = '';
      const { subdomain } = req.headers;

      const organization_info = await models.OrganizationInfo.findOne({
        where: { subdomain_name: subdomain },
      });
      if (timezone_id) {
        timezone_data = await models.Timezones.findOne({
          where: {
            timezone_id,
          },
        });
      } else {
        timezone_data = await models.Timezones.findOne({
          where: {
            utc: {
              [Op.like]: `%${timezone}%`,
            },
          },
        });
        if (timezone_data) {
          timezone_data = await models.Timezones.findOne({
            where: {
              title: {
                [Op.like]: `%${timezone_data.title}%`,
              },
            },
            group: [['title']],
          });
        }
        default_timezone = timezone_data.utc;
        default_timezone_id = timezone_data.timezone_id;
      }
      await models.Bookings.findAll({
        attributes: ['start_time', 'end_time'],
        where: {
          organation_id: organization_info.user_id,
          book_date: date,
          booking_status: { [Op.in]: [1, 2] },
          cancellation_by: null,
        },
      }).then(async (obj) => {
        obj.map((v) => {
          start_time.push(v.start_time);
          end_time.push(v.end_time);
          return true;
        });
      });
      const orgAvailabilities = await models.OrgAvailabilities.findOne({
        where: {
          organation_id: organization_info.user_id,
        },
        attributes: ['is_date_range', 'start_date', 'end_date'],
      });
      if (orgAvailabilities && orgAvailabilities.is_date_range === 2) {
        if (
          orgAvailabilities.start_date <= date &&
          orgAvailabilities.end_date >= date
        ) {
          check_date = 1;
        }
      } else {
        check_date = 1;
      }
      if (check_date === 1) {
        await models.OrgSpecificDateSlot.findAll({
          where: {
            organation_id: organization_info.user_id,
            date,
          },
        }).then(async (obj) => {
          let day = moment(date).day();
          if (day === 0) {
            day = 7;
          }
          obj.map((object) => {
            start_time.push(object.start_time);
            end_time.push(object.end_time);
            if (object.is_closed === 1 && object.is_booked === 1) {
              const temp = object.dataValues;
              temp.org_slot_id = 0;
              org_specific.push(temp);
            }
            return true;
          });
          await models.OrgSlots.findAll({
            where: {
              organation_id: organization_info.user_id,
              is_closed: 1,
              day,
              [Op.and]: [
                {
                  start_time: { [Op.notIn]: start_time },
                },
                {
                  end_time: { [Op.notIn]: end_time },
                },
              ],
            },
          }).then(async (org_obj) => {
            org_obj.map((v) => {
              const t = v.dataValues;
              t.org_specific_date_slot_id = 0;
              org_specific.push(t);
              return t;
            });
          });
        });
        const user = await models.Users.findOne({
          where: { user_id: organization_info.user_id },
          include: [
            {
              model: models.Timezones,
              as: 'timezones',
            },
          ],
        });
        await Promise.all(
          org_specific.map((slot) => {
            const startTime = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                `${date} ${slot.start_time}`
              ),
              'DD-MM-YYYY hh:mm A'
            );
            const endTime = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                `${date} ${slot.end_time}`
              ),
              'DD-MM-YYYY hh:mm A'
            );
            const current_date_time = moment(
              momentTimezoneChange(
                user.timezones.utc,
                timezone_data.utc,
                'YYYY-MM-DD HH:mm:ss',
                'DD-MM-YYYY hh:mm A',
                moment().format('YYYY-MM-DD HH:mm:ss')
              ),
              'DD-MM-YYYY hh:mm A'
            );
            let stime = '';
            let etime = '';
            if (startTime.valueOf() > current_date_time.valueOf()) {
              if (
                startTime.format('YYYY-MM-DD') < endTime.format('YYYY-MM-DD')
              ) {
                stime = startTime.format('hh:mm A');
                etime = endTime.format('DD-MM-YYYY hh:mm A');
              } else {
                stime = startTime.format('hh:mm A');
                etime = endTime.format('hh:mm A');
              }
              slot.start_time = stime;
              slot.end_time = etime;
              data.push(slot);
            }
            return true;
          })
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.get_booking_patient_specific_slot_data_success',
        { data, default_timezone, default_timezone_id }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storeOrganizationRescheduleSlot
   * @description Organization Reschedual Sloat.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async storeOrganizationRescheduleSlot(req, res) {
    try {
      const { organization_id } = req.payload.user;
      const {
        bookings_id,
        org_slot_id,
        org_specific_date_slot_id,
        book_date,
        note,
        timezone_id,
        start_time,
        end_time,
      } = req.body;
      const bookingData = await models.Bookings.findOne({
        where: {
          bookings_id,
        },
      });
      if (bookingData.org_specific_date_slot_id !== 0) {
        await models.OrgSpecificDateSlot.update(
          {
            is_booked: 1,
          },
          {
            where: {
              org_specific_date_slot_id: bookingData.org_specific_date_slot_id,
            },
          }
        );
      }
      if (bookingData) {
        await models.Bookings.update(
          {
            booking_status: 8,
          },
          {
            where: {
              bookings_id,
            },
          }
        );
      }
      let book = '';
      if (org_specific_date_slot_id && org_slot_id === 0) {
        const org_specific_date_slot = await models.OrgSpecificDateSlot.findOne(
          {
            where: {
              org_specific_date_slot_id,
            },
          }
        );
        if (org_specific_date_slot) {
          if (
            org_specific_date_slot.is_closed === 2 ||
            org_specific_date_slot.is_booked === 2
          ) {
            throw new Error('admin.slot_not_available');
          } else {
            org_specific_date_slot.is_booked = 2;
            org_specific_date_slot.save();
            book = await models.Bookings.create({
              user_id: bookingData.user_id,
              org_slot_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_specific_date_slot.start_time,
              end_time: org_specific_date_slot.end_time,
              organation_id: organization_id,
              booking_notes: note,
              timezone_id,
            });
          }
        }
      } else {
        const org_slot = await models.OrgSlots.findOne({
          where: {
            org_slot_id,
          },
        });
        if (org_slot) {
          if (org_slot.is_closed === 2) {
            throw new Error('admin.slot_not_available');
          } else {
            book = await models.Bookings.create({
              user_id: bookingData.user_id,
              org_slot_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_slot.start_time,
              end_time: org_slot.end_time,
              organation_id: organization_id,
              booking_notes: note,
              timezone_id,
            });
          }
        }
      }
      if (book) {
        const { first_name, last_name, email } = await models.Users.findOne({
          where: {
            user_id: bookingData.user_id,
          },
        });
        const org = await models.Users.findOne({
          where: {
            user_id: organization_id,
          },
        });
        const { company_name } = await models.OrganizationInfo.findOne({
          where: {
            user_id: organization_id,
          },
        });
        const { text } = await models.Timezones.findOne({
          where: { timezone_id },
        });
        const bookDate = setFormatDate(book.book_date);
        const patient_name = `${first_name} ${last_name}`;
        const org_name = `${org.first_name} ${org.last_name}`;
        // send email to patient
        const isOrganizationEmailSent = await organizationSendEmail({
          to: email,
          organization_id,
          template: 'telepath-organization-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: patient_name,
            ORGNAME: company_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });
        // send email to organization
        const isPatientEmailSent = await sendEmail({
          to: org.email,
          template: 'telepath-patient-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: patient_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });
        if (!isPatientEmailSent) {
          throw new Error('admin.patient_appoitment_reschedule_mail_not_sent');
        }
        if (!isOrganizationEmailSent) {
          throw new Error(
            'admin.organization_appoitment_reschedule_mail_not_sent'
          );
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_slot_booking_reschedule_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name storePatientRescheduleSlot
   * @description Organization Reschedual Sloat.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async storePatientRescheduleSlot(req, res) {
    try {
      const { user_id, fullname } = req.payload.user;
      const { subdomain } = req.headers;
      const {
        bookings_id,
        org_slot_id,
        org_specific_date_slot_id,
        book_date,
        note,
        timezone_id,
        start_time,
        end_time,
      } = req.body;
      let book = '';
      const organization_info = await models.OrganizationInfo.findOne({
        where: { subdomain_name: subdomain },
      });
      const bookingData = await models.Bookings.findOne({
        where: {
          bookings_id,
        },
      });
      if (bookingData.org_specific_date_slot_id !== 0) {
        await models.OrgSpecificDateSlot.update(
          {
            is_booked: 1,
          },
          {
            where: {
              org_specific_date_slot_id: bookingData.org_specific_date_slot_id,
            },
          }
        );
      }
      if (bookingData) {
        await models.Bookings.update(
          {
            booking_status: 8,
          },
          {
            where: {
              bookings_id,
              organation_id: organization_info.user_id,
              user_id,
            },
          }
        );
      }
      if (org_specific_date_slot_id && org_slot_id === 0) {
        const org_specific_date_slot = await models.OrgSpecificDateSlot.findOne(
          {
            where: {
              org_specific_date_slot_id,
            },
          }
        );
        if (org_specific_date_slot) {
          if (
            org_specific_date_slot.is_closed === 2 ||
            org_specific_date_slot.is_booked === 2
          ) {
            throw new Error('admin.slot_not_available');
          } else {
            org_specific_date_slot.is_booked = 2;
            org_specific_date_slot.save();
            book = await models.Bookings.create({
              user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_specific_date_slot.start_time,
              end_time: org_specific_date_slot.end_time,
              organation_id: organization_info.user_id,
              timezone_id,
              booking_status: 2,
              booking_notes: note,
            });
          }
        }
      } else {
        const org_slot = await models.OrgSlots.findOne({
          where: {
            org_slot_id,
          },
        });
        if (org_slot) {
          if (org_slot.is_closed === 2) {
            throw new Error('admin.slot_not_available');
          } else {
            book = await models.Bookings.create({
              user_id,
              org_specific_date_slot_id,
              book_date,
              start_time: org_slot.start_time,
              end_time: org_slot.end_time,
              organation_id: organization_info.user_id,
              timezone_id,
              booking_status: 2,
              booking_notes: note,
            });
          }
        }
      }
      if (book) {
        const { first_name, last_name, email } = await models.Users.findOne({
          where: {
            user_id: organization_info.user_id,
          },
        });
        const { text } = await models.Timezones.findOne({
          where: { timezone_id },
        });
        const org_name = `${first_name} ${last_name}`;
        const bookDate = setFormatDate(book.book_date);
        // send email to organization
        const isPatientEmailSent = await sendEmail({
          to: email,
          template: 'telepath-patient-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: fullname,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });
        // send email to patient
        const isOrganizationEmailSent = await organizationSendEmail({
          to: email,
          organization_id: organization_info.user_id,
          template: 'telepath-organization-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: fullname,
            ORGNAME: organization_info.company_name,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });
        if (!isOrganizationEmailSent) {
          throw new Error(
            'admin.organization_appoitment_reschedule_mail_not_sent'
          );
        }
        if (!isPatientEmailSent) {
          throw new Error('admin.patient_appoitment_reschedule_mail_not_sent');
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_slot_booking_reschedule_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name bookingDetails
   * @description booking details get.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async bookingDetails(req, res) {
    try {
      const { bookings_id } = req.query;
      const getBookingData = await models.Bookings.findOne({
        where: { bookings_id },
        include: [
          {
            model: models.Users,
            as: 'users',
          },
          {
            model: models.Users,
            as: 'origination',
          },
        ],
      }).then(async (obj) => {
        const data = obj.dataValues;
        if (obj)
          if (obj.users) {
            data.users = obj.users.dataValues;
            data.users.profile_image = await obj.users.profile_image.then(
              (dataUrl) => dataUrl
            );
          }
        if (obj.origination) {
          data.origination = obj.origination.dataValues;
          data.origination.profile_image =
            await obj.origination.profile_image.then((dataUrl) => dataUrl);
        }
        return data;
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_cancel_booking_success',
        { booking_data: getBookingData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
  /**
   * @name bookingcallstatuschanges
   * @description booking call related data update.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async bookingcallstatuschanges(req, res) {
    try {
      const { user_type } = req.payload.user;
      const { bookings_id, type } = req.body;
      const bookingData = await models.Bookings.findOne({
        where: {
          bookings_id,
        },
        include: [
          {
            model: models.Users,
            as: 'origination',
            include: [
              {
                model: models.Timezones,
                as: 'timezones',
              },
            ],
          },
        ],
      });
      if (type === 'join') {
        if (user_type === 3) {
          bookingData.patient_join_time =
            bookingData.origination.timezones !== ''
              ? moment()
                  .tz(bookingData.origination.timezones.utc)
                  .format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss');
          bookingData.patient_join_unique_id = generateUUID();
        } else {
          bookingData.org_join_time =
            bookingData.origination.timezones !== ''
              ? moment()
                  .tz(bookingData.origination.timezones.utc)
                  .format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss');
          bookingData.org_join_unique_id = generateUUID();
        }
      } else if (type === 'change') {
        if (user_type === 3) {
          bookingData.patient_join_time =
            bookingData.origination.timezones !== ''
              ? moment()
                  .tz(bookingData.origination.timezones.utc)
                  .format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss');
        } else {
          bookingData.org_join_time =
            bookingData.origination.timezones !== ''
              ? moment()
                  .tz(bookingData.origination.timezones.utc)
                  .format('YYYY-MM-DD HH:mm:ss')
              : moment().format('YYYY-MM-DD HH:mm:ss');
        }
      } else {
        bookingData.booking_status = 4;
      }
      await bookingData.save();
      const getBookingData = await models.Bookings.findOne({
        where: { bookings_id },
        include: [
          {
            model: models.Users,
            as: 'users',
          },
          {
            model: models.Users,
            as: 'origination',
          },
        ],
      }).then(async (obj) => {
        const data = obj.dataValues;
        if (obj)
          if (obj.users) {
            data.users = obj.users.dataValues;
            data.users.profile_image = await obj.users.profile_image.then(
              (dataUrl) => dataUrl
            );
          }
        if (obj.origination) {
          data.origination = obj.origination.dataValues;
          data.origination.profile_image =
            await obj.origination.profile_image.then((dataUrl) => dataUrl);
        }
        return data;
      });
      return response.successResponse(
        req,
        res,
        'admin.organization_slot_booking_reschedule_success',
        { booking_data: getBookingData }
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }
  /**
   * @name bookingStatusUpdate
   * @description Update Booking Status.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */

  async bookingStatusUpdate(req, res) {
    try {
      const { bookings_id, type } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const organizationProfileData = await models.Users.findOne({
        where: { user_id: organizationData.user_id },
      });
      const patientProfileData = await models.Users.findOne({
        where: { user_id },
      });
      const getBookingData = await models.Bookings.findOne({
        where: {
          bookings_id,
          user_id,
          organation_id: organizationData.user_id,
        },
      });
      const getbookingTimezone = await models.Timezones.findOne({
        where: {
          timezone_id: getBookingData.timezone_id,
        },
        attributes: ['utc', 'text'],
      });
      const getOrgTimezone = await models.Timezones.findOne({
        where: {
          timezone_id: organizationProfileData.timezone_id,
        },
        attributes: ['utc', 'text'],
      });
      const startDate = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY',
          `${getBookingData.book_date} ${getBookingData.start_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      const Date = moment(startDate, 'DD-MM-YYYY hh:mm A').format(
        defaultDateFormate
      );
      const startTime = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          `${getBookingData.book_date} ${getBookingData.start_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      const endTime = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          `${getBookingData.book_date} ${getBookingData.end_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      let time = '';
      if (
        moment(startTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD') <
        moment(endTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD')
      ) {
        time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
          defaultDateTimeFormate
        )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
          defaultDateTimeFormate
        )}`;
      } else {
        time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
          defaultTimeFormate
        )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
          defaultTimeFormate
        )}`;
      }
      if (getBookingData) {
        if (type === 'accept') {
          await models.Bookings.update(
            {
              booking_status: 2,
            },
            {
              where: {
                bookings_id,
                user_id,
                organation_id: organizationData.user_id,
              },
            }
          );
          if (getBookingData.order_id && getBookingData.order_item_id) {
            const isorganizationEmailSent = await emailHelper.sendEmail({
              to: organizationProfileData.email,
              template: 'telepath-organization-order-appoitment-accept',
              replacements: {
                FIRSTNAME: `${organizationProfileData.first_name}`,
                PATIENTNAME: `${patientProfileData.first_name}`,
                BOOKING_ID: bookings_id,
                ORDERID: getBookingData.order_id,
                ORDERITEMID: getBookingData.order_item_id,
                BOOK_DATE: Date,
                TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });

            const isPatientEmailSent = await emailHelper.organizationSendEmail({
              to: patientProfileData.email,
              organization_id: organizationData.user_id,
              template: 'telepath-patient-order-appoitment-accept',
              replacements: {
                FIRSTNAME: `${patientProfileData.first_name}`,
                ORGANIZATIONNAME: `${organizationData.company_name}`,
                BOOKING_ID: bookings_id,
                ORDERID: getBookingData.order_id,
                ORDERITEMID: getBookingData.order_item_id,
                BOOK_DATE: Date,
                START_TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            if (!isPatientEmailSent) {
              throw new Error('admin.patient_appoitment_accept_mail_not_sent');
            }
            if (!isorganizationEmailSent) {
              throw new Error(
                'admin.organization_appoitment_accept_mail_not_sent'
              );
            }
          } else {
            const isorganizationEmailSent = await emailHelper.sendEmail({
              to: organizationProfileData.email,
              template: 'telepath-organization-appoitment-accept',
              replacements: {
                FIRSTNAME: `${organizationProfileData.first_name}`,
                PATIENTNAME: `${patientProfileData.first_name}`,
                BOOKING_ID: bookings_id,
                BOOK_DATE: Date,
                TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });

            const isPatientEmailSent = await emailHelper.organizationSendEmail({
              to: patientProfileData.email,
              organization_id: organizationData.user_id,
              template: 'telepath-patient-appoitment-accept',
              replacements: {
                FIRSTNAME: `${patientProfileData.first_name}`,
                ORGANIZATIONNAME: `${organizationData.company_name}`,
                BOOKING_ID: bookings_id,
                BOOK_DATE: Date,
                START_TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            if (!isPatientEmailSent) {
              throw new Error('admin.patient_appoitment_accept_mail_not_sent');
            }
            if (!isorganizationEmailSent) {
              throw new Error(
                'admin.organization_appoitment_accept_mail_not_sent'
              );
            }
          }
        }
        if (type === 'reject') {
          await models.Bookings.update(
            {
              booking_status: 3,
            },
            {
              where: {
                bookings_id,
                user_id,
                organation_id: organizationData.user_id,
              },
            }
          );
          if (getBookingData.org_specific_date_slot_id !== 0) {
            await models.OrgSpecificDateSlot.update(
              {
                is_booked: 1,
              },
              {
                where: {
                  org_specific_date_slot_id:
                    getBookingData.org_specific_date_slot_id,
                },
              }
            );
          }
          if (
            getBookingData &&
            getBookingData.order_item_id !== null &&
            getBookingData.order_id !== null
          ) {
            await models.OrderItems.update(
              {
                appointment_status: 1,
              },
              {
                where: {
                  order_id: getBookingData.order_id,
                  order_item_id: getBookingData.order_item_id,
                },
              }
            );
          }
          if (getBookingData.order_id && getBookingData.order_item_id) {
            const isEmailSent = await emailHelper.sendEmail({
              to: organizationProfileData.email,
              template: 'telepath-organization-order-appoitment-reject',
              replacements: {
                FIRSTNAME: `${organizationProfileData.first_name}`,
                PATIENTNAME: `${patientProfileData.first_name}`,
                BOOKING_ID: bookings_id,
                ORDERID: getBookingData.order_id,
                ORDERITEMID: getBookingData.order_item_id,
                BOOK_DATE: Date,
                TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            const isPatientEmailSent = await emailHelper.organizationSendEmail({
              to: patientProfileData.email,
              organization_id: organizationData.user_id,
              template: 'telepath-patient-order-appoitment-reject',
              replacements: {
                FIRSTNAME: `${patientProfileData.first_name}`,
                ORGANIZATIONNAME: `${organizationData.company_name}`,
                BOOKING_ID: bookings_id,
                ORDERID: getBookingData.order_id,
                ORDERITEMID: getBookingData.order_item_id,
                BOOK_DATE: Date,
                START_TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            if (!isPatientEmailSent) {
              throw new Error('admin.patient_appoitment_reject_mail_not_sent');
            }
            if (!isEmailSent) {
              throw new Error(
                'admin.organization_appoitment_reject_mail_not_sent'
              );
            }
          } else {
            const isEmailSent = await emailHelper.sendEmail({
              to: organizationProfileData.email,
              template: 'telepath-organization-appoitment-reject',
              replacements: {
                FIRSTNAME: `${organizationProfileData.first_name}`,
                PATIENTNAME: `${patientProfileData.first_name}`,
                BOOKING_ID: bookings_id,
                BOOK_DATE: Date,
                TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            const isPatientEmailSent = await emailHelper.organizationSendEmail({
              to: patientProfileData.email,
              organization_id: organizationData.user_id,
              template: 'telepath-patient-appoitment-reject',
              replacements: {
                FIRSTNAME: `${patientProfileData.first_name}`,
                ORGANIZATIONNAME: `${organizationData.company_name}`,
                BOOKING_ID: bookings_id,
                BOOK_DATE: Date,
                START_TIME: time,
                TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
              },
            });
            if (!isPatientEmailSent) {
              throw new Error('admin.patient_appoitment_reject_mail_not_sent');
            }
            if (!isEmailSent) {
              throw new Error(
                'admin.organization_appoitment_reject_mail_not_sent'
              );
            }
          }
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_booking_status_update_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }

  /**
   * @name cancelPatientBooking
   * @description Patient Cancel Booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async cancelPatientBooking(req, res) {
    try {
      const { reason, bookings_id } = req.body;
      const { user_id } = req.payload.user;
      const { subdomain } = req.headers;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const patientProfileData = await models.Users.findOne({
        where: { user_id },
      });
      const organizationProfileData = await models.Users.findOne({
        where: { user_id: organizationData.user_id },
      });
      const getBookingData = await models.Bookings.findOne({
        where: {
          user_id,
          bookings_id,
          organation_id: organizationData.user_id,
        },
      });
      if (getBookingData && getBookingData.org_specific_date_slot_id !== 0) {
        await models.OrgSpecificDateSlot.update(
          {
            is_booked: 1,
          },
          {
            where: {
              org_specific_date_slot_id:
                getBookingData.org_specific_date_slot_id,
            },
          }
        );
      }
      if (
        getBookingData &&
        getBookingData.order_item_id !== null &&
        getBookingData.order_id !== null
      ) {
        await models.OrderItems.update(
          {
            appointment_status: 1,
          },
          {
            where: {
              order_id: getBookingData.order_id,
              order_item_id: getBookingData.order_item_id,
            },
          }
        );
      }
      const getbookingTimezone = await models.Timezones.findOne({
        where: {
          timezone_id: getBookingData.timezone_id,
        },
        attributes: ['utc', 'text'],
      });
      const getOrgTimezone = await models.Timezones.findOne({
        where: {
          timezone_id: organizationProfileData.timezone_id,
        },
        attributes: ['utc', 'text'],
      });
      const startDate = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY',
          `${getBookingData.book_date} ${getBookingData.start_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      const Date = moment(startDate, 'DD-MM-YYYY hh:mm A').format(
        defaultDateFormate
      );
      const startTime = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          `${getBookingData.book_date} ${getBookingData.start_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      const endTime = moment(
        momentTimezoneChange(
          getOrgTimezone.utc,
          getbookingTimezone.utc,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          `${getBookingData.book_date} ${getBookingData.end_time}`
        ),
        'DD-MM-YYYY hh:mm A'
      );
      let time = '';
      if (
        moment(startTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD') <
        moment(endTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD')
      ) {
        time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
          defaultDateTimeFormate
        )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
          defaultDateTimeFormate
        )}`;
      } else {
        time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
          defaultTimeFormate
        )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
          defaultTimeFormate
        )}`;
      }
      if (getBookingData) {
        await models.Bookings.update(
          {
            booking_status: 10,
            reason,
            cancellation_by: 1,
          },
          {
            where: {
              user_id,
              bookings_id,
              organation_id: organizationData.user_id,
            },
          }
        );
        if (getBookingData.order_id && getBookingData.order_item_id) {
          const isPatientEmailSent = await emailHelper.organizationSendEmail({
            to: patientProfileData.email,
            organization_id: organizationData.user_id,
            template: 'telepath-patient-order-appoitment-cancel',
            replacements: {
              FIRSTNAME: `${patientProfileData.first_name}`,
              ORGANIZATIONNAME: `${organizationData.company_name}`,
              BOOKING_ID: bookings_id,
              ORDERID: getBookingData.order_id,
              ORDERITEMID: getBookingData.order_item_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isPatientEmailSent) {
            throw new Error('admin.patient_appoitment_cancel_mail_not_sent');
          }
          const isOrganizationEmailSent = await emailHelper.sendEmail({
            to: organizationProfileData.email,
            template: 'telepath-patient-order-appointment-cancel-org',
            replacements: {
              FIRSTNAME: `${organizationProfileData.first_name}`,
              PATIENTNAME: `${patientProfileData.first_name}`,
              BOOKING_ID: bookings_id,
              ORDERID: getBookingData.order_id,
              ORDERITEMID: getBookingData.order_item_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isOrganizationEmailSent) {
            throw new Error('admin.patient_appoitment_cancel_mail_not_sent');
          }
        } else {
          const isPatientEmailSent = await emailHelper.organizationSendEmail({
            to: patientProfileData.email,
            organization_id: organizationData.user_id,
            template: 'telepath-patient-appoitment-cancel',
            replacements: {
              FIRSTNAME: `${patientProfileData.first_name}`,
              ORGANIZATIONNAME: `${organizationData.company_name}`,
              BOOKING_ID: bookings_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isPatientEmailSent) {
            throw new Error('admin.patient_appoitment_cancel_mail_not_sent');
          }
          const isOrganizationEmailSent = await emailHelper.sendEmail({
            to: organizationProfileData.email,
            template: 'telepath-organization-appoitment-cancel',
            replacements: {
              FIRSTNAME: `${organizationProfileData.first_name}`,
              PATIENTNAME: `${patientProfileData.first_name}`,
              BOOKING_ID: bookings_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isOrganizationEmailSent) {
            throw new Error('admin.patient_appoitment_cancel_mail_not_sent');
          }
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.patient_cancel_booking_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name cancelOrganizationBooking
   * @description Organization Cancel Booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async cancelOrganizationBooking(req, res) {
    try {
      const { reason, bookings_id } = req.body;
      const { organization_id } = req.payload.user;
      const getBookingData = await models.Bookings.findOne({
        where: {
          organation_id: organization_id,
          bookings_id,
        },
      });
      if (getBookingData.org_specific_date_slot_id !== 0) {
        await models.OrgSpecificDateSlot.update(
          {
            is_booked: 1,
          },
          {
            where: {
              org_specific_date_slot_id:
                getBookingData.org_specific_date_slot_id,
            },
          }
        );
      }
      if (
        getBookingData &&
        getBookingData.order_item_id !== null &&
        getBookingData.order_id !== null
      ) {
        await models.OrderItems.update(
          {
            appointment_status: 1,
          },
          {
            where: {
              order_id: getBookingData.order_id,
              order_item_id: getBookingData.order_item_id,
            },
          }
        );
      }
      if (getBookingData) {
        await models.Bookings.update(
          {
            booking_status: 10,
            reason,
            cancellation_by: 2,
          },
          {
            where: {
              organation_id: organization_id,
              bookings_id,
            },
          }
        );
        const patientProfileData = await models.Users.findOne({
          where: { user_id: getBookingData.user_id },
        });
        const organizationProfileData = await models.Users.findOne({
          where: { user_id: organization_id },
        });
        const organizationData = await models.OrganizationInfo.findOne({
          where: { user_id: organization_id },
        });
        const getbookingTimezone = await models.Timezones.findOne({
          where: {
            timezone_id: getBookingData.timezone_id,
          },
          attributes: ['utc', 'text'],
        });
        const getOrgTimezone = await models.Timezones.findOne({
          where: {
            timezone_id: organizationProfileData.timezone_id,
          },
          attributes: ['utc', 'text'],
        });
        const startDate = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY',
            `${getBookingData.book_date} ${getBookingData.start_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        const Date = moment(startDate, 'DD-MM-YYYY hh:mm A').format(
          defaultDateFormate
        );
        const startTime = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY hh:mm A',
            `${getBookingData.book_date} ${getBookingData.start_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        const endTime = moment(
          momentTimezoneChange(
            getOrgTimezone.utc,
            getbookingTimezone.utc,
            'YYYY-MM-DD HH:mm:ss',
            'DD-MM-YYYY hh:mm A',
            `${getBookingData.book_date} ${getBookingData.end_time}`
          ),
          'DD-MM-YYYY hh:mm A'
        );
        let time = '';
        if (
          moment(startTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD') <
          moment(endTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD')
        ) {
          time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
            defaultDateTimeFormate
          )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
            defaultDateTimeFormate
          )}`;
        } else {
          time = `${moment(startTime, 'DD-MM-YYYY hh:mm A').format(
            defaultTimeFormate
          )} To ${moment(endTime, 'DD-MM-YYYY hh:mm A').format(
            defaultTimeFormate
          )}`;
        }
        if (getBookingData.order_id && getBookingData.order_item_id) {
          const isPatientEmailSent = await emailHelper.organizationSendEmail({
            to: patientProfileData.email,
            organization_id,
            template: 'telepath-org-order-appointment-cancel-patient',
            replacements: {
              FIRSTNAME: `${patientProfileData.first_name}`,
              ORGANIZATIONNAME: `${organizationData.company_name}`,
              BOOKING_ID: bookings_id,
              ORDERID: getBookingData.order_id,
              ORDERITEMID: getBookingData.order_item_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isPatientEmailSent) {
            throw new Error(
              'admin.organization_appoitment_cancel_mail_not_sent'
            );
          }
          const isOrganizationEmailSent = await emailHelper.sendEmail({
            to: organizationProfileData.email,
            template: 'telepath-organization-order-appointment-cancel',
            replacements: {
              FIRSTNAME: `${organizationProfileData.first_name}`,
              PATIENTNAME: `${patientProfileData.first_name}`,
              BOOKING_ID: bookings_id,
              BOOK_DATE: Date,
              ORDERID: getBookingData.order_id,
              ORDERITEMID: getBookingData.order_item_id,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isOrganizationEmailSent) {
            throw new Error(
              'admin.organization_appoitment_cancel_mail_not_sent'
            );
          }
        } else {
          const isPatientEmailSent = await emailHelper.organizationSendEmail({
            to: patientProfileData.email,
            organization_id,
            template: 'telepath-organization-appointment-cancel-patient',
            replacements: {
              FIRSTNAME: `${patientProfileData.first_name}`,
              ORGANIZATIONNAME: `${organizationData.company_name}`,
              BOOKING_ID: bookings_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isPatientEmailSent) {
            throw new Error(
              'admin.organization_appoitment_cancel_mail_not_sent'
            );
          }
          const isOrganizationEmailSent = await emailHelper.sendEmail({
            to: organizationProfileData.email,
            template: 'telepath-appointment-cancel-organization',
            replacements: {
              FIRSTNAME: `${organizationProfileData.first_name}`,
              PATIENTNAME: `${patientProfileData.first_name}`,
              BOOKING_ID: bookings_id,
              BOOK_DATE: Date,
              TIME: time,
              TIMEZONE: `${`${getbookingTimezone.text} (${getbookingTimezone.utc})`}`,
            },
          });
          if (!isOrganizationEmailSent) {
            throw new Error(
              'admin.organization_appoitment_cancel_mail_not_sent'
            );
          }
        }
      }
      return response.successResponse(
        req,
        res,
        'admin.organization_cancel_booking_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new BookingController();
