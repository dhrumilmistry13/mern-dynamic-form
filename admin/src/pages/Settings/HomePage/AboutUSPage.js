import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './AboutUsValidations';
import { useViewABoutUs, useUpdateABoutUs } from 'hooks';
import { fileToDataUri, imagePreviewFromik, s3BucketFileUpload } from 'helpers';
import { TNButton } from 'common/components';
import SettingNavBar from './SettingNavBar';

const AboutUSPage = ({ t }) => {
  const navigate = useNavigate();
  const aboutUSImgRef = useRef();

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      home_page_about_us_image: '',
      home_page_about_us_header_title: '',
      home_page_about_us_header_sub_title: '',
      home_page_about_us_header_text: '',
      home_page_about_us_button_text: '',
      home_page_about_us_button_link: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateHomeabout_us(values);
    },
  });
  /**
   * This function will call on page load and when refetch calls,
   * and this will get data from API then set it to the Formik's Initial values
   */
  const { refetch: doViewHomeabout_us, isLoading: isLogindData } = useViewABoutUs(
    ({ data: about_us_data }) => {
      if (about_us_data) {
        formik.values.home_page_about_us_image = about_us_data.home_page_about_us_image;
        formik.values.home_page_about_us_header_title =
          about_us_data.home_page_about_us_header_title;
        formik.values.home_page_about_us_header_sub_title =
          about_us_data.home_page_about_us_header_sub_title;
        formik.values.home_page_about_us_header_text = about_us_data.home_page_about_us_header_text;
        formik.values.home_page_about_us_button_text = about_us_data.home_page_about_us_button_text;
        formik.values.home_page_about_us_button_link = about_us_data.home_page_about_us_button_link;
      }
    }
  );
  /**
   * This function will call on submit button, It'll update data
   */
  const { mutate: doUpdateHomeabout_us, isLoading } = useUpdateABoutUs((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      doViewHomeabout_us();
    }, 2000);
  });

  // var componentConfig = {
  //   iconFiletypes: ['.jpg', '.png', '.gif'],
  //   showFiletypeIcon: true,
  //   postUrl: API_URL + '/admin/common/file-upload'
  // };
  // var djsConfig = {
  //   autoProcessQueue: true,
  //   acceptedFiles: 'image/jpg,image/png,image/jpeg',
  //   paramName: 'home_page_about_us_image', // The name that will be used to transfer the file
  //   maxFilesize: 10, // MB,
  //   autoDiscover: false,
  //   dataType: 'json',
  //   maxFiles: 1,
  //   addRemoveLinks: true
  // };
  // const initEventData = {
  //   init: (dropzone) => {
  //     const myDropzone = dropzone;
  //     const mockFile = { name: 'AboutUs Image', size: '10' };
  //     myDropzone.emit('addedfile', mockFile);
  //     myDropzone.emit('thumbnail', mockFile, formik.values.home_page_about_us_image);
  //     myDropzone.emit('complete', mockFile);
  //   }
  // };
  // const eventHandlersData = {
  //   addedfile: (file) => console.log(file),
  //   removedfile: (file) => {
  //     console.log(file);
  //     formik.setFieldValue('home_page_about_us_image', '');
  //   },
  //   success: (file, responseText) => {
  //     console.log(file, responseText);
  //     toast.success(responseText.message);
  //     formik.setFieldValue('home_page_about_us_image', responseText.data.home_page_about_us_image);
  //   },
  //   complete: (file) => console.log(file),
  //   queuecomplete: (file) => console.log(file),
  //   uploadprogress: (file) => console.log(file),
  //   accept: (file, done) => {
  //     file.acceptDimensions = done;
  //     file.rejectDimensions = () => {
  //       done('Image Width And Height only allow ' + 512 + ' X ' + 512 + ' px');
  //     };
  //   }
  // };
  // const eventHandlers = { ...initEventData, ...eventHandlersData };
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
        <h1 className="page-heading-center"> {t('page.settings_home_page_about_us_label')}</h1>
        <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
          <Row>
            <Col>
              <div className="change-align">
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_image_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={'d-none'}
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  ref={aboutUSImgRef}
                  name="home_page_about_us_image"
                  onChange={(event) => {
                    formik.setFieldValue('home_page_about_us_image', event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => aboutUSImgRef.current.click()}
                  className="btn btn-outline-primary ms-3">
                  {t('page.settings_home_page_about_us_upload_btn')}
                </button>
                <div className="preview-image change-align">
                  <div>
                    {formik.values.home_page_about_us_image ? (
                      <>
                        <img
                          width={150}
                          src={imagePreviewFromik(formik.values.home_page_about_us_image)}
                          alt="about_us-img"
                        />
                        <FontAwesomeIcon
                          onClick={() => {
                            formik.setFieldValue('home_page_about_us_image', null);
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
                {formik.touched.home_page_about_us_image &&
                formik.errors.home_page_about_us_image ? (
                  <div>{t(formik.errors.home_page_about_us_image)}</div>
                ) : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_title_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_about_us_header_title &&
                    formik.errors.home_page_about_us_header_title
                      ? 'form-field-error'
                      : formik.touched.home_page_about_us_header_title &&
                        !formik.errors.home_page_about_us_header_title
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_about_us_header_title"
                  placeholder={t('page.settings_home_page_about_us_title_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_about_us_header_title}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_header_title &&
                  formik.errors.home_page_about_us_header_title ? (
                    <div>{t(formik.errors.home_page_about_us_header_title)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_sub_title_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_about_us_header_sub_title &&
                    formik.errors.home_page_about_us_header_sub_title
                      ? 'form-field-error'
                      : formik.touched.home_page_about_us_header_sub_title &&
                        !formik.errors.home_page_about_us_header_sub_title
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_about_us_header_sub_title"
                  placeholder={t('page.settings_home_page_about_us_sub_title_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_about_us_header_sub_title}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_header_sub_title &&
                  formik.errors.home_page_about_us_header_sub_title ? (
                    <div>{t(formik.errors.home_page_about_us_header_sub_title)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_description_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={
                    formik.touched.home_page_about_us_header_text &&
                    formik.errors.home_page_about_us_header_text
                      ? 'form-field-error'
                      : formik.touched.home_page_about_us_header_text &&
                        !formik.errors.home_page_about_us_header_text
                      ? 'form-field-success'
                      : ''
                  }
                  as="textarea"
                  rows={5}
                  type="text"
                  name="home_page_about_us_header_text"
                  placeholder={t('page.settings_home_page_about_us_description_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_about_us_header_text}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_header_text &&
                  formik.errors.home_page_about_us_header_text ? (
                    <div>{t(formik.errors.home_page_about_us_header_text)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_about_btn_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_about_us_button_text &&
                    formik.errors.home_page_about_us_button_text
                      ? 'form-field-error'
                      : formik.touched.home_page_about_us_button_text &&
                        !formik.errors.home_page_about_us_button_text
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_about_us_button_text"
                  placeholder={t('page.settings_home_page_about_us__about_btn_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_about_us_button_text}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_button_text &&
                  formik.errors.home_page_about_us_button_text ? (
                    <div>{t(formik.errors.home_page_about_us_button_text)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_about_btn_link_label')}:{' '}
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_about_us_button_link &&
                    formik.errors.home_page_about_us_button_link
                      ? 'form-field-error'
                      : formik.touched.home_page_about_us_button_link &&
                        !formik.errors.home_page_about_us_button_link
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_about_us_button_link"
                  placeholder={t('page.settings_home_page_about_us__about_btn_link_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_about_us_button_link}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_button_link &&
                  formik.errors.home_page_about_us_button_link ? (
                    <div>{t(formik.errors.home_page_about_us_button_link)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_about_us_image_label')}
                </Form.Label>
                {formik.values.home_page_about_us_image && (
                  <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig}
                  />
                )}
                {formik.values.home_page_about_us_image == '' && (
                  <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlersData}
                    djsConfig={djsConfig}
                  />
                )}
                <div className="form-field-error-text">
                  {formik.touched.home_page_about_us_image &&
                  formik.errors.home_page_about_us_image ? (
                    <div>{t(formik.errors.home_page_about_us_image)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row> */}
          <div className="primary-button">
            <Link to="#" className="link-center" onClick={handleCancel}>
              {t('page.settings_home_page_about_us_cancel_btn')}
            </Link>
            <TNButton
              type="submit"
              disabled={isLogindData}
              loading={isLoading}
              isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
              {t('page.settings_home_page_about_us_submit_btn')}
            </TNButton>
          </div>
        </Form>
      </Card>
    </>
  );
};
AboutUSPage.propTypes = {
  t: PropTypes.func,
};
export default AboutUSPage;
