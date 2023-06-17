const express = require('express');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const patientChartAuthController = require('../../controllers/frontend/patientchart/frontend.patientchart.controller');

router.get(
  '/get-general-details',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientChartGeneralDetails
);

router.get(
  '/get-insurance-details',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientChartInsuranceDetails
);

router.get(
  '/get-all-orders',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientChartAllOrderDetails
);

router.get(
  '/get-all-notes',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientOrderNote
);

router.get(
  '/get-patient-details',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientDetails
);

router.get(
  '/get-orders',
  jwt.verifyAccessToken,
  patientChartAuthController.getPatientChartAllOrders
);

module.exports = router;
