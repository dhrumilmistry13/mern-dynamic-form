import client from 'libs/HttpClient';

class CMSService {
  static listCms(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];

    return client.get(
      `admin/cms/list?page=${page_no}&serach_text=${searchText}&is_active=${status}`,
      request
    );
  }
  static addCms(request) {
    return client.put('admin/cms/add', request);
  }
  static updateStatusCms(request) {
    return client.put(`admin/cms/update-status/`, request);
  }
  static updateCms(request) {
    return client.put(`admin/cms/edit/`, request);
  }
  static viewCms(params) {
    return client.get(`admin/cms/get`, { params });
  }
  static deleteCms(params) {
    return client.delete(`/admin/cms/delete/`, { params });
  }
}
export { CMSService };
