import client from 'libs/HttpClient';

class PatientServices {
  static listPatients(params) {
    return client.get(`admin/patient/list`, { params });
  }
  static updateStatusPatient(request) {
    return client.put(`admin/patient/update-status/`, request);
  }
  static listOrganisation() {
    return client.get('admin/patient/organisations');
  }
  static updatePatientDetails(request) {
    return client.put(`admin/patient/edit-patient-general-details`, request);
  }
  static viewPatientOrganisationGD(params) {
    return client.get(`admin/patient/general-patient-details/`, { params });
  }
  static getBasicData(params) {
    return client.get('admin/patient/get-patient-basic-details', { params });
  }
  static getInsuranceData(params) {
    return client.get('admin/patient/get-patient-insurance-details', { params });
  }
  static patientOrders(params) {
    return client.get(`admin/patient/get-patient-order-list`, { params });
  }
  static patientAllNotes(params) {
    return client.get(`admin/patient/get-all-notes`, { params });
  }
  static getOrderDetails(params) {
    return client.get(`admin/patient/get-patient-order-details`, { params });
  }
  static getIntakeResponse(params) {
    return client.get(`admin/patient/get-patient-general-intake`, { params });
  }
  static getMedicalResponse(params) {
    return client.get(`admin/patient/get-patient-medical-intake`, { params });
  }
  static getOrderTransaction(params) {
    return client.get(`admin/patient/get-patient-order-transaction`, { params });
  }
  static getPatientOrderNotes(params) {
    return client.get(`admin/patient/get-patient-order-notes`, { params });
  }
  static getpatientAllOrders(params) {
    return client.get('admin/patient/get-orders', { params });
  }
  static getGeneralDetails(params) {
    return client.get(`admin/patient/get-general-details`, { params });
  }
  static getBasicDetails(params) {
    return client.get(`admin/patient/get-patient-details`, { params });
  }
}
export { PatientServices };
