const express = require('express');
const { validate } = require('express-validation');

const router = express.Router();
const homeController = require('../../controllers/frontend/home/frontend.home.controller');
const frontendHomeValidation = require('../../controllers/frontend/home/frontend.home.validation');
const frontendHomeController = require('../../controllers/frontend/home/frontend.home.controller');
const frontendPatientHomeValidation = require('../../controllers/frontend/home/frontend.patient.validation');
const frontendPatientHomeController = require('../../controllers/frontend/home/frontend.patient.controller');

router.get('/get-home', homeController.getHomePageData);
router.post(
  '/get-in-touch-send-email',
  validate(frontendHomeValidation.getInTouchSendEmail(), {}, {}),
  frontendHomeController.getInTouchSendEmail
);

router.get('/patient/get-home', frontendPatientHomeController.getHomePageData);
router.post(
  '/patient/get-in-touch-send-email',
  validate(frontendPatientHomeValidation.getInTouchSendEmail(), {}, {}),
  frontendPatientHomeController.getInTouchSendEmail
);

router.get(
  '/patient/get-formulary',
  frontendPatientHomeController.getFormularyPageData
);

module.exports = router;
