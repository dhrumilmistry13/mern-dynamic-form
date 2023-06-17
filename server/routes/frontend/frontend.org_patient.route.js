const express = require('express');
// const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
// const frontendOrgPatientValidation = require('../../controllers/frontend/organization/frontend.staff.validation');
const frontendOrgPatientController = require('../../controllers/frontend/organization/frontend.patient.controller');

router.get(
  '/get-patient-general-details',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientGeneralDetails
);
router.get(
  '/get-patient-basic-details',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientBasicDetails
);
router.get(
  '/get-patient-insurance-details',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientInsuranceDetails
);
router.get(
  '/get-patient-all-notes',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getAllNotes
);
router.get(
  '/get-patient-order-details',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientAllOrders
);
router.get(
  '/get-orders',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientChartAllOrders
);
router.get(
  '/get-patient-chat-room',
  jwt.verifyAccessToken,
  frontendOrgPatientController.getPatientChatRoomData
);
module.exports = router;
