import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { QuestionService } from 'api';
const onDefaultError = (error) => {
  toast.error(error.message);
};
/**
 * Hook for Admin Questions Master section
 */
const useListQuestion = (
  [page_no, searchText, status, type, question_type, fromDate, toDate],
  onSuccess,
  onError = onDefaultError
) => {
  return useQuery(
    ['question-list', page_no, searchText, status, type, question_type, fromDate, toDate],
    QuestionService.listQuestion,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};
const useAddQuestion = (onSuccess, onError = onDefaultError) => {
  return useMutation(QuestionService.addQuestion, {
    onSuccess,
    onError,
  });
};
const useQuestionStatusChange = (onSuccess, onError = onDefaultError) => {
  return useMutation(QuestionService.updateStatusQuestion, {
    onSuccess,
    onError,
  });
};
const useUpdateQuestion = (onSuccess, onError = onDefaultError) => {
  return useMutation(QuestionService.updateQuestion, {
    onSuccess,
    onError,
  });
};
const useViewQuestion = (question_id, onSuccess, onError = onDefaultError) => {
  return useQuery('question-view', () => QuestionService.viewQuestion({ question_id }), {
    onSuccess,
    onError,
  });
};
const useQuestionDelete = (onSuccess, onError = onDefaultError) => {
  return useMutation(QuestionService.deleteQuestion, {
    onSuccess,
    onError,
  });
};
const useGetActiveQuestion = (onSuccess, onError = onDefaultError) => {
  return useQuery(['question-active-list'], QuestionService.getActiveQuestion, {
    onSuccess,
    keepPreviousData: true,
    onError,
  });
};
const useStoreBasicQuestionData = (onSuccess, onError = onDefaultError) => {
  return useMutation(QuestionService.storeQuestionData, {
    onSuccess,
    onError,
  });
};

const useGetFormListData = (
  [page_no, searchText, status, type, question_type, fromDate, toDate],
  onSuccess,
  onError = onDefaultError
) => {
  return useQuery(
    ['form-list', page_no, searchText, status, type, question_type, fromDate, toDate],
    QuestionService.getFormList,
    {
      onSuccess,
      keepPreviousData: true,
      onError,
    }
  );
};

const useViewFormData = (form_id, onSuccess, onError = onDefaultError) => {
  return useQuery('form-view', () => QuestionService.viewFormData({ form_id }), {
    onSuccess,
    onError,
  });
};
export {
  useListQuestion,
  useAddQuestion,
  useQuestionStatusChange,
  useUpdateQuestion,
  useViewQuestion,
  useQuestionDelete,
  useGetActiveQuestion,
  useStoreBasicQuestionData,
  useGetFormListData,
  useViewFormData,
};
