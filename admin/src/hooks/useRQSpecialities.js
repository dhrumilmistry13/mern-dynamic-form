import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { SpecialitiesService } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Organisation Specialities Master section
 */
const useListSpecialities = (
  [page_no, searchText, status],
  onSuccess,
  onError = onDefaultError
) => {
  return useQuery(
    ['specialities-list', page_no, searchText, status],
    SpecialitiesService.listSpecialities,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useAddSpecialities = (onSuccess, onError = onDefaultError) => {
  return useMutation(SpecialitiesService.addSpecialities, {
    onSuccess,
    onError,
  });
};
const useSpecialitiesStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(SpecialitiesService.updateStatusSpecialities, {
    onSuccess,
    onError,
  });
};
const useUpdateSpecialitiesMaster = (onSuccess, onError = onDefaultError) => {
  return useMutation(SpecialitiesService.updateSpecialities, {
    onSuccess,
    onError,
  });
};
const useViewSpecialitiesMaster = (specialities_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'specialities-view',
    () => SpecialitiesService.viewSpecialities({ specialities_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useSpecialitiesDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(SpecialitiesService.deleteSpecialities, {
    onSuccess,
    onError,
  });
};
export {
  useListSpecialities,
  useAddSpecialities,
  useSpecialitiesStatusChange,
  useUpdateSpecialitiesMaster,
  useViewSpecialitiesMaster,
  useSpecialitiesDelete,
};
