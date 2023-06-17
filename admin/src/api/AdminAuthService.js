import client from 'libs/HttpClient';

class AdminAuthService {
  static login(loginData) {
    return client.post('admin/auth/login', loginData);
  }
  static forgotPassword(request) {
    return client.put('admin/auth/forgot-password', request);
  }
  static resendOtp(request) {
    return client.put('admin/auth/forgot-password/resend-otp', request);
  }
  static otpVerify(request) {
    return client.put('admin/auth/verify-forgot-otp', request);
  }
  static resetPassword(request) {
    return client.patch('admin/auth/reset-password', request);
  }
}

export { AdminAuthService };
