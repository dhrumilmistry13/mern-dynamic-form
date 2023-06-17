import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { OrganisationSettingsServices } from 'api';

const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Settings sections
 */

const useViewOrganisationHowItWorks = (onSuccess, onError = onDefaultError) => {
  return useQuery('how_it_works_data', OrganisationSettingsServices.viewHowItWorks, {
    onSuccess,
    onError,
  });
};
const useUpdateOrganisationHowItWorks = (onSuccess, onError = onDefaultError) => {
  return useMutation(OrganisationSettingsServices.updateHowItWorks, {
    onSuccess,
    onError,
  });
};

export { useViewOrganisationHowItWorks, useUpdateOrganisationHowItWorks };
