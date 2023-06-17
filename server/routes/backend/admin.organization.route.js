const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const organizationController = require('../../controllers/backend/organization/admin.organization.controller');
const organizationValidattion = require('../../controllers/backend/organization/admin.organization.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
  validate(organizationValidattion.addOrganizationValidation(), {}, {}),
  organizationController.organizationAdd
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
  validate(organizationValidattion.editOrganizationValidation(), {}, {}),
  organizationController.editOrganization
);
router.get(
  '/get/:user_id',
  jwt.verifyAccessToken,
  organizationController.getOrganization
);
router.get(
  '/list',
  jwt.verifyAccessToken,
  organizationController.listOrganization
);

router.put(
  '/update-status',
  jwt.verifyAccessToken,
  validate(
    organizationValidattion.organizationAdminUserStatusUpdateValidation(),
    {},
    {}
  ),
  organizationController.organizationAdminUserStatusUpdate
);

router.get(
  '/organization-practice-data',
  jwt.verifyAccessToken,
  organizationController.getOrganizationPracticeData
);

router.get(
  '/organization-brand-color-data',
  jwt.verifyAccessToken,
  organizationController.getOrganizationBrandColorDetail
);
router.get(
  '/organization-subscription-data',
  jwt.verifyAccessToken,
  organizationController.getOraganizationSubscriptionData
);
router.put(
  '/organization-subscription-store',
  jwt.verifyAccessToken,
  organizationController.organizationSubscriptionDetailsStore
);
router.put(
  '/organization-subscription-cancel',
  jwt.verifyAccessToken,
  organizationController.organizationSubscriptionDetailsCancel
);
router.get(
  '/organization-booking-list',
  jwt.verifyAccessToken,
  organizationController.organizationBookingList
);

module.exports = router;
