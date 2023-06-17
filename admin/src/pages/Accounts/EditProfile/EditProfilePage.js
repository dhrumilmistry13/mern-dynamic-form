import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav, Form, Modal, Row, Col, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit } from '@fortawesome/free-solid-svg-icons';

import 'assets/scss/page/_editprofile.scss';
import {
  validationSchemaemail,
  validationSchema,
  validationSchemaVerfiy,
} from './EditProfileValidation';
import {
  useGetProfile,
  useUpdateProfile,
  useGetCountryCodeList,
  useUpdateEmail,
  useUpdateEmailVerify,
  useResendEamilOtp,
} from 'hooks';

import { showLoader, hideLoader } from 'store/features/loaderSlice';
import { updateUserData } from 'store/features/authSlice';
import { TNButton } from 'common/components/TNButton';
import { defaultValue, fileToDataUri, imagePreviewFromik, s3BucketFileUpload } from 'helpers/';
import { confirmAlert } from 'react-confirm-alert';
const EditProfilePage = ({ t }) => {
  const navigate = useNavigate();
  const profilePic = useRef();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  /**
   * These Functions will execute on Icons, and will open and close modal to update email
   */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /**
   * This api call will gives response of user profile and setting data
   */
  const { refetch: doGetProfile, isLoading } = useGetProfile(({ data: profile }) => {
    if (profile) {
      formik.values.first_name = profile.userData.first_name;
      formik.values.last_name = profile.userData.last_name;
      formik.values.email = profile.userData.email;
      formik.values.phone = profile.userData.phone;
      formik.values.country_id = profile.userData.country_id;
      formik.values.profile_image = profile.userData.profile_image;
    }
    const dataStore = {
      userData: profile.userData,
    };
    dispatch(updateUserData(dataStore));
  });
  /**
   * This api call will gives List of country code
   */
  const { isLoading: countryIsLoad, data: countryCodeList } = useGetCountryCodeList();

  const options = [];
  if (countryCodeList !== undefined) {
    countryCodeList.data.map((val) => {
      return options.push({
        value: val.country_id,
        label: val.phone_code + ' (' + val.name + ')',
      });
    });
  }
  /**
   * This api will call on update button, and will update data
   */
  const { mutate: doUseUpdateProfile } = useUpdateProfile((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    toast.success(response.message);
    setTimeout(() => {
      doGetProfile();
    }, 2000);
  });

  /**
   * This api will call on submit button of email update modal, and will send otp to that email
   */
  const { mutate: doUserUpdateEmailVerify, isLoading: isLoadingEmailVerify } = useUpdateEmailVerify(
    (response) => {
      toast.success(response.message);
      setShow(false);
      setShowVerify(false);
      setVerifyToken(null);
      setTimeout(() => {
        doGetProfile();
      }, 2000);
    }
  );
  /**
   * This will call on resend button, and send otp to user again
   */
  const { mutate: doResendOtp } = useResendEamilOtp(
    (response) => {
      dispatch(hideLoader());
      setVerifyToken(response.data.encodedToken);
      toast.success(response.message);
    },
    (response) => {
      toast.error(response.message);
      dispatch(hideLoader());
    }
  );
  /**
   * This will call on Submit Button, and update Admin's email
   */
  const { mutate: doUserUpdateEmail, isLoading: isLoadingEmail } = useUpdateEmail((response) => {
    toast.success(response.message);
    setShow(false);
    setShowVerify(true);
    setVerifyToken(response.data.encodedToken);
  });
  /**
   * This will call when user clicks on resend Button link.
   */
  const handleResend = () => {
    const values = {};
    values.encoded_token = verifyToken;
    dispatch(showLoader());
    doResendOtp(values);
  };
  /**
   * This Block is execute on Form Submit for validation
   */
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      profile_image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (profilePic.current.files[0] != null && profilePic.current.files[0] != undefined) {
        values.profile_image = profilePic.current.files[0];
      }
      doUseUpdateProfile(values);
    },
  });
  const formikEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchemaemail,
    onSubmit: async (values) => {
      doUserUpdateEmail(values);
    },
  });
  const formikEmailVerify = useFormik({
    initialValues: {
      verification_otp: '',
      encoded_token: verifyToken,
    },
    validationSchema: validationSchemaVerfiy,
    onSubmit: async (values) => {
      values.encoded_token = verifyToken;
      doUserUpdateEmailVerify(values);
    },
  });
  /**
   * This function will call when admin clicks on cancel button,
   * and will display alert
   */
  const handleCancel = () => {
    if (formik.dirty && formik.dirty !== undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert-box">
              <FontAwesomeIcon
                className="alert-close"
                icon={faClose}
                onClick={() => {
                  onClose();
                }}
              />
              <div className="alert-popup">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: t('page.reset_alert_popup_message'),
                  }}></h2>
                <Button
                  className="table-delete-button"
                  onClick={() => {
                    onClose();
                    navigate(`/dashboard/`);
                  }}>
                  {t('page.alert_popup_yes_button')}
                </Button>
                <Button className="table-primary-button" onClick={onClose}>
                  {t('page.alert_popup_no_button')}
                </Button>
              </div>
            </div>
          );
        },
      });
    } else {
      navigate(`/dashboard/`);
    }
  };

  /**
   * This function will call when admin clicks on cancel button of email modal,
   * and will display alert
   */
  const handleCancelEmailModal = () => {
    if (formikEmail.dirty && formikEmail.dirty !== undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert-box">
              <FontAwesomeIcon
                className="alert-close"
                icon={faClose}
                onClick={() => {
                  onClose();
                }}
              />
              <div className="alert-popup">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: t('page.reset_alert_popup_message'),
                  }}></h2>
                <Button
                  className="table-delete-button"
                  onClick={() => {
                    onClose();
                    setShow(false);
                  }}>
                  {t('page.alert_popup_yes_button')}
                </Button>
                <Button className="table-primary-button" onClick={onClose}>
                  {t('page.alert_popup_no_button')}
                </Button>
              </div>
            </div>
          );
        },
      });
    } else {
      setShow(false);
    }
  };

  /**
   * This function will call when admin clicks on cancel button of email modal
   * at otp verification step, and will display alert
   */
  const handleCancelOTPModal = () => {
    if (formikEmail.dirty && formikEmail.dirty !== undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert-box">
              <FontAwesomeIcon
                className="alert-close"
                icon={faClose}
                onClick={() => {
                  onClose();
                }}
              />
              <div className="alert-popup">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: t('page.reset_alert_popup_message'),
                  }}></h2>
                <Button
                  className="table-delete-button"
                  onClick={() => {
                    onClose();
                    setShowVerify(false);
                    setVerifyToken(null);
                  }}>
                  {t('page.alert_popup_yes_button')}
                </Button>
                <Button className="table-primary-button" onClick={onClose}>
                  {t('page.alert_popup_no_button')}
                </Button>
              </div>
            </div>
          );
        },
      });
    } else {
      setShowVerify(false);
      setVerifyToken(null);
    }
  };

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
        <h1 className="page-heading-center"> {t('page.edit_profile_text')}</h1>
        <div className="edit-profile-form">
          <Form onSubmit={formik.handleSubmit}>
            <div className="edit-profile-img ">
              <img src={imagePreviewFromik(formik.values.profile_image)} alt="profile_img" />
            </div>
            <div className="upload-profile">
              <label htmlFor="profile_image">{t('page.edit_profile_upload_photo')}</label>
              <input
                name="profile_image"
                id="profile_image"
                onChange={(event) => {
                  formik.setFieldValue('profile_image', event.currentTarget.files[0]);
                }}
                ref={profilePic}
                style={{ visibility: 'hidden', display: 'none' }}
                type={'file'}></input>
            </div>
            <Row>
              <Col lg={6} md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.profile_first_name')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.first_name && formik.errors.first_name
                        ? 'form-field-error'
                        : formik.touched.first_name && !formik.errors.first_name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="first_name"
                    placeholder={t('page.profile_first_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.first_name && formik.errors.first_name ? (
                      <div>{t(formik.errors.first_name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6} md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.profile_last_name')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.last_name && formik.errors.last_name
                        ? 'form-field-error'
                        : formik.touched.last_name && !formik.errors.last_name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="last_name"
                    placeholder={t('page.profile_last_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.last_name && formik.errors.last_name ? (
                      <div>{t(formik.errors.last_name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6} md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.profile_email')}
                  </Form.Label>
                  <Form.Label className="field-label field-label-top float-end me-4">
                    <FontAwesomeIcon icon={faEdit} onClick={handleShow} />
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
                    readOnly={true}
                    placeholder={t('page.profile_email_placeholder')}
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
              </Col>
              <Col lg={6} md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.profile_phone')}
                  </Form.Label>
                  <Row>
                    <Col lg={6} xs={6}>
                      <Select
                        name="country_id"
                        value={defaultValue(options, formik.values.country_id)}
                        defaultValue={formik.values.country_id}
                        onChange={(selectedOption) => {
                          if (selectedOption !== null) {
                            formik.setFieldValue('country_id', selectedOption.value);
                          } else {
                            formik.setFieldValue('country_id', '');
                          }
                        }}
                        className={
                          'contry-code' +
                          (formik.touched.country_id && formik.errors.country_id
                            ? 'form-field-error'
                            : formik.touched.country_id && !formik.errors.country_id
                            ? 'form-field-success'
                            : '')
                        }
                        options={countryIsLoad ? options : options}
                      />
                      <div className="form-field-error-text">
                        {formik.touched.country_id && formik.errors.country_id ? (
                          <div>{t(formik.errors.country_id)}</div>
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={6} xs={6}>
                      <Form.Control
                        className={
                          'contant-number ' +
                          (formik.touched.phone && formik.errors.phone
                            ? 'form-field-error'
                            : formik.touched.phone && !formik.errors.phone
                            ? 'form-field-success'
                            : '')
                        }
                        type="text"
                        name="phone"
                        placeholder={t('page.profile_phone_placeholder')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                      />
                      <div className="form-field-error-text">
                        {formik.touched.phone && formik.errors.phone ? (
                          <div>{t(formik.errors.phone)}</div>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <div className="primary-button">
              <span className="link-center" onClick={handleCancel}>
                {t('page.cancel_button_text')}
              </span>
              <TNButton loading={isLoading} type="submit">
                {t('page.save_button_text')}
              </TNButton>
            </div>
          </Form>
        </div>
      </Card>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-auto">
          <Form onSubmit={formikEmail.handleSubmit}>
            <Form.Group>
              <Form.Label className="field-label field-label-top">
                {t('page.profile_email')}
              </Form.Label>
              <Form.Control
                className={'form-field'}
                type="text"
                name="email"
                placeholder={t('page.profile_email_placeholder')}
                onChange={formikEmail.handleChange}
                onBlur={formikEmail.handleBlur}
              />
              <div className="form-field-error-text">
                {formikEmail.touched.email && formikEmail.errors.email ? (
                  <div>{t(formikEmail.errors.email)}</div>
                ) : null}
              </div>
            </Form.Group>
            <div className="primary-button">
              <span className="link-center" onClick={handleCancelEmailModal}>
                {t('page.cancel_button_text')}
              </span>
              <TNButton type="submit" loading={isLoadingEmail}>
                {t('page.save_button_text')}
              </TNButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={showVerify}
        onHide={() => {
          setShowVerify(false);
          setVerifyToken(null);
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email Verify</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-auto">
          <Form onSubmit={formikEmailVerify.handleSubmit}>
            <Form.Group>
              <Form.Label className="field-label">{t('page.profile_email_otp_label')}</Form.Label>
              <Form.Control
                className={
                  'form-field ' +
                  (formikEmailVerify.touched.verification_otp &&
                  formikEmailVerify.errors.verification_otp
                    ? 'form-field-error'
                    : formikEmailVerify.touched.verification_otp &&
                      !formikEmailVerify.errors.verification_otp
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
                placeholder={t('page.profile_email_otp_placeholder')}
                onChange={formikEmailVerify.handleChange}
                onBlur={formikEmailVerify.handleBlur}
                value={formikEmailVerify.values.verification_otp}
              />
              {formikEmailVerify.touched.verification_otp &&
              formikEmailVerify.errors.verification_otp ? (
                <div className="form-field-error-text">
                  {t(formikEmailVerify.errors.verification_otp)}
                </div>
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
              <span className="link-center" onClick={handleCancelOTPModal}>
                {t('page.cancel_button_text')}
              </span>
              <TNButton
                type="submit"
                loading={isLoadingEmailVerify}
                isdirtyform={
                  formikEmailVerify.dirty && formikEmailVerify.dirty !== undefined ? 1 : 0
                }>
                {t('page.save_button_text')}
              </TNButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
EditProfilePage.propTypes = {
  t: PropTypes.func,
};
export { EditProfilePage };
