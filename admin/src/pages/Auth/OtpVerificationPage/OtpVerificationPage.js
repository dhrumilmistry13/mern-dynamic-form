import { React, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useResendOtp, useOTPVerify } from 'hooks';
import validationSchema from './OtpVerificationValidation';
import { LogoUrl } from 'common/layouts';
import { TNButton } from 'common/components';
import { showLoader, hideLoader } from 'store/features/loaderSlice';

const OtpVerificationPage = ({ t }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /**
   * If localstorage does not have forgot token then we are sending them to Login Page from here on load.
   */
  useEffect(() => {
    document.body.classList.add('bg-box');
    if (
      localStorage.isAdmin === undefined ||
      localStorage.isAdmin === '' ||
      localStorage.forgot_token === undefined ||
      localStorage.forgot_token === ''
    ) {
      navigate('/login');
    }
  });
  /**
   *  This Block will execute on Click of Resend Link
   */
  const { mutate: doResendOtp } = useResendOtp(
    (res) => {
      dispatch(hideLoader());
      toast.success(res.message);
    },
    () => {
      dispatch(hideLoader());
    }
  );

  /**
   * This Block will execute on Verify OTP. On success we'll get token
   * and that token will be used on Reset Password Page
   */
  const { mutate: doOtpVerify, isLoading: isLoadingOtpVerify } = useOTPVerify((res) => {
    toast.success(res.message);
    localStorage.verify_otp_token = res.data.reset_token;
    localStorage.removeItem('forgot_token');
    navigate('/reset-password');
  });

  /**
   * This function will call when user clicks on resend Button link.
   */
  const handleResend = () => {
    const values = {};
    values.encoded_token = localStorage.forgot_token;
    dispatch(showLoader());
    doResendOtp(values);
  };
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      verification_otp: '',
    },
    validationSchema,
    onSubmit: (values) => {
      values.encoded_token = localStorage.forgot_token;
      doOtpVerify(values);
    },
  });
  return (
    <Container>
      <div className="background-box">
        <div>
          <div className="brand-logo">
            <LogoUrl />
          </div>
          <div className="admin-heading">
            <h1 className="page-heading-center">{t('page.otpverification_header_text')}</h1>
            <div className="page-sub-heading">
              <span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t('page.otpverification_sub_header_text'),
                  }}></div>
              </span>
            </div>
          </div>

          <div>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label className="field-label">
                  {t('page.otpverification_otp_label')}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.verification_otp && formik.errors.verification_otp
                      ? 'form-field-error'
                      : formik.touched.verification_otp && !formik.errors.verification_otp
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="verification_otp"
                  maxLength="6"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  placeholder={t('page.otpverification_otp_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.verification_otp}
                />
                {formik.touched.verification_otp && formik.errors.verification_otp ? (
                  <div className="form-field-error-text">{t(formik.errors.verification_otp)}</div>
                ) : null}
              </Form.Group>
              <div className="link-right">
                <span style={{ color: '#424242', fontWeight: '500' }}>
                  {t('page.otpverification_resend_link_header_text')}
                </span>
                <span className="resend-otp" onClick={handleResend}>
                  {t('page.otpverification_resend_link_text')}
                </span>
              </div>
              <div className="primary-button">
                <Link to="/login" className="link-center">
                  {t('page.otp_login_link_text')}
                </Link>
                <TNButton loading={isLoadingOtpVerify} type="submit">
                  {t('page.otpverification_submit_button_text')}
                </TNButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};
OtpVerificationPage.propTypes = {
  t: PropTypes.func,
};
export { OtpVerificationPage };
