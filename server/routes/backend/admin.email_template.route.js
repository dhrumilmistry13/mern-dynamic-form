const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const emailTemplateController = require('../../controllers/backend/email_template/admin.email_template.controller');
const emailTemplateValidattion = require('../../controllers/backend/email_template/admin.email_template.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
  validate(emailTemplateValidattion.addEmailTemplateValidation(), {}, {}),
  emailTemplateController.addEmailTemplate
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
  validate(emailTemplateValidattion.editEmailTemplateValidation(), {}, {}),
  emailTemplateController.editEmailTemplate
);
router.get(
  '/get',
  jwt.verifyAccessToken,
  emailTemplateController.getEmailTemplate
);
router.get(
  '/list',
  jwt.verifyAccessToken,
  emailTemplateController.listEmailTemplate
);
module.exports = router;
