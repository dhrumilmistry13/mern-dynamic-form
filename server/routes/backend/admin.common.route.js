const express = require('express');

const { uploadFiles, multerUploads } = require('../../helpers/s3file.helper');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const commonController = require('../../controllers/backend/common/admin.common.controller');

router.get('/country-code-list', commonController.countryList);
router.get('/timezone-list', commonController.timezoneList);

router.get('/state-list', commonController.stateList);
router.get('/get-timezone', commonController.getTimezone);
router.post(
  '/file-upload',
  jwt.verifyAccessToken,
  multerUploads,
  uploadFiles,
  commonController.fileUpload
);
router.delete('/file-upload-remove', commonController.fileUploadRemove);

router.post('/file-upload-url', multerUploads, commonController.fileUploadUrl);
router.get(
  '/patient-list',
  jwt.verifyAccessToken,
  commonController.patientList
);

router.get(
  '/get-organization-timezone',
  jwt.verifyAccessToken,
  commonController.getOrgTimezone
);
router.get(
  '/get-patient-timezone',
  jwt.verifyAccessToken,
  commonController.getPatientOrgTimezone
);
module.exports = router;
