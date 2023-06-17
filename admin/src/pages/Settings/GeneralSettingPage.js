import { React, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Nav, Row, Form, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { confirmAlert } from 'react-confirm-alert'; // Import

import validationSchema from './GeneralSettingValidation';
import { useGetSettingDataAlways, useStoreSettingData } from 'hooks';
import { addSetting } from 'store/features/settingSlice';
import { TNButton } from 'common/components/TNButton';
import 'assets/scss/page/_generalsetting.scss';
import {
  fileToDataUri,
  imagePreviewFromik,
  s3BucketFileUpload,
  currencyFormatFloat,
} from 'helpers';

const GeneralSetting = ({ t }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let dashboardRef = useRef();
  let faviconRef = useRef();
  let loginRef = useRef();
  let stepRef = useRef();
  let emailRef = useRef();
  /**
   * This function will call on page load,
   * and this will get data from API then set it to the Formik's Initial values
   */
  const { refetch: doViewHomeGeneral } = useGetSettingDataAlways(({ data: general_data }) => {
    if (general_data) {
      formik.values.home_page_general_header_logo = general_data.home_page_general_header_logo;
      formik.values.home_page_general_header_sub_logo =
        general_data.home_page_general_header_sub_logo;
      formik.values.home_page_general_email_logo = general_data.home_page_general_email_logo;
      formik.values.home_page_general_favicon_logo = general_data.home_page_general_favicon_logo;
      formik.values.home_page_general_seo_title = general_data.home_page_general_seo_title;
      formik.values.home_page_general_seo_description =
        general_data.home_page_general_seo_description;
      formik.values.home_page_general_step_image = general_data.home_page_general_step_image;
      formik.values.home_page_general_copyright_text =
        general_data.home_page_general_copyright_text;
      formik.values.home_page_general_email_address = general_data.home_page_general_email_address;
      formik.values.home_page_general_doctor_visit_fees =
        general_data.home_page_general_doctor_visit_fees;
      formik.values.home_page_general_telemedicine_platform_Fee =
        general_data.home_page_general_telemedicine_platform_Fee;
      // Adding data to the data store object
      const dataStore = {
        home_page_general_header_logo: general_data.home_page_general_header_logo,
        home_page_general_header_sub_logo: general_data.home_page_general_header_sub_logo,
        home_page_general_email_logo: general_data?.home_page_general_email_logo,
        home_page_general_favicon_logo: general_data?.home_page_general_favicon_logo,
        home_page_general_seo_title: general_data.home_page_general_seo_title,
        home_page_general_seo_description: general_data.home_page_general_seo_description,
        home_page_general_step_image: general_data.home_page_general_step_image,
        home_page_general_copyright_text: general_data.home_page_general_copyright_text,
        home_page_general_email_address: general_data.home_page_general_email_address,
        home_page_general_doctor_visit_fees: general_data.home_page_general_doctor_visit_fees,
        home_page_general_telemedicine_platform_Fee:
          general_data.home_page_general_telemedicine_platform_Fee,
        setting_get: true,
      };
      // Adding Data to the global settings state of redux store
      dispatch(addSetting(dataStore));
    }
  });
  /**
   * !This Api will call on click submit button, and data will get updated, and them user will be redirected to the dashboard page
   */
  const { mutate: doStoreSettingData, isLoading } = useStoreSettingData((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    toast.success(response.message);
    setTimeout(function () {
      doViewHomeGeneral();
      navigate('/dashboard');
    }, 1500);
  });

  /**
   * !This block will call on click cancel button, It'll open alert for user,
   * and user will be redirected to the dashboard page after confirmation
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
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      home_page_general_header_logo: '',
      home_page_general_header_sub_logo: '',
      home_page_general_email_logo: '',
      home_page_general_favicon_logo: '',
      home_page_general_step_image: '',
      home_page_general_seo_title: '',
      home_page_general_seo_description: '',
      home_page_general_copyright_text: '',
      home_page_general_email_address: '',
      home_page_general_doctor_visit_fees: '',
      home_page_general_telemedicine_platform_Fee: '',
    },
    validationSchema,
    onSubmit: (values) => {
      doStoreSettingData(values);
    },
  });
  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to="/settings/general">{t('page.general_setting_tab_general_setting')}</NavLink>
        </Nav.Item>
      </Nav>
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.general_setting_header_text')}</h1>
        <div className="settings">
          <div className="general-setting">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group className="change-align">
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_home_page_general_header_logo')}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      hidden
                      ref={dashboardRef}
                      name="home_page_general_header_logo"
                      onChange={(event) => {
                        formik.setFieldValue(
                          'home_page_general_header_logo',
                          event.currentTarget.files[0]
                        );
                      }}
                      accept=".jpeg,.jpg,.png"
                    />
                    <Button
                      type="button"
                      className="upload-button"
                      onClick={() => dashboardRef.current?.click()}>
                      {t('page.file_upload')}
                    </Button>
                    <div className="preview-image change-align">
                      {formik.values.home_page_general_header_logo && (
                        <div>
                          <img
                            src={imagePreviewFromik(formik.values.home_page_general_header_logo)}
                            width="100px"
                            alt="profile_img"
                          />
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              formik.setFieldValue('home_page_general_header_logo', '');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="form-field-error-text">
                    {formik.touched.home_page_general_header_logo &&
                    formik.errors.home_page_general_header_logo ? (
                      <div>{t(formik.errors.home_page_general_header_logo)}</div>
                    ) : null}
                  </div>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_home_page_general_header_sub_logo')}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      hidden
                      ref={faviconRef}
                      name="home_page_general_header_sub_logo"
                      accept=".jpeg,.jpg,.png"
                      onChange={(event) => {
                        formik.setFieldValue(
                          'home_page_general_header_sub_logo',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <Button
                      type="button"
                      className="upload-button"
                      onClick={() => faviconRef.current?.click()}>
                      {t('page.file_upload')}
                    </Button>
                    <div className="preview-image">
                      {formik.values.home_page_general_header_sub_logo && (
                        <div>
                          <img
                            src={imagePreviewFromik(
                              formik.values.home_page_general_header_sub_logo
                            )}
                            width="100px"
                            alt="profile_img"
                          />
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              formik.setFieldValue('home_page_general_header_sub_logo', '');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="form-field-error-text">
                    {formik.touched.home_page_general_header_sub_logo &&
                    formik.errors.home_page_general_header_sub_logo ? (
                      <div>{t(formik.errors.home_page_general_header_sub_logo)}</div>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group className="change-align">
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_home_page_general_email_logo')}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      hidden
                      ref={loginRef}
                      name="home_page_general_email_logo"
                      accept=".jpeg,.jpg,.png"
                      onChange={(event) => {
                        formik.setFieldValue(
                          'home_page_general_email_logo',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <Button
                      type="button"
                      className="upload-button"
                      onClick={() => loginRef.current?.click()}>
                      {t('page.file_upload')}
                    </Button>
                    <div className="preview-image change-align">
                      {formik.values.home_page_general_email_logo && (
                        <div>
                          <img
                            src={imagePreviewFromik(formik.values.home_page_general_email_logo)}
                            width="100px"
                            alt="profile_img"
                          />
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              formik.setFieldValue('home_page_general_email_logo', '');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="form-field-error-text">
                    {formik.touched.home_page_general_email_logo &&
                    formik.errors.home_page_general_email_logo ? (
                      <div>{t(formik.errors.home_page_general_email_logo)}</div>
                    ) : null}
                  </div>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_home_page_general_favicon_logo')}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      hidden
                      ref={emailRef}
                      accept=".png,.ico"
                      name="home_page_general_favicon_logo"
                      onChange={(event) => {
                        formik.setFieldValue(
                          'home_page_general_favicon_logo',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <Button
                      type="button"
                      className="upload-button"
                      onClick={() => emailRef.current?.click()}>
                      {t('page.file_upload')}
                    </Button>
                    <div className="preview-image">
                      {formik.values.home_page_general_favicon_logo && (
                        <div>
                          <img
                            src={imagePreviewFromik(formik.values.home_page_general_favicon_logo)}
                            width="100px"
                            alt="profile_img"
                          />
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              formik.setFieldValue('home_page_general_favicon_logo', '');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="form-field-error-text">
                    {formik.touched.home_page_general_favicon_logo &&
                    formik.errors.home_page_general_favicon_logo ? (
                      <div>{t(formik.errors.home_page_general_favicon_logo)}</div>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Form.Group className="change-align">
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_home_page_general_step_image')}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      hidden
                      ref={stepRef}
                      name="home_page_general_step_image"
                      accept=".jpeg,.jpg,.png"
                      onChange={(event) => {
                        formik.setFieldValue(
                          'home_page_general_step_image',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <Button
                      type="button"
                      className="upload-button"
                      onClick={() => stepRef.current?.click()}>
                      {t('page.file_upload')}
                    </Button>
                    <div className="preview-image change-align">
                      {formik.values.home_page_general_step_image && (
                        <div>
                          <img
                            src={imagePreviewFromik(formik.values.home_page_general_step_image)}
                            width="100px"
                            alt="profile_img"
                          />
                          <FontAwesomeIcon
                            icon={faClose}
                            onClick={() => {
                              formik.setFieldValue('home_page_general_step_image', '');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="form-field-error-text">
                    {formik.touched.home_page_general_step_image &&
                    formik.errors.home_page_general_step_image ? (
                      <div>{t(formik.errors.home_page_general_step_image)}</div>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_seo_title_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        'form-field-height' +
                        (formik.touched.home_page_general_seo_title &&
                        formik.errors.home_page_general_seo_title
                          ? 'form-field-error'
                          : formik.touched.home_page_general_seo_title &&
                            !formik.errors.home_page_general_seo_title
                          ? 'form-field-success'
                          : '')
                      }
                      type="text"
                      name="home_page_general_seo_title"
                      placeholder={t('page.general_setting_seo_title_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_general_seo_title}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_general_seo_title &&
                      formik.errors.home_page_general_seo_title ? (
                        <div>{t(formik.errors.home_page_general_seo_title)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_seo_description_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        formik.touched.home_page_general_seo_description &&
                        formik.errors.home_page_general_seo_description
                          ? 'form-field-error'
                          : formik.touched.home_page_general_seo_description &&
                            !formik.errors.home_page_general_seo_description
                          ? 'form-field-success'
                          : ''
                      }
                      as="textarea"
                      rows={3}
                      type="text"
                      name="home_page_general_seo_description"
                      placeholder={t('page.general_setting_seo_description_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_general_seo_description}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_general_seo_description &&
                      formik.errors.home_page_general_seo_description ? (
                        <div>{t(formik.errors.home_page_general_seo_description)}</div>
                      ) : null}
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_setting_copyright_text_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        'form-field-height' +
                        (formik.touched.home_page_general_copyright_text &&
                        formik.errors.home_page_general_copyright_text
                          ? 'form-field-error'
                          : formik.touched.home_page_general_copyright_text &&
                            !formik.errors.home_page_general_copyright_text
                          ? 'form-field-success'
                          : '')
                      }
                      type="text"
                      name="home_page_general_copyright_text"
                      placeholder={t('page.general_setting_copyright_text_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_general_copyright_text}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_general_copyright_text &&
                      formik.errors.home_page_general_copyright_text ? (
                        <div>{t(formik.errors.home_page_general_copyright_text)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.general_home_page_general_email_address_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        'form-field-height' +
                        (formik.touched.home_page_general_email_address &&
                        formik.errors.home_page_general_email_address
                          ? 'form-field-error'
                          : formik.touched.home_page_general_email_address &&
                            !formik.errors.home_page_general_email_address
                          ? 'form-field-success'
                          : '')
                      }
                      type="text"
                      name="home_page_general_email_address"
                      placeholder={t('page.general_home_page_general_email_address_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_general_email_address}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_general_email_address &&
                      formik.errors.home_page_general_email_address ? (
                        <div>{t(formik.errors.home_page_general_email_address)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                </Col>
                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label className="field-label field-label-top">
                        {t('page.general_home_page_general_doctor_visit_fees')}
                      </Form.Label>
                      <Form.Control
                        className={
                          'form-field-height' +
                          (formik.touched.home_page_general_doctor_visit_fees &&
                          formik.errors.home_page_general_doctor_visit_fees
                            ? 'form-field-error'
                            : formik.touched.home_page_general_doctor_visit_fees &&
                              !formik.errors.home_page_general_doctor_visit_fees
                            ? 'form-field-success'
                            : '')
                        }
                        type="text"
                        name="home_page_general_doctor_visit_fees"
                        placeholder={t(
                          'page.general_home_page_general_doctor_visit_fees_placeholder'
                        )}
                        value={formik.values.home_page_general_doctor_visit_fees}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.setFieldValue(
                            'home_page_general_doctor_visit_fees',
                            currencyFormatFloat(e)
                          );
                        }}
                        onKeyUp={currencyFormatFloat}
                      />
                      <div className="form-field-error-text">
                        {formik.touched.home_page_general_doctor_visit_fees &&
                        formik.errors.home_page_general_doctor_visit_fees ? (
                          <div>{t(formik.errors.home_page_general_doctor_visit_fees)}</div>
                        ) : null}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label className="field-label field-label-top">
                        {t('page.general_home_page_general_telemedicine_platform_Fee')}
                      </Form.Label>
                      <Form.Control
                        className={
                          'form-field-height' +
                          (formik.touched.home_page_general_telemedicine_platform_Fee &&
                          formik.errors.home_page_general_telemedicine_platform_Fee
                            ? 'form-field-error'
                            : formik.touched.home_page_general_telemedicine_platform_Fee &&
                              !formik.errors.home_page_general_telemedicine_platform_Fee
                            ? 'form-field-success'
                            : '')
                        }
                        type="text"
                        name="home_page_general_telemedicine_platform_Fee"
                        placeholder={t(
                          'page.general_home_page_general_telemedicine_platform_Fee_placeholder'
                        )}
                        value={formik.values.home_page_general_telemedicine_platform_Fee}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.setFieldValue(
                            'home_page_general_telemedicine_platform_Fee',
                            currencyFormatFloat(e)
                          );
                        }}
                        onKeyUp={currencyFormatFloat}
                      />
                      <div className="form-field-error-text">
                        {formik.touched.home_page_general_telemedicine_platform_Fee &&
                        formik.errors.home_page_general_telemedicine_platform_Fee ? (
                          <div>{t(formik.errors.home_page_general_telemedicine_platform_Fee)}</div>
                        ) : null}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="primary-button">
                  <span className="link-center" onClick={handleCancel}>
                    {t('page.general_setting_cancel_link')}
                  </span>
                  <TNButton
                    type="submit"
                    loading={isLoading}
                    isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
                    {t('page.general_setting_save_button')}
                  </TNButton>
                </div>
              </Row>
            </Form>
          </div>
        </div>
      </Card>
    </>
  );
};
GeneralSetting.propTypes = {
  t: PropTypes.func,
  isdirtyform: PropTypes.any,
};
export default GeneralSetting;
