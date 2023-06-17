const express = require('express');
const { validate } = require('express-validation');
const { multerUploads } = require('../../helpers/s3file.helper');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();

const patientAuthController = require('../../controllers/frontend/patient/frontend.patient.controller');
const patientAuthValidator = require('../../controllers/frontend/patient/frontend.patient.validation');

router.put(
  '/register',
  validate(patientAuthValidator.patientSignupValidation(), {}, {}),
  patientAuthController.patientSignup
);

router.put(
  '/verify-otp',
  validate(patientAuthValidator.verifyPatientOtpValidation(), {}, {}),
  patientAuthController.verifyPatientEmailOtp
);

router.put(
  '/patient-resend-otp',
  validate(patientAuthValidator.patientResendOTPValidation(), {}, {}),
  patientAuthController.patientResendOTP
);

router.put(
  '/forgot-password',
  validate(patientAuthValidator.patientForgotPasswordValidation(), {}, {}),
  patientAuthController.patientForgotPassword
);

router.put(
  '/forgot-password/resend-otp',
  validate(patientAuthValidator.patientResendOTPValidation(), {}, {}),
  patientAuthController.patientForgotresendOTP
);

router.put(
  '/verify-forgot-otp',
  validate(
    patientAuthValidator.patientverifyForgotEmailOtpValidation(),
    {},
    {}
  ),
  patientAuthController.patientVerifyForgotPassword
);

router.put(
  '/reset-password',
  validate(patientAuthValidator.patientResetPasswordValidation(), {}, {}),
  patientAuthController.patientResetPassword
);

router.put(
  '/login',
  validate(patientAuthValidator.patientLoginValidation(), {}, {}),
  patientAuthController.patientLogin
);

router.post(
  '/edit-patient-profile',
  jwt.verifyAccessToken,
  multerUploads,
  validate(patientAuthValidator.editPatientProfileValidation(), {}, {}),
  patientAuthController.editPatientProfile
);

router.put(
  '/add-new-patient-email',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.editPatientEmailValidation(), {}, {}),
  patientAuthController.addnewPatientEmail
);

router.put(
  '/verify-new-patient-email',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.verifyNewPatientEmailValidation(), {}, {}),
  patientAuthController.verifyNewPatientEmail
);

router.put(
  '/patient-new-email-resend-otp',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.NewPatientEmailResendOTPValidation(), {}, {}),
  patientAuthController.NewPatientEmailResendOTP
);

router.put(
  '/patient-change-password',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.patientChangePasswordValidation(), {}, {}),
  patientAuthController.patientChangePassword
);

router.put(
  '/store-patient-general-details',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.patientStoreGeneralDetailsValidation(), {}, {}),
  patientAuthController.patientGeneralDetailsStore
);

router.get(
  '/get-patient-general-details',
  jwt.verifyAccessToken,
  patientAuthController.getPatientGeneralDetails
);

router.get(
  '/get-patient-insurance-details',
  jwt.verifyAccessToken,
  patientAuthController.getPatientInsuranceDetails
);

router.put(
  '/store-patient-insurance-details',
  jwt.verifyAccessToken,
  validate(
    patientAuthValidator.patientStoreInsuranceDetailsValidation(),
    {},
    {}
  ),
  patientAuthController.storePatientInsuranceDetails
);
router.delete(
  '/delete-patient-insurance-details',
  jwt.verifyAccessToken,
  patientAuthController.deletePatientInsuranceDetails
);
router.put(
  '/how-its-work-step',
  jwt.verifyAccessToken,
  patientAuthController.patientHowItWorkStore
);

router.put(
  '/patient-deactive',
  jwt.verifyAccessToken,
  validate(patientAuthValidator.patientStatusUpdateValidation(), {}, {}),
  patientAuthController.updatePatientStatus
);

module.exports = router;
