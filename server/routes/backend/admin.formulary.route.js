const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const formularyController = require('../../controllers/backend/formulary/admin.formulary.controller');
const formularyValidation = require('../../controllers/backend/formulary/admin.formulary.validation');

const {
  multerUploads,
  // uploadFormularyFiles,
} = require('../../helpers/s3file.helper');

router.post(
  '/add',
  multerUploads,
  // uploadFormularyFiles,
  jwt.verifyAccessToken,
  validate(formularyValidation.addFormularyValidation(), {}, {}),
  formularyController.addFormulary
);

router.post(
  '/edit',
  multerUploads,
  // uploadFormularyFiles,
  jwt.verifyAccessToken,
  validate(formularyValidation.editFormularyValidation(), {}, {}),
  formularyController.editFormulary
);
router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  formularyController.formularyStatusUpdate
);

router.get('/list', jwt.verifyAccessToken, formularyController.listFormulary);

router.get('/get', jwt.verifyAccessToken, formularyController.getFormulary);

router.delete(
  '/delete/',
  jwt.verifyAccessToken,
  formularyController.deleteFormularyImage
);

router.get(
  '/get-formulary-question',
  jwt.verifyAccessToken,
  formularyController.getFormularyQuestion
);

router.get(
  '/get-organization-formulary-data',
  jwt.verifyAccessToken,
  formularyController.getOrganizationFormularyData
);

router.delete(
  '/delete/formulary',
  jwt.verifyAccessToken,
  formularyController.deleteFormularyData
);

module.exports = router;
