import client from 'libs/HttpClient';

class FormularyService {
  static listFormulary(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];

    return client.get(
      `admin/formulary/list?page=${page_no}&serach_text=${searchText}&status=${status}`,
      request
    );
  }
  static addFormulary(request) {
    return client.post(`/admin/formulary/add`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static updateFormulary(request) {
    return client.post(`/admin/formulary/edit/`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static updateStatusFormulary(request) {
    return client.put(`/admin/formulary/update-status/`, request);
  }
  static viewFormulary(params) {
    return client.get(`admin/formulary/get`, { params });
  }

  static deleteFormularyImage(params) {
    return client.delete(`/admin/formulary/delete/`, { params });
  }
  static deleteFormulary(params) {
    return client.delete(`admin/formulary/delete/formulary`, { params });
  }
}
export { FormularyService };
