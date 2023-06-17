const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const availabilityController = require('../../controllers/frontend/availability/frontend.availability.controllers');
const availabilityValidation = require('../../controllers/frontend/availability/frontend.availability.validations');

router.post(
  '/save',
  jwt.verifyAccessToken,
  validate(availabilityValidation.addAvailabilty(), {}, {}),
  availabilityController.addUpdateAvailability
);
router.get(
  '/get-list-avilability',
  jwt.verifyAccessToken,
  availabilityController.getListAvailability
);

router.post(
  '/date-specific-availability-save',
  jwt.verifyAccessToken,
  validate(availabilityValidation.addUpdateDateSpecificAvailability(), {}, {}),
  availabilityController.addUpdateDateSpecificAvailability
);

router.get(
  '/date-specific-availability-get',
  jwt.verifyAccessToken,
  validate(availabilityValidation.getListDateSpecificAvailabilities(), {}, {}),
  availabilityController.getListDateSpecificAvailabilities
);

module.exports = router;
