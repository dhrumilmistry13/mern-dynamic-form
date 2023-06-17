import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Container, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useAdminLogin, useGetSettingDataAlways } from 'hooks';
import validationSchema from './LoginValidation';
import { LogoUrl } from 'common/layouts';
import { TNButton } from 'common/components';
import { loginSuccess } from 'store/features/authSlice';
import { setAuthToken } from 'libs/HttpClient';
import { addSetting } from 'store/features/settingSlice';
const LoginPage = ({ t }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Show Hide Password
  const [isRevealPwd, setIsRevealPwd] = useState();

  /**
   * This hook will call after user login, and will set setting data in redux store
   */
  useGetSettingDataAlways(({ data: setting }) => {
    const dataStore = {
      dashboard_logo: setting.common_header_logo,
      front_logo: setting.common_login_logo,
      email_logo: setting?.common_email_header_logo,
      favicon_icon: setting?.common_favicon_icon,
      seo_title: setting.seo_title,
      seo_description: setting.seo_description,
      setting_get: true,
    };
    dispatch(addSetting(dataStore));
  });

  /**
   * This Block is execute on Form Submit when we'll get success response,
   * then we are storing data in Redux using Redux Toolkit.
   */
  const { mutate: doLogin, isLoading } = useAdminLogin((res) => {
    const dataStore = {
      userData: res.data.user_data,
      isLoggedIn: true,
      accessToken: res.data.accessToken,
    };
    dispatch(loginSuccess(dataStore));
    setTimeout(function () {
      setAuthToken(res.data.accessToken);
      navigate('/dashboard');
    }, 1500);
    toast.success(res.message);
  });
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doLogin(values);
    },
  });

  return (
    <Container>
      <div className="background-box">
        <div>
          <div className="brand-logo">
            <LogoUrl />
          </div>
          <div className="login-heading">
            <h1 className="page-heading-center">{t('page.login_header_text')}</h1>
          </div>
          <div>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="field-label">{t('page.login_email_label')}</Form.Label>
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
                  placeholder={t('page.login_email_placeholder')}
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

              <div>
                <Form.Label className="field-label field-label-top">
                  {t('page.login_password_label')}
                </Form.Label>
                <InputGroup className="form-group-field">
                  <FormControl
                    className={
                      '' +
                      (formik.touched.password && formik.errors.password
                        ? 'form-field-error'
                        : formik.touched.password && !formik.errors.password
                        ? 'form-field-success'
                        : '')
                    }
                    name="password"
                    placeholder={t('page.login_password_placeholder')}
                    autoComplete="off"
                    type={isRevealPwd ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <InputGroup.Text
                    className={
                      '' +
                      (formik.touched.password && formik.errors.password
                        ? 'form-field-error'
                        : formik.touched.password && !formik.errors.password
                        ? 'form-field-success'
                        : '')
                    }>
                    <FontAwesomeIcon
                      onClick={() => setIsRevealPwd((prevState) => !prevState)}
                      icon={isRevealPwd ? faEye : faEyeSlash}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <div className="form-field-error-text">
                  {formik.touched.password && formik.errors.password ? (
                    <div>{t(formik.errors.password)}</div>
                  ) : null}
                </div>
              </div>
              <div className="link-right">
                <Link to="/forget-password" className="text-black">
                  {t('page.login_forget_link_text')}
                </Link>
              </div>
              <div className="primary-button">
                <TNButton loading={isLoading} type="submit">
                  {t('page.login_submit_button_text')}
                </TNButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};
LoginPage.propTypes = {
  t: PropTypes.func,
};
export { LoginPage };
