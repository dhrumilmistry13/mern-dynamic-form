const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const orderBookingController = require('../../controllers/frontend/order/frontend.order.bookappointment');
const orderBookingValidation = require('../../controllers/frontend/order/frontend.order.bookappointment.validation');

router.put(
  '/organization-order-slot-book',
  jwt.verifyAccessToken,
  validate(
    orderBookingValidation.organizationOrderSlotBookingStoreValidation(),
    {},
    {}
  ),
  orderBookingController.organizationOrderSlotBooking
);
// router.get(
//   '/get-organization-booking-details',
//   jwt.verifyAccessToken,
//   orderBookingController.organizationBookingDetails
// );
router.put(
  '/organization-reschedule-order-booking',
  jwt.verifyAccessToken,
  validate(
    orderBookingValidation.organizationRescheduleOrderSlotValidation(),
    {},
    {}
  ),
  orderBookingController.storeOrganizationRescheduleOrderSlot
);
router.put(
  '/patient-order-slot-book',
  jwt.verifyAccessToken,
  validate(
    orderBookingValidation.patientOrderSlotBookingStoreValidation(),
    {},
    {}
  ),
  orderBookingController.patientOrderSlotBookingStore
);
router.put(
  '/patient-reschedule-order-booking',
  jwt.verifyAccessToken,
  validate(
    orderBookingValidation.patientOrderRescheduleSlotValidation(),
    {},
    {}
  ),
  orderBookingController.storePatientOrderRescheduleSlot
);
router.get(
  '/get-organization-appointment-list',
  jwt.verifyAccessToken,
  orderBookingController.getOrganizationAppointmentList
);
router.get(
  '/get-patient-appointment-list',
  jwt.verifyAccessToken,
  orderBookingController.getPatientAppointmentList
);

module.exports = router;
