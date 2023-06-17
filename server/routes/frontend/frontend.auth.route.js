const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');
const { multerUploads } = require('../../helpers/s3file.helper');

const router = express.Router();

const userAuthController = require('../../controllers/frontend/auth/frontend.auth.controller');
const userAuthValidator = require('../../controllers/frontend/auth/frontend.auth.validation');

router.post(
  '/signup',
  validate(userAuthValidator.organizationSignupValidation(), {}, {}),
  userAuthController.organizationSignup
);

router.put(
  '/resend-otp',
  validate(userAuthValidator.resendEmailOTPValidation(), {}, {}),
  userAuthController.resendOTP
);

router.put(
  '/verify-otp',
  validate(userAuthValidator.verifyOtpValidation(), {}, {}),
  userAuthController.verifyOTP
);

router.post(
  '/login',
  validate(userAuthValidator.organizationLoginValidation(), {}, {}),
  userAuthController.organizationLogin
);

router.put(
  '/forgot-password',
  validate(userAuthValidator.organizationForgotPasswordValidation(), {}, {}),
  userAuthController.organizationForgotPassword
);

router.put(
  '/forgot-password/resend-otp',
  validate(userAuthValidator.organizationResendOTPValidation(), {}, {}),
  userAuthController.organizationForgotResendOTP
);

router.put(
  '/verify-forgot-otp',
  validate(
    userAuthValidator.organizationverifyForgotEmailOtpValidation(),
    {},
    {}
  ),
  userAuthController.organizationVerifyForgotPassword
);

router.patch(
  '/reset-password',
  validate(userAuthValidator.organizationResetPasswordValidation(), {}, {}),
  userAuthController.organizationResetPassword
);
router.patch(
  '/set-password',
  validate(userAuthValidator.organizationSetPasswordValidation(), {}, {}),
  userAuthController.organizationSetPassword
);
router.get(
  '/get-profile',
  jwt.verifyAccessToken,
  userAuthController.getUserProfle
);
router.get(
  '/get-profile-patient',
  jwt.verifyAccessToken,
  userAuthController.getUserProflePatient
);

router.get(
  '/get-profile',
  jwt.verifyAccessToken,
  userAuthController.getUserProfle
);

router.post(
  '/edit-organization-profile',
  jwt.verifyAccessToken,
  multerUploads,
  validate(userAuthValidator.editOrganizationProfileValidation(), {}, {}),
  userAuthController.editOrganizationProfile
);

router.get(
  '/get-organization-profile',
  jwt.verifyAccessToken,
  userAuthController.getOrganizationProfle
);

router.put(
  '/add-new-organization-email',
  jwt.verifyAccessToken,
  validate(userAuthValidator.editOrganizationEmailValidation(), {}, {}),
  userAuthController.addnewOrganizationEmail
);

router.put(
  '/verify-new-organization-email',
  jwt.verifyAccessToken,
  validate(userAuthValidator.verifyNewOrganizationEmailValidation(), {}, {}),
  userAuthController.verifyNewOrganizationEmail
);

router.put(
  '/organization-resend-email',
  jwt.verifyAccessToken,
  validate(userAuthValidator.organizationResendEmailValidation(), {}, {}),
  userAuthController.organizationResendOTP
);

router.put(
  '/organization-deactive',
  jwt.verifyAccessToken,
  validate(userAuthValidator.organizationStatusUpdateValidation(), {}, {}),
  userAuthController.updateOrganizationStatus
);
router.put(
  '/organization-change-password',
  jwt.verifyAccessToken,
  validate(userAuthValidator.organizationchangePasswordValidation(), {}, {}),
  userAuthController.organizationChangePassword
);

module.exports = router;
