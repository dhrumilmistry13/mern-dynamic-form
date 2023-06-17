import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Nav, Card, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import 'assets/scss/page/_changepassword.scss';
import validationSchema from './ChangePasswordValidation';
import { useChangePassword } from 'hooks';
import { TNButton } from 'common/components/TNButton';
const ChangePasswordPage = ({ t }) => {
  // Show Hide Password
  const [isRevealPwd, setIsRevealPwd] = useState();
  const [isRevealOldPwd, setIsRevealOldPwd] = useState();
  const [isCnfRevealPwd, setCnfIsRevealPwd] = useState();

  /**
   * This API will call when user clicks on Update Button,
   */
  const { mutate: doUseChangePassword, isLoading } = useChangePassword((response) => {
    toast.success(response.message);
    formik.resetForm();
  });
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUseChangePassword(values);
    },
  });

  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to="/edit-profile">{t('page.edit_profile')}</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/change-password">{t('page.edit_change_password')}</NavLink>
        </Nav.Item>
      </Nav>

      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.change_password_text')}</h1>
        <Row>
          <Col lg={12}>
            <div className="normal-box">
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.change_old_password_password_label')}
                  </Form.Label>
                  <InputGroup className="form-group-field">
                    <FormControl
                      className={
                        'form-field ' +
                        (formik.touched.old_password && formik.errors.old_password
                          ? 'form-field-error'
                          : formik.touched.old_password && !formik.errors.old_password
                          ? 'form-field-success'
                          : '')
                      }
                      name="old_password"
                      placeholder={t('page.change_old_password_password_placeholder')}
                      autoComplete="off"
                      type={isRevealOldPwd ? 'text' : 'password'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.old_password}
                    />
                    <InputGroup.Text
                      className={
                        'form-field ' +
                        (formik.touched.old_password && formik.errors.old_password
                          ? 'form-field-error'
                          : formik.touched.old_password && !formik.errors.old_password
                          ? 'form-field-success'
                          : '')
                      }>
                      <FontAwesomeIcon
                        onClick={() => setIsRevealOldPwd((prevState) => !prevState)}
                        icon={isRevealOldPwd ? faEye : faEyeSlash}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                  <div className="form-field-error-text">
                    {formik.touched.old_password && formik.errors.old_password ? (
                      <div>{t(formik.errors.old_password)}</div>
                    ) : null}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.reset_password_password_label')}
                  </Form.Label>
                  <InputGroup className="form-group-field">
                    <FormControl
                      className={
                        'form-field ' +
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
                        'form-field ' +
                        (formik.touched.new_password && formik.errors.new_password
                          ? 'form-field-error'
                          : formik.touched.new_password && !formik.errors.new_password
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
                    {formik.touched.new_password && formik.errors.new_password ? (
                      <div>{t(formik.errors.new_password)}</div>
                    ) : null}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.reset_password_confirm_password_label')}
                  </Form.Label>
                  <InputGroup className="form-group-field">
                    <FormControl
                      className={
                        'form-field ' +
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
                        'form-field ' +
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
                </Form.Group>
                <div className="primary-button">
                  <Link to="/dashboard" className="link-center">
                    {t('page.reset_password_cancel_button_text')}
                  </Link>
                  <TNButton type="submit" loading={isLoading}>
                    {t('page.reset_password_submit_button_text')}
                  </TNButton>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};
ChangePasswordPage.propTypes = {
  t: PropTypes.func,
};
export { ChangePasswordPage };
