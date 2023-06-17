const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const domainProviderController = require('../../controllers/backend/domain_provider/domain_provider.controller');
const domainProviderValidation = require('../../controllers/backend/domain_provider/domain_provider.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
//   validate(domainProviderValidation.addDomainProviderValidation(), {}, {}),
  domainProviderController.addDomainProvider
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
//   validate(domainProviderValidation.editDomainProviderValidation(), {}, {}),
  domainProviderController.editDomainProvider
);
router.get(
  '/get',
  jwt.verifyAccessToken,
  domainProviderController.getDomainProvider
);
router.get(
  '/list',
  jwt.verifyAccessToken,
  domainProviderController.listDomainProvider
);
module.exports = router;
