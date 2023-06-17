import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { OrganisationServices } from 'api';

/**
 * Hook for Admin Organisation Master section
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useListOrganisation = (
  [page_no, searchText, user_status, admin_status, profile_status, fromDate, toDate],
  onSuccess,
  onError = onDefaultError
) => {
  return useQuery(
    [
      'organisation-list',
      page_no,
      searchText,
      user_status,
      admin_status,
      profile_status,
      fromDate,
      toDate,
    ],
    OrganisationServices.listOrganisation,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useAddOrganisation = (onSuccess, onError = onDefaultError) => {
  return useMutation(OrganisationServices.addOrganisation, {
    onSuccess,
    onError,
  });
};
const useOrganisationStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(OrganisationServices.updateStatusOrganisation, {
    onSuccess,
    onError,
  });
};

const useUpdateOrganisation = (onSuccess, onError = onDefaultError) => {
  return useMutation(OrganisationServices.updateOrganisation, {
    onSuccess,
    onError,
  });
};
const useViewOrganisation = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery('organisation-view', () => OrganisationServices.viewOrganisation({ user_id }), {
    onSuccess,
    onError,
  });
};

export {
  useListOrganisation,
  useAddOrganisation,
  useOrganisationStatusChange,
  useUpdateOrganisation,
  useViewOrganisation,
};
