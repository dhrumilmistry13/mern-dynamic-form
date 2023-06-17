import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { settingData } from 'store/features/settingSlice';
import { SettingsServices } from 'api';

const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Settings sections
 */
const useViewHomeBanner = (onSuccess, onError = onDefaultError) => {
  return useQuery('home_banner', SettingsServices.viewHomeBanner, {
    onSuccess,
    onError,
  });
};
const useUpdateHomeBanner = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateHomeBanner, {
    onSuccess,
    onError,
  });
};
const useViewABoutUs = (onSuccess, onError = onDefaultError) => {
  return useQuery('about_us_data', SettingsServices.viewABoutUs, {
    onSuccess,
    onError,
  });
};
const useUpdateABoutUs = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateABoutUs, {
    onSuccess,
    onError,
  });
};
const useViewHowItWorks = (onSuccess, onError = onDefaultError) => {
  return useQuery('how_it_works_data', SettingsServices.viewHowItWorks, {
    onSuccess,
    onError,
  });
};
const useUpdateHowItWorks = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateHowItWorks, {
    onSuccess,
    onError,
  });
};
const useViewGetInTouch = (onSuccess, onError = onDefaultError) => {
  return useQuery('get_in_touch_data', SettingsServices.viewGetInTouch, {
    onSuccess,
    onError,
  });
};
const useUpdateGetInTouch = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateGetInTouch, {
    onSuccess,
    onError,
  });
};
const useViewOurTeam = (onSuccess, onError = onDefaultError) => {
  return useQuery('our_team', SettingsServices.viewOurTeam, {
    onSuccess,
    onError,
  });
};
const useUpdateOurTeam = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateOurTeam, {
    onSuccess,
    onError,
  });
};
const useGetSettingData = (onSuccess, onError) => {
  const getSettingData = useSelector(settingData);
  return useQuery('setting_data', SettingsServices.getSettingData, {
    onSuccess,
    onError,
    enabled: getSettingData.setting_get,
  });
};
const useGetSettingDataAlways = (onSuccess, onError) => {
  return useQuery('setting_data_all', SettingsServices.getSettingData, {
    onSuccess,
    onError,
  });
};
const useStoreSettingData = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.storeSettingData, {
    onSuccess,
    onError,
  });
};
const useGetSettingSeoData = (onSuccess, onError) => {
  return useQuery('setting_seo_data', SettingsServices.getSettingSeoData, {
    onSuccess,
    onError,
  });
};

const useStoreSettingSeoData = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.storeSettingSeoData, {
    onSuccess,
    onError,
  });
};
const useViewSubscriptionPlan = (onSuccess, onError = onDefaultError) => {
  return useQuery('subscription-plan', SettingsServices.viewSubscriptionPlan, {
    onSuccess,
    onError,
  });
};
const useUpdateSubscriptionPlan = (onSuccess, onError = onDefaultError) => {
  return useMutation(SettingsServices.updateSubscriptionPlan, {
    onSuccess,
    onError,
  });
};
export {
  useViewHomeBanner,
  useUpdateHomeBanner,
  useViewABoutUs,
  useUpdateABoutUs,
  useViewHowItWorks,
  useUpdateHowItWorks,
  useViewGetInTouch,
  useUpdateGetInTouch,
  useGetSettingData,
  useGetSettingDataAlways,
  useStoreSettingData,
  useUpdateOurTeam,
  useViewOurTeam,
  useGetSettingSeoData,
  useStoreSettingSeoData,
  useViewSubscriptionPlan,
  useUpdateSubscriptionPlan,
};
