import client from 'libs/HttpClient';

class OurTeamService {
  static listOurTeam(request) {
    const page_no = request.queryKey[1];
    const searchText = request.queryKey[2];
    const status = request.queryKey[3];
    return client.get(
      `/admin/our-team/list?page=${page_no}&serach_text=${searchText}&is_active=${status}`,
      request
    );
  }
  static addOurTeam(request) {
    return client.post(`/admin/our-team/add`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static viewOurTeam(params) {
    return client.get(`/admin/our-team/get`, { params });
  }

  static updateOurTeam(request) {
    return client.post(`/admin/our-team/edit`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static deleteOurTeam(params) {
    return client.delete(`/admin/our-team/delete/`, { params });
  }

  static updateStatusOurTeam(request) {
    return client.put(`/admin/our-team/update-status`, request);
  }
}
export { OurTeamService };
