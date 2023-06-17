import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { AdminAuthService } from 'api';

/**
 * Hooks for Authentication Process
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useAdminLogin = (onSuccess, onError = onDefaultError) => {
  return useMutation(AdminAuthService.login, {
    onSuccess,
    onError,
  });
};
const useForgotPassword = (onSuccess, onError = onDefaultError) => {
  return useMutation(AdminAuthService.forgotPassword, {
    onSuccess,
    onError,
  });
};

const useOTPVerify = (onSuccess, onError = onDefaultError) => {
  return useMutation(AdminAuthService.otpVerify, {
    onSuccess,
    onError,
  });
};

const useResetPassword = (onSuccess, onError = onDefaultError) => {
  return useMutation(AdminAuthService.resetPassword, {
    onSuccess,
    onError,
  });
};

const useResendOtp = (onSuccess, onError = onDefaultError) => {
  return useMutation(AdminAuthService.resendOtp, {
    onSuccess,
    onError,
  });
};

export { useAdminLogin, useResendOtp, useForgotPassword, useOTPVerify, useResetPassword };
