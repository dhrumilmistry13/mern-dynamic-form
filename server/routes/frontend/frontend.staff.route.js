const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const frontendStaffValidation = require('../../controllers/frontend/organization/frontend.staff.validation');
const frontendStaffController = require('../../controllers/frontend/organization/frontend.staff.controller');

router.put(
  '/add-staff',
  jwt.verifyAccessToken,
  validate(frontendStaffValidation.addStaffValidation(), {}, {}),
  frontendStaffController.staffAdd
);
router.put(
  '/edit-staff',
  jwt.verifyAccessToken,
  validate(frontendStaffValidation.editStaffValidation(), {}, {}),
  frontendStaffController.editStaff
);
router.get(
  '/get-staff/:user_id',
  jwt.verifyAccessToken,
  frontendStaffController.getStaff
);
router.get(
  '/list-staff',
  jwt.verifyAccessToken,
  frontendStaffController.listStaff
);
router.put(
  '/update-status',
  jwt.verifyAccessToken,
  validate(
    frontendStaffValidation.staffAdminUserStatusUpdateValidation(),
    {},
    {}
  ),
  frontendStaffController.staffAdminUserStatusUpdate
);
router.delete(
  '/delete-staff',
  jwt.verifyAccessToken,
  frontendStaffController.deleteStaffData
);

router.put(
  '/store-general-info',
  jwt.verifyAccessToken,
  validate(frontendStaffValidation.staffGeneralInfoStoreValidation(), {}, {}),
  frontendStaffController.staffGeneralInfoStore
);
router.get(
  '/get-staff-general-info',
  jwt.verifyAccessToken,
  frontendStaffController.getStaffInfo
);

module.exports = router;
