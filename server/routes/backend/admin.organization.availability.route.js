const express = require('express');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const organizationAvailabilityController = require('../../controllers/backend/availability/admin.organization.availability.controller');

router.get(
  '/organization-availability-get',
  jwt.verifyAccessToken,
  organizationAvailabilityController.getListAvailability
);
module.exports = router;
