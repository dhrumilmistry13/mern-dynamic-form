import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './HomePageBannerValidations';
import { useUpdateHomeBanner, useViewHomeBanner } from 'hooks';
import { fileToDataUri, imagePreviewFromik, s3BucketFileUpload } from 'helpers';
import { TNButton } from 'common/components';
import SettingNavBar from './SettingNavBar';

const HomePageBannerPage = ({ t }) => {
  const bannerImageRef = useRef();
  const navigate = useNavigate();

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      home_page_banner_image: '',
      home_page_banner_header_title: '',
      home_page_banner_header_text: '',
      home_page_banner_button_text: '',
      home_page_banner_button_link: '',
      home_page_banner_blog_link: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateHomeBanner(values);
    },
  });
  /**
   * This function will call on page load, and data will be set to the form fields
   */
  const { refetch: doViewHomeBanner, isLoading: isLoadingData } = useViewHomeBanner(
    ({ data: home_banner }) => {
      if (home_banner) {
        formik.values.home_page_banner_image = home_banner.home_page_banner_image;
        formik.values.home_page_banner_header_title = home_banner.home_page_banner_header_title;
        formik.values.home_page_banner_header_text = home_banner.home_page_banner_header_text;
        formik.values.home_page_banner_button_text = home_banner.home_page_banner_button_text;
        formik.values.home_page_banner_button_link = home_banner.home_page_banner_button_link;
        formik.values.home_page_banner_blog_link = home_banner.home_page_banner_blog_link;
      }
    }
  );

  /**
   * This function will call on submit, and data will get updated
   */
  const { mutate: doUpdateHomeBanner, isLoading } = useUpdateHomeBanner((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      doViewHomeBanner();
    }, 2000);
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
  return (
    <>
      <SettingNavBar t={t} />
      <Card className="inner-box px-4">
        <h1 className="page-heading-center"> {t('page.settings_home_page_banner')}</h1>
        <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={6} md={6} xs={12}>
              <div className="change-align">
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    ' d-none ' +
                    (formik.touched.home_page_banner_image && formik.errors.home_page_banner_image
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_image &&
                        !formik.errors.home_page_banner_image
                      ? 'form-field-success'
                      : '')
                  }
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  ref={bannerImageRef}
                  name="home_page_banner_image"
                  onChange={(event) => {
                    formik.setFieldValue('home_page_banner_image', event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => bannerImageRef.current.click()}
                  className="btn btn-outline-primary ms-3">
                  {t('page.settings_home_page_banner_placeholder_btn')}
                </button>
                <div className="preview-image change-align">
                  <div>
                    {formik.values?.home_page_banner_image &&
                    formik.values?.home_page_banner_image ? (
                      <>
                        <img
                          width={'100px'}
                          src={imagePreviewFromik(formik.values?.home_page_banner_image)}
                          alt="banner-img"
                        />
                        <FontAwesomeIcon
                          onClick={() => {
                            formik.setFieldValue('home_page_banner_image', null);
                          }}
                          className="svg-inline--fa "
                          icon={faXmark}
                        />
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              <div className="form-field-error-text">
                {formik.touched.home_page_banner_image && formik.errors.home_page_banner_image ? (
                  <div>{t(formik.errors.home_page_banner_image)}</div>
                ) : null}
              </div>
            </Col>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_title_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_banner_header_title &&
                    formik.errors.home_page_banner_header_title
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_header_title &&
                        !formik.errors.home_page_banner_header_title
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_banner_header_title"
                  placeholder={t('page.settings_home_page_banner_title_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_banner_header_title}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_banner_header_title &&
                  formik.errors.home_page_banner_header_title ? (
                    <div>{t(formik.errors.home_page_banner_header_title)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_description_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    formik.touched.home_page_banner_header_text &&
                    formik.errors.home_page_banner_header_text
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_header_text &&
                        !formik.errors.home_page_banner_header_text
                      ? 'form-field-success'
                      : ''
                  }
                  as="textarea"
                  rows={5}
                  type="text"
                  name="home_page_banner_header_text"
                  placeholder={t('page.settings_home_page_banner_description_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_banner_header_text}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_banner_header_text &&
                  formik.errors.home_page_banner_header_text ? (
                    <div>{t(formik.errors.home_page_banner_header_text)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_started_btn_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_banner_button_text &&
                    formik.errors.home_page_banner_button_text
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_button_text &&
                        !formik.errors.home_page_banner_button_text
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_banner_button_text"
                  placeholder={t('page.settings_home_page_banner__started_btn_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_banner_button_text}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_banner_button_text &&
                  formik.errors.home_page_banner_button_text ? (
                    <div>{t(formik.errors.home_page_banner_button_text)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_started_btn_link_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_banner_button_link &&
                    formik.errors.home_page_banner_button_link
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_button_link &&
                        !formik.errors.home_page_banner_button_link
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_banner_button_link"
                  placeholder={t('page.settings_home_page_banner__started_btn_link_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_banner_button_link}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_banner_button_link &&
                  formik.errors.home_page_banner_button_link ? (
                    <div>{t(formik.errors.home_page_banner_button_link)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_banner_blog_link_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field-height ' +
                    (formik.touched.home_page_banner_blog_link &&
                    formik.errors.home_page_banner_blog_link
                      ? 'form-field-error'
                      : formik.touched.home_page_banner_blog_link &&
                        !formik.errors.home_page_banner_blog_link
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_banner_blog_link"
                  placeholder={t('page.settings_home_page_banner_blog_link_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_banner_blog_link}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_banner_blog_link &&
                  formik.errors.home_page_banner_blog_link ? (
                    <div>{t(formik.errors.home_page_banner_blog_link)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <div className="primary-button">
            <Link to="#" className="link-center" onClick={handleCancel}>
              {t('page.settings_home_page_banner_cancel_btn')}
            </Link>
            <TNButton
              type="submit"
              disabled={isLoadingData}
              loading={isLoading}
              isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
              {t('page.settings_home_page_banner_submit_btn')}
            </TNButton>
          </div>
        </Form>
      </Card>
    </>
  );
};
HomePageBannerPage.propTypes = {
  t: PropTypes.func,
};
export default HomePageBannerPage;
