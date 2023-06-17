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
      `/admin/question/list?page=${page_no}&serach_text=${searchText}&status=${status}&type=${type}&question_type=${question_type}&from_date=${fromDate}&to_date=${toDate}`,
      request
    );
  }
  static addQuestion(request) {
    return client.put(`/admin/question/add`, request);
  }
  static viewQuestion(params) {
    return client.get(`/admin/question/get`, { params });
  }

  static updateQuestion(request) {
    return client.put(`/admin/question/edit`, request);
  }
  static deleteQuestion(params) {
    return client.delete(`/admin/question/delete/question`, { params });
  }

  static updateStatusQuestion(request) {
    return client.put(`/admin/question/update-status/`, request);
  }
}
export { QuestionService };
