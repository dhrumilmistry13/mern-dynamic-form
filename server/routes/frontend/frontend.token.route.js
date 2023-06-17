const express = require('express');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const tokenController = require('../../controllers/frontend/token/frontend.token.controlle');

router.post('/store', jwt.verifyAccessToken, tokenController.storeWebToken);
router.post(
  '/store-timezone',
  jwt.verifyAccessToken,
  tokenController.storeTimezone
);

module.exports = router;
