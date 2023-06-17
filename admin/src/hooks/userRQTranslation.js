import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { TranslationService } from 'api';

/**
 * Hook for Translations
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useAddTranslation = (onSuccess, onError = onDefaultError) => {
  return useMutation(TranslationService.addTranslation, {
    onSuccess,
    onError,
  });
};

const useListTranslation = ([page_no, searchText], onSuccess, onError = onDefaultError) => {
  return useQuery(['translation-list', page_no, searchText], TranslationService.listTranslation, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useSyncTranslation = (onSuccess, onError = onDefaultError) => {
  return useMutation(TranslationService.syncTranslation, {
    onSuccess,
    onError,
  });
};
const useViewTranslation = (translation_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'translation-view',
    () => TranslationService.viewTranslation({ translation_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useUpdateTranslation = (onSuccess, onError = onDefaultError) => {
  return useMutation(TranslationService.updateTranslation, {
    onSuccess,
    onError,
  });
};

const useTranslationDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(TranslationService.deleteTranslation, {
    onSuccess,
    onError,
  });
};
export {
  useAddTranslation,
  useListTranslation,
  useSyncTranslation,
  useUpdateTranslation,
  useViewTranslation,
  useTranslationDelete,
};
