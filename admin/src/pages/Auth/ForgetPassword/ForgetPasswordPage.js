import { React, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useForgotPassword } from 'hooks';
import validationSchema from './FogetPasswordValidation';
import { LogoUrl } from 'common/layouts';
import { TNButton } from 'common/components';

const ForgetPasswordPage = (props) => {
  const { t } = props;
  const navigate = useNavigate();

  // Adding class to the body Element
  useEffect(() => {
    document.body.classList.add('bg-box');
  }, []);
  /**
   * This Block is execute on Form Submit when we'll get encrypted email
   * and storing to localstorage as it will use in OTP Verification Page
   */
  const { mutate: doForgotPassword, isLoading } = useForgotPassword((res) => {
    toast.success(res.message);
    localStorage.forgot_token = res.data.reset_token;
    localStorage.isAdmin = true;
    navigate('/otp-verification');
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      doForgotPassword(values);
    },
  });

  return (
    <Container>
      <div className="background-box">
        <div>
          <div className="brand-logo">
            <LogoUrl />
          </div>
          <div>
            <h1 className="page-heading-center">{t('page.forget_password_header_text')}</h1>
            <div className="page-sub-heading">
              <span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t('page.forget_password_sub_header_text'),
                  }}></div>
              </span>
            </div>
          </div>
          <div>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label className="field-label">
                  {t('page.forget_password_email_label')}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.email && formik.errors.email
                      ? 'form-field-error'
                      : formik.touched.email && !formik.errors.email
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="email"
                  placeholder={t('page.forget_password_email_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <div className="form-field-error-text">
                  {formik.touched.email && formik.errors.email ? (
                    <div>{t(formik.errors.email)}</div>
                  ) : null}
                </div>
              </Form.Group>
              <div className="primary-button">
                <Link to="/login" className="link-center">
                  {t('page.forget_password_login_link_text')}
                </Link>
                <TNButton loading={isLoading} type="submit">
                  {t('page.forget_password_submit_button_text')}
                </TNButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};
ForgetPasswordPage.propTypes = {
  t: PropTypes.func,
};
export { ForgetPasswordPage };
