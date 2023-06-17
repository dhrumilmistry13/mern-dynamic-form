const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const { multerUploads } = require('../../helpers/s3file.helper');

const router = express.Router();
const organizationSettingController = require('../../controllers/frontend/settings/frontend.settings.controller');
const organizationSettingValidation = require('../../controllers/frontend/settings/frontend.settings.validation');

router.post(
  '/home-organization-banner',
  jwt.verifyAccessToken,
  multerUploads,
  validate(
    organizationSettingValidation.homeOrganizationBannerValidation(),
    {},
    {}
  ),
  organizationSettingController.updateHomeOrganizationBannerSettingsData
);

router.get(
  '/get-home-organization-banner',
  jwt.verifyAccessToken,
  organizationSettingController.getOrganizationBannerSettingsData
);

router.post(
  '/home-organization-who-we-are',
  jwt.verifyAccessToken,
  multerUploads,
  validate(
    organizationSettingValidation.homeOrganizationWhoWeAreValidation(),
    {},
    {}
  ),
  organizationSettingController.updateHomeOrganizationWhoWeAreSettingsData
);

router.get(
  '/get-home-organization-who-we-are',
  jwt.verifyAccessToken,
  organizationSettingController.getOrganizationWhoWeAreSettingsData
);

router.post(
  '/home-organization-client',
  jwt.verifyAccessToken,
  multerUploads,
  validate(
    organizationSettingValidation.homeOrganizationClientValidation(),
    {},
    {}
  ),
  organizationSettingController.updateHomeOrganizationClientSettingsData
);

router.get(
  '/get-home-organization-client',
  jwt.verifyAccessToken,
  organizationSettingController.getOrganizationClientSettingsData
);

router.post(
  '/home-organization-get-in-touch',
  jwt.verifyAccessToken,
  multerUploads,
  validate(
    organizationSettingValidation.homeOrganizationGetInTouchValidation(),
    {},
    {}
  ),
  organizationSettingController.updateOrganizationGetInTouchSettingsData
);

router.get(
  '/get-home-organization-get-in-touch',
  jwt.verifyAccessToken,
  organizationSettingController.getOrganizationGetInTouchSettingsData
);

router.put(
  '/home-organization-seo',
  jwt.verifyAccessToken,
  // validate(
  //   organizationSettingValidation.homeOrganizationSeoValidation(),
  //   {},
  //   {}
  // ),
  organizationSettingController.updateOrganizationSeoSettingsData
);

router.get(
  '/get-home-organization-seo',
  jwt.verifyAccessToken,
  organizationSettingController.getOrganizationSeoSettingsData
);
module.exports = router;
