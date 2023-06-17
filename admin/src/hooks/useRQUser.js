import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { UserService } from 'api';

/**
 * Hook for user Informations after signup
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useGetProfile = (onSuccess, onError = onDefaultError) => {
  return useQuery('get-profile', UserService.getProfile, {
    onSuccess,
    onError,
  });
};

const useGetCountryCodeList = (onSuccess, onError = onDefaultError) => {
  return useQuery('country-code-list', UserService.getCountryCodeList, {
    onSuccess,
    onError,
  });
};

const useGetTimezoneList = (onSuccess, onError = onDefaultError) => {
  return useQuery('timezone-list', UserService.getTimezoneList, {
    onSuccess,
    onError,
  });
};

const useUpdateProfile = (onSuccess, onError = onDefaultError) => {
  return useMutation(UserService.updateProfile, {
    onSuccess,
    onError,
  });
};

const useChangePassword = (onSuccess, onError = onDefaultError) => {
  return useMutation(UserService.updatePassword, {
    onSuccess,
    onError,
  });
};
const useUpdateEmail = (onSuccess, onError = onDefaultError) => {
  return useMutation(UserService.updateEmail, {
    onSuccess,
    onError,
  });
};
const useUpdateEmailVerify = (onSuccess, onError = onDefaultError) => {
  return useMutation(UserService.updateEmailVerify, {
    onSuccess,
    onError,
  });
};

const useResendEamilOtp = (onSuccess, onError = onDefaultError) => {
  return useMutation(UserService.resendOtp, {
    onSuccess,
    onError,
  });
};

export {
  useGetProfile,
  useUpdateEmail,
  useUpdateProfile,
  useChangePassword,
  useGetCountryCodeList,
  useGetTimezoneList,
  useUpdateEmailVerify,
  useResendEamilOtp,
};
