import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { FormularyService } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hooks for Formulary Data
 */
const useListFormulary = ([page_no, searchText, status], onSuccess, onError = onDefaultError) => {
  return useQuery(['formulary-list', page_no, searchText, status], FormularyService.listFormulary, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useAddFormulary = (onSuccess, onError = onDefaultError) => {
  return useMutation(FormularyService.addFormulary, {
    onSuccess,
    onError,
  });
};
const useFormularyStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(FormularyService.updateStatusFormulary, {
    onSuccess,
    onError,
  });
};
const useUpdateFormulary = (onSuccess, onError = onDefaultError) => {
  return useMutation(FormularyService.updateFormulary, {
    onSuccess,
    onError,
  });
};
const useViewFormulary = (formulary_id, onSuccess, onError = onDefaultError) => {
  return useQuery('formulary-view', () => FormularyService.viewFormulary({ formulary_id }), {
    onSuccess,
    onError,
  });
};
const useDeleteFormularyImage = (onSuccess, onError = onDefaultError) => {
  return useMutation(FormularyService.deleteFormularyImage, {
    onSuccess,
    onError,
  });
};
const useFormularyDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(FormularyService.deleteFormulary, {
    onSuccess,
    onError,
  });
};
export {
  useListFormulary,
  useAddFormulary,
  useFormularyStatusChange,
  useUpdateFormulary,
  useViewFormulary,
  useDeleteFormularyImage,
  useFormularyDelete,
};
