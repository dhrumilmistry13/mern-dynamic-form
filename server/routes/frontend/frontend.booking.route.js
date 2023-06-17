const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const bookingController = require('../../controllers/frontend/booking/frontend.booking.controller');
const bookingValidation = require('../../controllers/frontend/booking/frontend.booking.validation');

router.get(
  '/get-organization-booking-list',
  jwt.verifyAccessToken,
  bookingController.organizationBookinglist
);

router.get(
  '/get-patient-booking-list',
  jwt.verifyAccessToken,
  bookingController.patientBookinglist
);
router.put(
  '/organization-slot-book',
  jwt.verifyAccessToken,
  validate(bookingValidation.organizationSlotBookingStoreValidation(), {}, {}),
  bookingController.organizationSlotBookingStore
);
router.put(
  '/patient-slot-book',
  jwt.verifyAccessToken,
  validate(bookingValidation.patientSlotBookingStoreValidation(), {}, {}),
  bookingController.patientSlotBookingStore
);
router.get(
  '/get-book-org-specific-time-slot',
  jwt.verifyAccessToken,
  bookingController.getBookingOrgSpecificSlotTime
);
router.get(
  '/get-book-patient-specific-time-slot',
  jwt.verifyAccessToken,
  bookingController.getBookingPatientSpecificSlotTime
);
router.put(
  '/organization-reschedule-booking',
  jwt.verifyAccessToken,
  validate(bookingValidation.organizationRescheduleSlotValidation(), {}, {}),
  bookingController.storeOrganizationRescheduleSlot
);
router.put(
  '/patient-reschedule-booking',
  jwt.verifyAccessToken,
  validate(bookingValidation.patientRescheduleSlotValidation(), {}, {}),
  bookingController.storePatientRescheduleSlot
);
router.get(
  '/get-details',
  jwt.verifyAccessToken,
  bookingController.bookingDetails
);
router.put(
  '/join-data-update',
  jwt.verifyAccessToken,
  bookingController.bookingcallstatuschanges
);
router.put(
  '/update-booking-status',
  jwt.verifyAccessToken,
  bookingController.bookingStatusUpdate
);
router.put(
  '/patient-cancel-booking',
  jwt.verifyAccessToken,
  bookingController.cancelPatientBooking
);
router.put(
  '/organization-cancel-booking',
  jwt.verifyAccessToken,
  bookingController.cancelOrganizationBooking
);

module.exports = router;
