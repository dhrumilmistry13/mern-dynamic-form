import client from 'libs/HttpClient';

class TranslationService {
  static addTranslation(request) {
    return client.put('admin/translation/add', request);
  }
  static updateTranslation(request) {
    return client.put(`admin/translation/edit`, request);
  }
  static deleteTranslation(params) {
    return client.delete(`admin/translation/delete/`, { params });
  }
  static listTranslation(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    return client.get(`admin/translation/list?serach_text=${searchText}&page=${page_no}`, request);
  }
  static viewTranslation(params) {
    return client.get(`admin/translation/get`, { params });
  }
  static syncTranslation(request) {
    return client.put(`admin/translation/sync-data`, request);
  }
}
export { TranslationService };
