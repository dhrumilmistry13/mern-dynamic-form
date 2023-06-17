const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const frontendFormularyController = require('../../controllers/frontend/formulary/frontend.formulary.controller');
const frontendFormularyValidation = require('../../controllers/frontend/formulary/frontend.formulary.validation');

router.get(
  '/get-formularydata',
  jwt.verifyAccessToken,
  frontendFormularyController.getFormularyData
);

router.get(
  '/get',
  jwt.verifyAccessToken,
  frontendFormularyController.getFormularyList
);

router.put(
  '/store-formularydata',
  jwt.verifyAccessToken,
  validate(frontendFormularyValidation.addFormularyValidation(), {}, {}),
  frontendFormularyController.organizationFormularyDataStore
);

router.delete(
  '/delete',
  jwt.verifyAccessToken,
  frontendFormularyController.organizationFormularyDataDelete
);
module.exports = router;
