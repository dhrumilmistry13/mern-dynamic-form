import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { CMSService } from 'api';

/**
 * Hooks for CMS pages
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useListCms = ([page_no, searchText, status], onSuccess, onError = onDefaultError) => {
  return useQuery(['cms-list', page_no, searchText, status], CMSService.listCms, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useAddCms = (onSuccess, onError = onDefaultError) => {
  return useMutation(CMSService.addCms, {
    onSuccess,
    onError,
  });
};
const useCmsStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(CMSService.updateStatusCms, {
    onSuccess,
    onError,
  });
};

const useUpdateCms = (onSuccess, onError = onDefaultError) => {
  return useMutation(CMSService.updateCms, {
    onSuccess,
    onError,
  });
};
const useViewCms = (cms_id, onSuccess, onError = onDefaultError) => {
  return useQuery('cms-view', () => CMSService.viewCms({ cms_id }), {
    onSuccess,
    onError,
  });
};
const useCmsDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(CMSService.deleteCms, {
    onSuccess,
    onError,
  });
};
export { useListCms, useAddCms, useCmsStatusChange, useUpdateCms, useViewCms, useCmsDelete };
