import client from 'libs/HttpClient';

class MedicalServices {
  static viewMedicalQuestions(request) {
    let formulary_id = request.queryKey[1];
    let user_id = request.queryKey[2];
    return client.get(
      `admin/formulary/get-formulary-question?&user_id=${user_id}&formulary_id=${formulary_id}`
    );
  }
}
export { MedicalServices };
