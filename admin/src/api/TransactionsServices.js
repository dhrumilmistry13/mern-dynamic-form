import client from 'libs/HttpClient';

class TransactionsServices {
  static listTransactions(params) {
    return client.get(`admin/transaction/subscription-transaction-list`, { params });
  }
  static listOrders(params) {
    return client.get(`admin/transaction/order-transaction-list`, { params });
  }
  static listRefundOrders(params) {
    return client.get(`admin/transaction/order-refund-list`, { params });
  }
  static updateStatusOrders(request) {
    console.log(request);
    return client.put(`admin/transaction/store-note/`, request);
  }
  static listOrganisation() {
    return client.get('admin/transaction/organization-list');
  }
  static listpatient() {
    return client.get('/admin/transaction/patient-list');
  }
  static listOrganisationRefund() {
    return client.get('admin/transaction/organization-refund-list');
  }
  static listPatientRefund() {
    return client.get('/admin/transaction/patient-refund-list');
  }
  static listOrderItemRefund() {
    return client.get('/admin/transaction/order-refund-item-list');
  }
}
export { TransactionsServices };
