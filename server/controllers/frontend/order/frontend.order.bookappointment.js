const { Sequelize } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const {
  sendEmail,
  organizationSendEmail,
} = require('../../../helpers/email.helper');
const { setFormatDate } = require('../../../helpers/common.helper');

class BookingController {
  /**
   * @name organizationOrderSlotBooking
   * @description organization Order slot booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async organizationOrderSlotBooking(req, res) {
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
        order_id,
        order_item_id,
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
              order_id,
              order_item_id,
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
              order_id,
              order_item_id,
            });
          }
        }
      }
      if (book) {
        await models.OrderItems.update(
          {
            appointment_status: 2,
          },
          {
            where: {
              order_item_id,
              order_id,
              organization_id,
            },
          }
        );
      }
      if (book) {
        const { first_name, last_name, email } = await models.Users.findOne({
          where: {
            user_id: patient_user_id,
          },
        });
        const { company_name } = await models.OrganizationInfo.findOne({
          where: {
            user_id: organization_id,
          },
        });
        const org = await models.Users.findOne({
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
        await organizationSendEmail({
          to: email,
          organization_id,
          template: 'organization-order-book-appointment',
          replacements: {
            FIRSTNAME: patient_name,
            ORGNAME: company_name,
            ORDERITEMID: order_item_id,
            ORDERID: order_id,
            BOOKDATE: bookDate,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
        await sendEmail({
          to: org.email,
          template: 'organization-order-book-appointment-patient',
          replacements: {
            FIRSTNAME: org_name,
            PATIENTNAME: patient_name,
            BOOKDATE: bookDate,
            ORDERID: order_id,
            ORDERITEMID: order_item_id,
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
   * @name storeOrganizationRescheduleOrderSlot
   * @description Organization Reschedual Order Sloat.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async storeOrganizationRescheduleOrderSlot(req, res) {
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
              order_id: bookingData.order_id,
              order_item_id: bookingData.order_item_id,
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
              order_id: bookingData.order_id,
              order_item_id: bookingData.order_item_id,
            });
          }
        }
      }
      if (book) {
        await models.OrderItems.update(
          {
            appointment_status: 2,
          },
          {
            where: {
              order_item_id: bookingData.order_item_id,
              order_id: bookingData.order_id,
              organization_id,
            },
          }
        );
      }
      if (book) {
        const { first_name, last_name, email } = await models.Users.findOne({
          where: {
            user_id: bookingData.user_id,
          },
        });
        const { company_name } = await models.OrganizationInfo.findOne({
          where: {
            user_id: organization_id,
          },
        });
        const org = await models.Users.findOne({
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
        const isOrganizationEmailSent = await organizationSendEmail({
          to: email,
          organization_id,
          template: 'organization-order-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: patient_name,
            ORGNAME: company_name,
            BOOKDATE: bookDate,
            ORDERITEMID: bookingData.order_item_id,
            ORDERID: bookingData.order_id,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });
        const isPatientEmailSent = await sendEmail({
          to: org.email,
          template: 'patient-order-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: patient_name,
            BOOKDATE: bookDate,
            ORDERID: bookingData.order_id,
            ORDERITEMID: bookingData.order_item_id,
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
   * @name patientOrderSlotBooking
   * @description patient slot booking.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async patientOrderSlotBookingStore(req, res) {
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
        order_id,
        order_item_id,
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
              order_id,
              order_item_id,
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
              order_id,
              order_item_id,
            });
          }
        }
      }
      if (book) {
        await models.OrderItems.update(
          {
            appointment_status: 2,
          },
          {
            where: {
              order_item_id,
              order_id,
              user_id,
            },
          }
        );
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
        await sendEmail({
          to: org.email,
          template: 'patient-order-book-appointment',
          replacements: {
            FIRSTNAME: org_name,
            PATIENTNAME: fullname,
            BOOKDATE: bookDate,
            ORDERID: order_id,
            ORDERITEMID: order_item_id,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: `${timezone_data.text} (${timezone_data.utc})`,
          },
        });
        await organizationSendEmail({
          to: email,
          organization_id: organization_info.user_id,
          template: 'patient-order-book-appointment-organization',
          replacements: {
            FIRSTNAME: fullname,
            ORGNAME: organization_info.company_name,
            ORDERITEMID: order_item_id,
            ORDERID: order_id,
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
   * @name storePatientOrderRescheduleSlot
   * @description Patient Order Reschedual Sloat.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} successMessage
   */
  async storePatientOrderRescheduleSlot(req, res) {
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
              order_id: bookingData.order_id,
              order_item_id: bookingData.order_item_id,
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
              order_id: bookingData.order_id,
              order_item_id: bookingData.order_item_id,
            });
          }
        }
      }
      if (book) {
        await models.OrderItems.update(
          {
            appointment_status: 2,
          },
          {
            where: {
              order_item_id: bookingData.order_item_id,
              order_id: bookingData.order_id,
              user_id,
            },
          }
        );
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

        const isPatientEmailSent = await sendEmail({
          to: email,
          template: 'patient-order-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: org_name,
            PATIENTNAME: fullname,
            BOOKDATE: bookDate,
            ORDERID: bookingData.order_id,
            ORDERITEMID: bookingData.order_item_id,
            STARTTIME: start_time,
            ENDTIME: end_time,
            TIMEZONE: text,
          },
        });

        const isOrganizationEmailSent = await organizationSendEmail({
          to: email,
          organization_id: organization_info.user_id,
          template: 'organization-order-reschedule-appointment',
          replacements: {
            BOOKINGID: bookings_id,
            FIRSTNAME: fullname,
            ORGNAME: organization_info.company_name,
            BOOKDATE: bookDate,
            ORDERITEMID: bookingData.order_item_id,
            ORDERID: bookingData.order_id,
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
   * @name getOrganizationAppointmentList
   * @description Get Organization Appointment List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getOrganizationAppointmentList(req, res) {
    try {
      const { order_id } = req.query;
      const { organization_id } = req.payload.user;
      const appointmentData = await models.Bookings.findAll({
        where: {
          order_id,
          organation_id: organization_id,
        },
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
          'order_id',
          'order_item_id',
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
            attributes: ['user_id', 'first_name', 'last_name'],
            require: true,
            paranoid: false,
          },
        ],
      });
      return response.successResponse(
        req,
        res,
        'admin.order_appointment_list_get_success',
        appointmentData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getPatientAppointmentList
   * @description Get Patient Appointment List.
   * @param req
   * @param res
   * @returns { Json } successMessage
   */
  async getPatientAppointmentList(req, res) {
    try {
      const { order_id } = req.query;
      const { subdomain } = req.headers;
      const { user_id } = req.payload.user;
      const organizationData = await models.OrganizationInfo.findOne({
        where: {
          subdomain_name: subdomain,
        },
      });
      const appointmentData = await models.Bookings.findAll({
        where: {
          order_id,
          organation_id: organizationData.user_id,
          user_id,
        },
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
          'order_id',
          'order_item_id',
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
      });
      return response.successResponse(
        req,
        res,
        'admin.order_appointment_list_get_success',
        appointmentData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new BookingController();
