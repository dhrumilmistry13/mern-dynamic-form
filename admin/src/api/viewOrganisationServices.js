import client from 'libs/HttpClient';

class viewOrganisationServices {
  //   Business Details
  static viewBusinessDetail(params) {
    return client.get(`admin/question/organization-business-question-detail`, { params });
  }
  // Practice Question
  static viewPracticeQuestion(params) {
    return client.get(`admin/organization/organization-practice-data`, { params });
  }
  // Brand Color
  static viewBrandColor(params) {
    return client.get(`admin/organization/organization-brand-color-data`, { params });
  }
  static viewIntakeQuestions(params) {
    return client.get(`admin/question/organization-intake-question-detail`, { params });
  }
  static viewOrganisationFormulary(request) {
    let user_id = request.queryKey[1];
    let currentPage = request.queryKey[2];
    return client.get(
      `admin/formulary/get-organization-formulary-data?user_id=${user_id}&page=${currentPage}`
    );
  }
  static subscriptionData(params) {
    return client.get(`admin/organization/organization-subscription-data`, { params });
  }
  static subscriptionStore(request) {
    return client.put('admin/organization/organization-subscription-store', request);
  }
  static subscriptionCancel(request) {
    return client.put('admin/organization/organization-subscription-cancel', request);
  }
}
export { viewOrganisationServices };
