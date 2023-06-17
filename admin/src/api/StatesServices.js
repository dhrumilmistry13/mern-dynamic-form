import client from 'libs/HttpClient';

class StatesServices {
  static listStates(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];
    return client.get(
      `/admin/states/list?page=${page_no}&serach_text=${searchText}&status=${status}`,
      request
    );
  }
  static addStates(request) {
    return client.post(`/admin/states/add`, request);
  }
  static viewStates(params) {
    return client.get(`/admin/states/get`, { params });
  }

  static updateStates(request) {
    return client.post(`/admin/states/edit`, request);
  }
  static updateStatusStates(request) {
    return client.put(`/admin/states/update-status/`, request);
  }
  static deleteState(params) {
    return client.delete(`admin/states/delete`, { params });
  }
}
export { StatesServices };
