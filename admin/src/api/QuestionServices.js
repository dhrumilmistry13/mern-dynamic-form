import client from 'libs/HttpClient';

class QuestionService {
  static listQuestion(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];
    const type = request.queryKey[4];
    const question_type = request.queryKey[5];
    const fromDate = request.queryKey[6];
    const toDate = request.queryKey[7];
    return client.get(
      `/question?page=${page_no}&serach_text=${searchText}&status=${status}&type=${type}&question_type=${question_type}&from_date=${fromDate}&to_date=${toDate}`,
      request
    );
  }
  static addQuestion(request) {
    return client.post(`/question`, request);
  }
  static viewQuestion(params) {
    console.log(params.question_id);
    return client.get(`/question/${params.question_id}`);
  }

  static updateQuestion(request) {
    return client.put(`/question/${request.question_id}`, request);
  }
  static deleteQuestion(params) {
    return client.delete(`/question/${params.question_id}`);
  }

  static updateStatusQuestion(request) {
    return client.post(`/question/update-status/${request.question_id}`, {
      status: request.status,
    });
  }

  static getActiveQuestion() {
    return client.get(`/question/active`);
  }
  static storeQuestionData(request) {
    return client.post(`/question-form/submit-question`, request);
  }
  static getFormList() {
    return client.get(`/question-form`);
  }

  static viewFormData(params) {
    console.log(params.form_id);
    return client.get(`/question-form/${params.form_id}`);
  }
}
export { QuestionService };
