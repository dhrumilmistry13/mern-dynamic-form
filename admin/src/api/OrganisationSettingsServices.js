import client from 'libs/HttpClient';

class OrganisationSettingsServices {
  static viewHowItWorks(request) {
    return client.get(`/admin/settings/get-home-organization-how-its-work`, request);
  }

  static updateHowItWorks(request) {
    return client.post(`/admin/settings/home-organization-how-its-work`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
}
export { OrganisationSettingsServices };
