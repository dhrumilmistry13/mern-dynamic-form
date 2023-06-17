import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { OurTeamService } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Our team Master section
 */
const useListOurTeam = ([page_no, searchText, status], onSuccess, onError = onDefaultError) => {
  return useQuery(['our-team-list', page_no, searchText, status], OurTeamService.listOurTeam, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useAddOurTeam = (onSuccess, onError = onDefaultError) => {
  return useMutation(OurTeamService.addOurTeam, {
    onSuccess,
    onError,
  });
};
const useOurTeamStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(OurTeamService.updateStatusOurTeam, {
    onSuccess,
    onError,
  });
};
const useUpdateOurTeamMaster = (onSuccess, onError = onDefaultError) => {
  return useMutation(OurTeamService.updateOurTeam, {
    onSuccess,
    onError,
  });
};
const useViewOurTeamMaster = (our_team_id, onSuccess, onError = onDefaultError) => {
  return useQuery('our-team-view', () => OurTeamService.viewOurTeam({ our_team_id }), {
    onSuccess,
    onError,
  });
};
const useOurTeamDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(OurTeamService.deleteOurTeam, {
    onSuccess,
    onError,
  });
};
export {
  useListOurTeam,
  useAddOurTeam,
  useOurTeamStatusChange,
  useUpdateOurTeamMaster,
  useViewOurTeamMaster,
  useOurTeamDelete,
};
