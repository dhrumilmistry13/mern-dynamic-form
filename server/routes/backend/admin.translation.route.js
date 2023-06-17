const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const translationController = require('../../controllers/backend/translation/admin.translation.controller');
const translationValidattion = require('../../controllers/backend/translation/admin.translation.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
  validate(translationValidattion.addTranslationValidation(), {}, {}),
  translationController.addTranslation
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
  validate(translationValidattion.editTranslationValidation(), {}, {}),
  translationController.editTranslation
);
router.get('/get', jwt.verifyAccessToken, translationController.getTranslation);
router.get(
  '/list',
  jwt.verifyAccessToken,
  translationController.listTranslation
);
router.delete(
  '/delete/',
  jwt.verifyAccessToken,
  translationController.deleteTranslation
);
router.put('/sync-data', jwt.verifyAccessToken, translationController.syncData);
module.exports = router;
