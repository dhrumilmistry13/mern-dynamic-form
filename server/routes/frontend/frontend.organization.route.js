const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const frontendOrganizationValidation = require('../../controllers/frontend/organization/frontend.organization.validation');
const frontendOrganizationController = require('../../controllers/frontend/organization/frontend.organization.controller');

router.put(
  '/general-info',
  jwt.verifyAccessToken,
  validate(
    frontendOrganizationValidation.organizationGeneralInfoStoreValidation(),
    {},
    {}
  ),
  frontendOrganizationController.organizationGeneralInfoStore
);
router.get(
  '/get-subdomain',
  frontendOrganizationController.getSubDomainToOrganization
);
router.get(
  '/state',
  jwt.verifyAccessToken,
  frontendOrganizationController.getStateData
);
router.get(
  '/specialities',
  jwt.verifyAccessToken,
  frontendOrganizationController.getSpecialitiesData
);
router.get(
  '/get-general-info',
  jwt.verifyAccessToken,
  frontendOrganizationController.getOrganizationInfo
);
router.put(
  '/how-its-work-step',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationHowItsWorkStore
);
router.get(
  '/get-subscription-data',
  jwt.verifyAccessToken,
  frontendOrganizationController.getSubscriptionSetpData
);
router.get(
  '/get-organization-brand-color-data',
  jwt.verifyAccessToken,
  frontendOrganizationController.getOrganizationBrandColorDetail
);
router.put(
  '/organization-brand-color-data',
  jwt.verifyAccessToken,
  validate(
    frontendOrganizationValidation.organizationBrandInfoStoreValidation(),
    {},
    {}
  ),
  frontendOrganizationController.organizationBrandInfoStore
);
router.delete(
  '/file-delete',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationDeleteHeaderFooter
);

router.put(
  '/organization-step-completion',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationStepCompletion
);

router.put(
  '/store-subscription-details',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationSubscriptionDetailsStore
);
router.put(
  '/update-subscription-details',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationSubscriptionDetailsUpdate
);
router.put(
  '/cancel-subscription-details',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationSubscriptionDetailsCancel
);
router.put(
  '/update-subscription-card-data',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationSubscriptionDataStore
);
router.get(
  '/get-dashboard-data',
  jwt.verifyAccessToken,
  frontendOrganizationController.getOrgDashboardData
);
router.get(
  '/sync-dosespot-data',
  jwt.verifyAccessToken,
  frontendOrganizationController.organizationDosespotSync
);

router.get(
  '/patient-list',
  jwt.verifyAccessToken,
  frontendOrganizationController.patientList
);

router.get(
  '/patient-master-list',
  jwt.verifyAccessToken,
  frontendOrganizationController.listPatient
);

module.exports = router;
