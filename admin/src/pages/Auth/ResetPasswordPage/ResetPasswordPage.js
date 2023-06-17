import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Container, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useResetPassword } from 'hooks';
import validationSchema from './ResetPasswordValidation';
import { LogoUrl } from 'common/layouts';
import { TNButton } from 'common/components';

const ResetPasswordPage = ({ t }) => {
  const navigate = useNavigate();

  /**
   * This block will execute when user click on Reset Password API call.
   * If success then we are moving to Login Page
   */
  const { mutate: doResetPassword, isLoading } = useResetPassword((res) => {
    toast.success(res.message);
    localStorage.reset_password = true;
    localStorage.removeItem('verify_otp_token');
    localStorage.removeItem('reset_password');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  });
  // Show Hide Password toggle
  const [isRevealPwd, setIsRevealPwd] = useState();
  const [isCnfRevealPwd, setCnfIsRevealPwd] = useState();

  /**
   * This block will check if user has verify token or not, if not then navigating them to login page
   */
  useEffect(() => {
    document.body.classList.add('bg-box');
    if (
      localStorage.isAdmin === undefined ||
      localStorage.isAdmin === '' ||
      localStorage.verify_otp_token === undefined ||
      localStorage.verify_otp_token === ''
    ) {
      navigate('/login');
    }
  });
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      new_password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      values.reset_token = localStorage.verify_otp_token;
      doResetPassword(values);
    },
  });

  return (
    <Container>
      <div className="background-box">
        <div className="admin-login">
          <div className="brand-logo">
            <LogoUrl />
          </div>
          <div>
            <h1 className="page-heading-center">{t('page.reset_password_heade_text')}</h1>
          </div>
          <div>
            <Form onSubmit={formik.handleSubmit}>
              <div>
                <Form.Label className="field-label field-label-top">
                  {t('page.reset_password_password_label')}
                </Form.Label>
                <InputGroup className="form-group-field">
                  <FormControl
                    className={
                      'form-field' +
                      (formik.touched.new_password && formik.errors.new_password
                        ? 'form-field-error'
                        : formik.touched.new_password && !formik.errors.new_password
                        ? 'form-field-success'
                        : '')
                    }
                    name="new_password"
                    placeholder={t('page.reset_password_password_placeholder')}
                    autoComplete="off"
                    type={isRevealPwd ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.new_password}
                  />
                  <InputGroup.Text
                    className={
                      'form-field' +
                      (formik.touched.new_password && formik.errors.new_password
                        ? 'form-field-error'
                        : formik.touched.new_password && !formik.errors.new_password
                        ? 'form-field-success'
                        : '')
                    }
                    id="basic-addon1">
                    <FontAwesomeIcon
                      onClick={() => setIsRevealPwd((prevState) => !prevState)}
                      icon={isRevealPwd ? faEye : faEyeSlash}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <div className="form-field-error-text">
                  {formik.touched.new_password && formik.errors.new_password ? (
                    <div>{t(formik.errors.new_password)}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <Form.Label className="field-label field-label-top">
                  {t('page.reset_password_confirm_password_label')}
                </Form.Label>
                <InputGroup className="form-group-field">
                  <FormControl
                    className={
                      'form-field' +
                      (formik.touched.confirm_password && formik.errors.confirm_password
                        ? 'form-field-error'
                        : formik.touched.confirm_password && !formik.errors.confirm_password
                        ? 'form-field-success'
                        : '')
                    }
                    name="confirm_password"
                    placeholder={t('page.reset_password_confirm_password_placeholder')}
                    autoComplete="off"
                    type={isCnfRevealPwd ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirm_password}
                  />
                  <InputGroup.Text
                    className={
                      'form-field' +
                      (formik.touched.confirm_password && formik.errors.confirm_password
                        ? 'form-field-error'
                        : formik.touched.confirm_password && !formik.errors.confirm_password
                        ? 'form-field-success'
                        : '')
                    }>
                    <FontAwesomeIcon
                      onClick={() => setCnfIsRevealPwd((prevState) => !prevState)}
                      icon={isCnfRevealPwd ? faEye : faEyeSlash}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <div className="form-field-error-text">
                  {formik.touched.confirm_password && formik.errors.confirm_password ? (
                    <div>{t(formik.errors.confirm_password)}</div>
                  ) : null}
                </div>
              </div>

              <div className="primary-button">
                <Link to="/login" className="link-center">
                  {t('page.reset_password_cancel_button_text')}
                </Link>
                <TNButton type="submit" loading={isLoading}>
                  {t('page.reset_password_submit_button_text')}
                </TNButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};
ResetPasswordPage.propTypes = {
  t: PropTypes.func,
};
export { ResetPasswordPage };
