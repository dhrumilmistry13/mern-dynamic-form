import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { PatientServices } from 'api';

/**
 * Hook for Admin Patient Master section
 */
const onDefaultError = (error) => {
  toast.error(error.message);
};
const useListPatients = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['patients-list', [params]], () => PatientServices.listPatients(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const usePatienStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(PatientServices.updateStatusPatient, {
    onSuccess,
    onError,
  });
};
const useGetOrganisationList = (onSuccess, onError = onDefaultError) => {
  return useQuery('organisations-list', PatientServices.listOrganisation, {
    onSuccess,
    onError,
  });
};
const useUpdatePatientDetails = (onSuccess, onError = onDefaultError) => {
  return useMutation(PatientServices.updatePatientDetails, {
    onSuccess,
    onError,
  });
};
const useViewPatientOrganisationGD = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patient-view', [params]],
    () => PatientServices.viewPatientOrganisationGD(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetBasicDetails = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['basic-question-data', [params]], () => PatientServices.getBasicData(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useGetInsuranceDetails = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['insurance-question-data', [params]],
    () => PatientServices.getInsuranceData(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const usePatientOrders = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['patients-orders', [params]], () => PatientServices.patientOrders(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useGetAllNotes = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['patients-all-notes', [params]], () => PatientServices.patientAllNotes(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useGetOrderDetails = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['patients-all-notes', [params]], () => PatientServices.getOrderDetails(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useGetIntakeResponse = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patient-general-intake', [params]],
    () => PatientServices.getIntakeResponse(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetMedicalResponse = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patient-medical-intake', [params]],
    () => PatientServices.getMedicalResponse(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetOrderTransaction = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patient-order-transaction', [params]],
    () => PatientServices.getOrderTransaction(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetPatientOrderNotes = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patients-order-notes', [params]],
    () => PatientServices.getPatientOrderNotes(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const usePatientAllOrders = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['get-orders', [params]], () => PatientServices.getpatientAllOrders(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useGetGeneralDetails = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patients-general-details', [params]],
    () => PatientServices.getGeneralDetails(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useGetPatientBasicDetails = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['patients-basic-details', [params]],
    () => PatientServices.getBasicDetails(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
export {
  useListPatients,
  usePatienStatusChange,
  useGetOrganisationList,
  useUpdatePatientDetails,
  useViewPatientOrganisationGD,
  useGetBasicDetails,
  useGetInsuranceDetails,
  usePatientOrders,
  useGetAllNotes,
  useGetOrderDetails,
  useGetIntakeResponse,
  useGetMedicalResponse,
  useGetOrderTransaction,
  useGetPatientOrderNotes,
  usePatientAllOrders,
  useGetGeneralDetails,
  useGetPatientBasicDetails,
};
