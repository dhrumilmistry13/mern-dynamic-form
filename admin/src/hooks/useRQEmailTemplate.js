import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { EmailTemplateService } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hooks for Email Templates
 */
const useListEmailTemplate = ([page_no, searchText], onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['email-template-list', page_no, searchText],
    EmailTemplateService.listEmailTemplate,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useAddEmailTemplate = (onSuccess, onError = onDefaultError) => {
  return useMutation(EmailTemplateService.addEmailTemplate, {
    onSuccess,
    onError,
  });
};
const useViewEmailTemplate = (email_template_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'email-template-view',
    () => EmailTemplateService.viewEmailTemplate({ email_template_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useUpdateEmailTemplate = (onSuccess, onError = onDefaultError) => {
  return useMutation(EmailTemplateService.updateEmailTemplate, {
    onSuccess,
    onError,
  });
};

export { useListEmailTemplate, useAddEmailTemplate, useViewEmailTemplate, useUpdateEmailTemplate };
