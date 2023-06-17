import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { viewOrganisationServices } from 'api';

const onDefaultError = (error) => {
  toast.error(error.message);
};

/**
 * Hook for Admin Organisation View Details Data
 */

const useViewBusinessDetail = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'business-question-view',
    () => viewOrganisationServices.viewBusinessDetail({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};

const useViewPracticeQuestion = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'practice-question-view',
    () => viewOrganisationServices.viewPracticeQuestion({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useViewBrandColor = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery('brand-color-view', () => viewOrganisationServices.viewBrandColor({ user_id }), {
    onSuccess,
    onError,
  });
};
const useViewIntakeQuestions = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    'intake-questions-view',
    () => viewOrganisationServices.viewIntakeQuestions({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useViewOrganisationFormulary = (
  [user_id, currentPage],
  onSuccess,
  onError = onDefaultError
) => {
  return useQuery(
    ['formulary-view', user_id, currentPage],
    viewOrganisationServices.viewOrganisationFormulary,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useSubscriptionOrganisationData = (user_id, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['formulary-view', user_id],
    () => viewOrganisationServices.subscriptionData({ user_id }),
    {
      onSuccess,
      onError,
    }
  );
};
const useSubscriptionOrganisationStore = (onSuccess, onError = onDefaultError) => {
  return useMutation(viewOrganisationServices.subscriptionStore, { onSuccess, onError });
};
const useCancelOrganizationSubscriptionData = (onSuccess, onError = onDefaultError) => {
  return useMutation(viewOrganisationServices.subscriptionCancel, { onSuccess, onError });
};
export {
  useViewBusinessDetail,
  useViewPracticeQuestion,
  useViewBrandColor,
  useViewOrganisationFormulary,
  useViewIntakeQuestions,
  useSubscriptionOrganisationData,
  useSubscriptionOrganisationStore,
  useCancelOrganizationSubscriptionData,
};
