import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { Availabilities } from 'api';

const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hooks for Admin to view and add update Availability
 */

const useGetAvailabilities = (onSuccess, onError = onDefaultError) => {
  return useMutation(Availabilities.getAvailabilitiesResponseData, {
    onSuccess,
    onError,
  });
};
const useUpdateAvailability = (onSuccess, onError = onDefaultError) => {
  return useMutation(Availabilities.updateAvailabilityData, {
    onSuccess,
    onError,
  });
};

const useGetDateSpecificAvailabilities = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    [`availability-date-specific-view`, [params]],
    () => Availabilities.getDateSpecificAvailabilities(params),
    {
      onSuccess,
      onError,
    }
  );
};
const useUpdateDateSpecificAvailability = (onSuccess, onError = onDefaultError) => {
  return useMutation(Availabilities.updateDateSpecificAvailabilityData, {
    onSuccess,
    onError,
  });
};
export {
  useGetAvailabilities,
  useUpdateAvailability,
  useGetDateSpecificAvailabilities,
  useUpdateDateSpecificAvailability,
};
