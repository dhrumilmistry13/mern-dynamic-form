import client from 'libs/HttpClient';

class FormService {
  static listQuestion(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    return client.get(`/question-form?page=${page_no}&serach_text=${searchText}`, request);
  }
  static viewQuestion(params) {
    console.log(params.question_id);
    return client.get(`/question-form/${params.question_id}`);
  }

  static deleteQuestion(params) {
    return client.delete(`/question-form/${params.question_id}`);
  }
}
export { FormService };
