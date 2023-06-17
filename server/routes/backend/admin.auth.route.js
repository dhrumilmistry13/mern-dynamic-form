const express = require('express');
const { validate } = require('express-validation');

const router = express.Router();

const adminAuthController = require('../../controllers/backend/auth/admin.auth.controller');
const adminAuthValidator = require('../../controllers/backend/auth/admin.auth.validation');

router.post(
  '/login',
  validate(adminAuthValidator.loginValidation(), {}, {}),
  adminAuthController.adminLogin
);

router.put(
  '/forgot-password',
  validate(adminAuthValidator.forgotPasswordValidation(), {}, {}),
  adminAuthController.forgotPassword
);

router.put(
  '/verify-forgot-otp',
  validate(adminAuthValidator.verifyForgotEmailOtpValidation(), {}, {}),
  adminAuthController.verifyForgotPassword
);
router.patch(
  '/reset-password',
  validate(adminAuthValidator.resetPasswordValidation(), {}, {}),
  adminAuthController.resetPassword
);
router.put(
  '/forgot-password/resend-otp',
  validate(adminAuthValidator.resendOTPValidation(), {}, {}),
  adminAuthController.resendOTP
);

module.exports = router;
