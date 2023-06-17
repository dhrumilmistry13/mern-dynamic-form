const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const { multerUploads } = require('../../helpers/s3file.helper');

const router = express.Router();
const settingController = require('../../controllers/backend/settings/admin.setting.controller');
const settingValidation = require('../../controllers/backend/settings/admin.setting.validation');

router.post(
  '/home-banner',
  jwt.verifyAccessToken,
  multerUploads,
  // uploadFiles,
  validate(settingValidation.homeBannerValidation(), {}, {}),
  settingController.updateHomeBannerSettingsData
);
router.get(
  '/get-home-banner',
  jwt.verifyAccessToken,
  settingController.getHomeBanerSettingsData
);
router.post(
  '/home-about-us',
  jwt.verifyAccessToken,
  multerUploads,
  // uploadFiles,
  validate(settingValidation.homeAboutValidation(), {}, {}),
  settingController.updateAboutUsSettingsData
);
router.get(
  '/get-home-about-us',
  jwt.verifyAccessToken,
  settingController.getAboutUsSettingsData
);
router.get(
  '/get-home-how-its-work',
  jwt.verifyAccessToken,
  settingController.getHowItsWorkSettingsData
);
router.post(
  '/home-how-its-work',
  jwt.verifyAccessToken,
  multerUploads,
  // uploadFiles,
  validate(settingValidation.homeHowItsWorkValidation(), {}, {}),
  settingController.updateHowItsWorkSettingsData
);
router.get(
  '/get-home-our-team',
  jwt.verifyAccessToken,
  settingController.getOurTeamSettingsData
);
router.post(
  '/home-our-team',
  jwt.verifyAccessToken,
  validate(settingValidation.homeOurTeamValidation(), {}, {}),
  settingController.updateHomeOurTeamSettingsData
);
router.get('/get-home-general', settingController.getHomeGeneralSettingsData);
router.post(
  '/home-general',
  multerUploads,
  // uploadFiles,
  jwt.verifyAccessToken,
  validate(settingValidation.homeGeneralValidation(), {}, {}),
  settingController.updateHomeGeneralSettingsData
);

router.get(
  '/get-get-in-touch',
  jwt.verifyAccessToken,
  settingController.getGetInTouchSettingsData
);
router.post(
  '/home-get-in-touch',
  jwt.verifyAccessToken,
  multerUploads,
  // uploadFiles,
  validate(settingValidation.homeGetInTouchValidation(), {}, {}),
  settingController.updateGetInTouchSettingsData
);
router.get('/get-home-seo', settingController.getHomeSeoSettingsData);
router.put(
  '/home-seo',
  jwt.verifyAccessToken,
  validate(settingValidation.homeSeoValidation(), {}, {}),
  settingController.updateHomeSeoSettingsData
);
router.get(
  '/get-subscription-plan',
  jwt.verifyAccessToken,
  settingController.getSubScriptionPlanSettingsData
);
router.post(
  '/home-subscription-plan',
  jwt.verifyAccessToken,
  validate(settingValidation.homeSubScriptionPlanValidation(), {}, {}),
  settingController.updateSubScriptionPlanSettingsData
);

router.post(
  '/home-organization-how-its-work',
  jwt.verifyAccessToken,
  multerUploads,
  validate(settingValidation.organizationHowItsWorkValidation(), {}, {}),
  settingController.updateOrganizationHowItsWorkSettingsData
);

router.get(
  '/get-home-organization-how-its-work',
  jwt.verifyAccessToken,
  settingController.getOrganizationHowItsWorkSettingsData
);

module.exports = router;
