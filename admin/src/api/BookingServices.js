import client from 'libs/HttpClient';

class BookingList {
  static getTimezoneList(request) {
    return client.get('admin/common/timezone-list', request);
  }
  static getPatientData(params) {
    return client.get('admin/common/patient-list', { params });
  }
  static organizationBookinglist(params) {
    return client.get('admin/organization/organization-booking-list', { params });
  }
  static patientBookingList(params) {
    return client.get('admin/patient/patient-booking-list', { params });
  }
  static getOrgTimezone(params) {
    return client.get('admin/common/get-organization-timezone', { params });
  }
  static getPatientOrgTimezone(params) {
    return client.get('admin/common/get-patient-timezone', { params });
  }
}

export { BookingList };
