const { Joi } = require('express-validation');

class BookingValidator {
  organizationSlotBookingStoreValidation() {
    return {
      body: Joi.object({
        org_slot_id: Joi.number().required().messages({
          'number.base': 'admin.organization_slot_booking_org_slot_id_required',
          'any.required':
            'admin.organization_slot_booking_org_slot_id_required',
        }),
        org_specific_date_slot_id: Joi.number().required().messages({
          'number.base':
            'admin.organization_slot_booking_org_specific_date_slot_id_required',
          'any.required':
            'admin.organization_slot_booking_org_specific_date_slot_id_required',
        }),
        patient_user_id: Joi.number().required().messages({
          'number.base': 'admin.organization_patient_user_id_required',
          'any.required': 'admin.organization_patient_user_id_required',
        }),
        book_date: Joi.string().required().trim(true).messages({
          'string.base': 'admin.organization_book_date_validation_required',
          'any.required': 'admin.organization_book_date_validation_required',
          'string.empty': 'admin.organization_book_date_validation_required',
        }),
        booking_slot_id: Joi.optional(),
        start_time: Joi.optional(),
        note: Joi.optional(),
        end_time: Joi.optional(),
        timezone: Joi.optional(),
        timezone_id: Joi.optional(),
      }),
    };
  }

  patientSlotBookingStoreValidation() {
    return {
      body: Joi.object({
        org_slot_id: Joi.number().required().messages({
          'number.base': 'admin.patient_slot_booking_org_slot_id_required',
          'any.required': 'admin.patient_slot_booking_org_slot_id_required',
        }),
        org_specific_date_slot_id: Joi.number().required().messages({
          'number.base':
            'admin.patient_slot_booking_org_specific_date_slot_id_required',
          'any.required':
            'admin.patient_slot_booking_org_specific_date_slot_id_required',
        }),
        book_date: Joi.string().required().trim(true).messages({
          'string.base': 'admin.patient_book_date_validation_required',
          'any.required': 'admin.patient_book_date_validation_required',
          'string.empty': 'admin.patient_book_date_validation_required',
        }),
        booking_slot_id: Joi.optional(),
        note: Joi.optional(),
        start_time: Joi.optional(),
        end_time: Joi.optional(),
        timezone: Joi.optional(),
        timezone_id: Joi.optional(),
      }),
    };
  }

  organizationRescheduleSlotValidation() {
    return {
      body: Joi.object({
        org_slot_id: Joi.number().required().messages({
          'number.base':
            'admin.organization_slot_reshedule_org_slot_id_required',
          'any.required':
            'admin.organization_slot_reshedule_org_slot_id_required',
        }),
        bookings_id: Joi.number().required().messages({
          'number.base':
            'admin.organization_slot_reshedule_booking_org_slot_id_required',
          'any.required':
            'admin.organization_slot_reshedule_booking_org_slot_id_required',
        }),
        org_specific_date_slot_id: Joi.number().required().messages({
          'number.base':
            'admin.organization_slot_reshedule_org_specific_date_slot_id_required',
          'any.required':
            'admin.organization_slot_reshedule_org_specific_date_slot_id_required',
        }),
        book_date: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.organization_slot_reshedule_book_date_validation_required',
          'any.required':
            'admin.organization_slot_reshedule_book_date_validation_required',
          'string.empty':
            'admin.organization_slot_reshedule_book_date_validation_required',
        }),
        booking_slot_id: Joi.optional(),
        note: Joi.optional(),
        start_time: Joi.optional(),
        end_time: Joi.optional(),
        timezone: Joi.optional(),
        timezone_id: Joi.optional(),
      }),
    };
  }

  patientRescheduleSlotValidation() {
    return {
      body: Joi.object({
        org_slot_id: Joi.number().required().messages({
          'number.base': 'admin.patient_slot_reshedule_org_slot_id_required',
          'any.required': 'admin.patient_slot_reshedule_org_slot_id_required',
        }),
        org_specific_date_slot_id: Joi.number().required().messages({
          'number.base':
            'admin.patient_slot_reshedule_org_specific_date_slot_id_required',
          'any.required':
            'admin.patient_slot_reshedule_org_specific_date_slot_id_required',
        }),
        bookings_id: Joi.number().required().messages({
          'number.base': 'admin.patient_slot_reshedule_booking_id_required',
          'any.required': 'admin.patient_slot_reshedule_booking_id_required',
        }),
        book_date: Joi.string().required().trim(true).messages({
          'string.base':
            'admin.patient_slot_reshedule_book_date_validation_required',
          'any.required':
            'admin.patient_slot_reshedule_book_date_validation_required',
          'string.empty':
            'admin.patient_slot_reshedule_book_date_validation_required',
        }),
        start_time: Joi.optional(),
        note: Joi.optional(),
        end_time: Joi.optional(),
        timezone: Joi.optional(),
        booking_slot_id: Joi.optional(),
        timezone_id: Joi.optional(),
      }),
    };
  }
}
module.exports = new BookingValidator();
