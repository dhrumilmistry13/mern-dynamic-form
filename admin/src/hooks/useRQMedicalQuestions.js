import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { MedicalServices } from 'api';

/**
 * Hook for Medical Questions which comes from formulary, and organisation formulary
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useViewMedicalQuestions = (request, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['medical-questions-list', request.formulary_id, request.user_id],
    MedicalServices.viewMedicalQuestions,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
export { useViewMedicalQuestions };
