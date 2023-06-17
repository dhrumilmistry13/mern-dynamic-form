import client from 'libs/HttpClient';

class SpecialitiesService {
  static listSpecialities(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];
    return client.get(
      `/admin/specialities/list?page=${page_no}&serach_text=${searchText}&status=${status}`,
      request
    );
  }
  static addSpecialities(request) {
    return client.post(`/admin/specialities/add`, request);
  }
  static viewSpecialities(params) {
    return client.get(`/admin/specialities/get`, { params });
  }

  static updateSpecialities(request) {
    return client.post(`/admin/specialities/edit`, request);
  }
  static updateStatusSpecialities(request) {
    return client.put(`/admin/specialities/update-status/`, request);
  }
  static deleteSpecialities(params) {
    return client.delete(`/admin/specialities/delete/`, { params });
  }
}
export { SpecialitiesService };
