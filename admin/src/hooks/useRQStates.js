import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { StatesServices } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Organisation States Master section
 */
const useListStates = ([page_no, searchText, status], onSuccess, onError = onDefaultError) => {
  return useQuery(['states-list', page_no, searchText, status], StatesServices.listStates, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useAddStates = (onSuccess, onError = onDefaultError) => {
  return useMutation(StatesServices.addStates, {
    onSuccess,
    onError,
  });
};
const useStatesStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(StatesServices.updateStatusStates, {
    onSuccess,
    onError,
  });
};
const useUpdateStatesMaster = (onSuccess, onError = onDefaultError) => {
  return useMutation(StatesServices.updateStates, {
    onSuccess,
    onError,
  });
};
const useViewStatesMaster = (state_id, onSuccess, onError = onDefaultError) => {
  return useQuery('states-view', () => StatesServices.viewStates({ state_id }), {
    onSuccess,
    onError,
  });
};
const useStatesDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(StatesServices.deleteState, {
    onSuccess,
    onError,
  });
};
export {
  useListStates,
  useAddStates,
  useStatesStatusChange,
  useUpdateStatesMaster,
  useViewStatesMaster,
  useStatesDelete,
};
