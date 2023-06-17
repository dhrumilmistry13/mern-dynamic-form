const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const SpecialitiesController = require('../../controllers/backend/specialities/admin.specialities.controller');
const SpecialitiesValidation = require('../../controllers/backend/specialities/admin.specialities.validation');

router.post(
  '/add',
  jwt.verifyAccessToken,
  validate(SpecialitiesValidation.addSpecialitiesValidation(), {}, {}),
  SpecialitiesController.addSpecialities
);

router.post(
  '/edit',
  jwt.verifyAccessToken,
  validate(SpecialitiesValidation.editSpecialitiesValidation(), {}, {}),
  SpecialitiesController.editSpecialities
);

router.get(
  '/get',
  jwt.verifyAccessToken,
  SpecialitiesController.getSpecialities
);

router.get(
  '/list',
  jwt.verifyAccessToken,
  SpecialitiesController.listSpecialities
);

router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  SpecialitiesController.updateStatusSpecialities
);

router.delete(
  '/delete',
  jwt.verifyAccessToken,
  SpecialitiesController.deleteSpecialities
);
module.exports = router;
