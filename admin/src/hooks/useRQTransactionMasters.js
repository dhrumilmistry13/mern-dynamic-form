import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { TransactionsServices } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Organisation Transactions Master section
 */
const useListTransactions = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(
    ['trasnaction-list', [params]],
    () => TransactionsServices.listTransactions(params),
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useListOrders = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['trasnaction-list', [params]], () => TransactionsServices.listOrders(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useListRefundOrders = (params, onSuccess, onError = onDefaultError) => {
  return useQuery(['refund-list', [params]], () => TransactionsServices.listRefundOrders(params), {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useOrdersStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(TransactionsServices.updateStatusOrders, {
    onSuccess,
    onError,
  });
};
const useGetOrganisationList = (onSuccess, onError = onDefaultError) => {
  return useQuery('states-view', TransactionsServices.listOrganisation, {
    onSuccess,
    onError,
  });
};
const userGetPatientsList = (onSuccess, onError = onDefaultError) => {
  return useQuery('patient-list', TransactionsServices.listpatient, {
    onSuccess,
    onError,
  });
};
const useGetOrganisationRefundList = (onSuccess, onError = onDefaultError) => {
  return useQuery('org-refund-view', TransactionsServices.listOrganisationRefund, {
    onSuccess,
    onError,
  });
};
const userGetPatientsRefundList = (onSuccess, onError = onDefaultError) => {
  return useQuery('patient-refund-list', TransactionsServices.listPatientRefund, {
    onSuccess,
    onError,
  });
};
const userGetOrderItemRefundList = (onSuccess, onError = onDefaultError) => {
  return useQuery('order-item-refund-list', TransactionsServices.listOrderItemRefund, {
    onSuccess,
    onError,
  });
};
export {
  useListTransactions,
  useListOrders,
  useListRefundOrders,
  useOrdersStatusChange,
  useGetOrganisationList,
  userGetPatientsList,
  useGetOrganisationRefundList,
  userGetPatientsRefundList,
  userGetOrderItemRefundList,
};
