const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const adminPatientController = require('../../controllers/backend/patient/admin.patient.controller');
const PatientValidation = require('../../controllers/backend/patient/admin.patient.validation');

router.get('/list', jwt.verifyAccessToken, adminPatientController.listpatient);
router.put(
  '/update-status',
  jwt.verifyAccessToken,
  validate(PatientValidation.patientStatusUpdateValidation(), {}, {}),
  adminPatientController.patientStatusUpdate
);
router.get(
  '/organisations',
  jwt.verifyAccessToken,
  adminPatientController.getAllOrganizations
);
router.get(
  '/general-patient-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientOrganisationGeneralDetails
);
router.put(
  '/edit-patient-general-details',
  jwt.verifyAccessToken,
  validate(PatientValidation.editPatientProfileValidation(), {}, {}),
  adminPatientController.editPatientProfile
);
router.get(
  '/get-patient-basic-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientBasicDetails
);
router.get(
  '/get-patient-insurance-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientInsuranceDetails
);
router.get(
  '/get-patient-order-list',
  jwt.verifyAccessToken,
  adminPatientController.getPatientAllOrders
);
router.get(
  '/get-all-notes',
  jwt.verifyAccessToken,
  adminPatientController.getAllNotes
);
router.get(
  '/get-patient-order-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientOrderDetails
);
router.get(
  '/get-patient-medical-intake',
  jwt.verifyAccessToken,
  adminPatientController.getPatientMedicalIntake
);
router.get(
  '/get-patient-general-intake',
  jwt.verifyAccessToken,
  adminPatientController.getPatientGeneralIntake
);
router.get(
  '/get-patient-order-transaction',
  jwt.verifyAccessToken,
  adminPatientController.getPatientOrderTransactions
);
router.get(
  '/get-patient-order-notes',
  jwt.verifyAccessToken,
  adminPatientController.getorderNotes
);
router.get(
  '/get-orders',
  jwt.verifyAccessToken,
  adminPatientController.getPatientChartAllOrders
);
router.get(
  '/get-general-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientChartGeneralDetails
);

router.get(
  '/get-patient-details',
  jwt.verifyAccessToken,
  adminPatientController.getPatientDetails
);

router.get(
  '/patient-booking-list',
  jwt.verifyAccessToken,
  adminPatientController.patientBookingList
);

module.exports = router;
