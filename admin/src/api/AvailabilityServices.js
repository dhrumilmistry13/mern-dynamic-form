import client from 'libs/HttpClient';

class Availabilities {
  static getAvailabilitiesResponseData(params) {
    return client.get('admin/availability/organization-availability-get', { params });
  }
  static updateAvailabilityData(request) {
    return client.post('admin/availability/organization-availability-save', request);
  }
  static getDateSpecificAvailabilities(params) {
    return client.get('admin/availability/organization-date-specific-availability-get', { params });
  }
  static updateDateSpecificAvailabilityData(request) {
    return client.post('front/availability/organization-date-specific-availability-save', request);
  }
}

export { Availabilities };
