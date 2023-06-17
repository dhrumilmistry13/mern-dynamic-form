import client from 'libs/HttpClient';

class UserService {
  static getProfile(request) {
    return client.get('admin/user/get-profile', request);
  }
  static updatePassword(request) {
    return client.put('admin/user/change-password', request);
  }
  static updateEmail(request) {
    return client.put('admin/user/add-new-email', request);
  }
  static updateEmailVerify(request) {
    return client.put('admin/user/verify-new-email', request);
  }
  static resendOtp(request) {
    return client.put('admin/user/verify-resend-email', request);
  }
  static updateProfile(request) {
    return client.post('admin/user/edit-profile', request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static updateProfileImage(request) {
    return client.post('admin/user/upload-image', request);
  }
  static getCountryCodeList(request) {
    return client.get('admin/common/country-code-list', request);
  }
  static getTimezoneList(request) {
    return client.get('admin/common/timezone-list', request);
  }
}

export { UserService };
