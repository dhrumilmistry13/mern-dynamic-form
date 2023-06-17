import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { BookingList } from 'api';

const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hooks for Admin to view and add update Availability
 */

const useOrganizationBookingList = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    [`organization-booking-list`, [params]],
    () => BookingList.organizationBookinglist(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};

const useGetPatientData = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(['patient-list', user_id], () => BookingList.getPatientData({ user_id }), {
    onSuccess,
    onError,
  });
};

const usePatientBookingList = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    [`patient-booking-list`, [params]],
    () => BookingList.patientBookingList(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetOrgTimezoneData = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['get-organization-timezone', user_id],
    () => BookingList.getOrgTimezone({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useGetPatientTimezoneData = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['get-patient-timezone', user_id],
    () => BookingList.getPatientOrgTimezone({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};
export {
  useOrganizationBookingList,
  useGetPatientData,
  usePatientBookingList,
  useGetOrgTimezoneData,
  useGetPatientTimezoneData,
};
