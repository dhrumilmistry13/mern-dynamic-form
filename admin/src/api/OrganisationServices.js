import client from 'libs/HttpClient';

class OrganisationServices {
  static listOrganisation(request) {
    const page_no = request.queryKey[1];
    const searchText = encodeURIComponent(request.queryKey[2]);
    const user_status = request.queryKey[3];
    const admin_status = request.queryKey[4];
    const profile_status = request.queryKey[5];
    const fromDate = request.queryKey[6];
    const toDate = request.queryKey[7];

    return client.get(
      `admin/organization/list?page=${page_no}&serach_text=${searchText}&user_status=${user_status}&admin_status=${admin_status}&profile_status=${profile_status}&from_date=${fromDate}&to_date=${toDate}`,
      request
    );
  }
  static addOrganisation(request) {
    return client.put('admin/organization/add', request);
  }
  static updateStatusOrganisation(request) {
    return client.put(`admin/organization/update-status`, request);
  }
  static updateOrganisation(request) {
    return client.put(`admin/organization/edit/`, request);
  }
  static viewOrganisation({ user_id }) {
    return client.get(`admin/organization/get/${user_id}`);
  }
}
export { OrganisationServices };
