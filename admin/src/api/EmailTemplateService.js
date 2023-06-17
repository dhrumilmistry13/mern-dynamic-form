import client from 'libs/HttpClient';

class EmailTemplateService {
  static listEmailTemplate(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    return client.get(
      `/admin/email-template/list?serach_text=${searchText}&page=${page_no}`,
      request
    );
  }
  static addEmailTemplate(request) {
    return client.put(`admin/email-template/add`, request);
  }
  static viewEmailTemplate(params) {
    return client.get(`/admin/email-template/get`, {
      params,
    });
  }

  static updateEmailTemplate(request) {
    return client.put(`/admin/email-template/edit`, request);
  }
}
export { EmailTemplateService };
