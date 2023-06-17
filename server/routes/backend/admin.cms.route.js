const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const cmsController = require('../../controllers/backend/cms/admin.cms.controller');
const cmsValidattion = require('../../controllers/backend/cms/admin.cms.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
  validate(cmsValidattion.addCMSValidation(), {}, {}),
  cmsController.addCMS
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
  validate(cmsValidattion.editCMSValidation(), {}, {}),
  cmsController.editCMS
);
router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  cmsController.updateStatusCMS
);
router.get('/get', jwt.verifyAccessToken, cmsController.getCMS);
router.get('/list', jwt.verifyAccessToken, cmsController.listCMS);
router.delete('/delete/', jwt.verifyAccessToken, cmsController.deleteCMS);
module.exports = router;
