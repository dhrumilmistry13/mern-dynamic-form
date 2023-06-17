import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import { TNBreadCurm, TNButton } from 'common/components';
import { useAddOurTeam } from 'hooks';
import validationSchema from './AddEditOurTeamValidations';
import { defaultValue, fileToDataUri, imagePreviewFromik, s3BucketFileUpload } from 'helpers';

const AddOurTeamPage = ({ t }) => {
  const navigate = useNavigate();
  const memberImageRef = useRef();

  /**
   * !This API will call when user click on Submit Button, and user will be redirected to the listing page
   */
  const { mutate: doUpdateOurTeam, isLoading } = useAddOurTeam((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      navigate('/our-team/list');
    }, 2000);
  });
  /**
   * Default Options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: '1', label: `${t('page.active_status_name')}` },
    { value: '2', label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      is_active: '',
      our_team_image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateOurTeam(values);
    },
  });
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.our_team_list_label'),
      link: '/our-team/list',
      active: '',
    },
    {
      label: t('page.add_our_team_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and will display alert
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
                    navigate(`/our-team/list`);
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
      navigate(`/our-team/list`);
    }
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center ">{t('page.add_our_team_label')}</h1>
        <div>
          <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.our_team_name_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.name && formik.errors.name
                        ? 'form-field-error'
                        : formik.touched.name && !formik.errors.name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="name"
                    placeholder={t('page.our_team_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
                    value={formik.values.name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.name && formik.errors.name ? (
                      <div>{t(formik.errors.name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.our_team_designation_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.designation && formik.errors.designation
                        ? 'form-field-error'
                        : formik.touched.designation && !formik.errors.designation
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="designation"
                    placeholder={t('page.our_team_designation_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.designation}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.designation && formik.errors.designation ? (
                      <div>{t(formik.errors.designation)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.our_team_is_active_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_status')}
                    options={options}
                    value={defaultValue(options, formik.values.is_active)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('is_active', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.is_active && formik.errors.is_active ? (
                      <div>{t(formik.errors.is_active)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div className="change-align">
                  <Form.Label className="field-label field-label-top">
                    {t('page.settings_our_team_image_label')}:{' '}
                  </Form.Label>
                  <Form.Control
                    className={'d-none'}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    ref={memberImageRef}
                    name="our_team_image"
                    onChange={(event) => {
                      formik.setFieldValue('our_team_image', event.currentTarget.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => memberImageRef.current.click()}
                    className="btn btn-outline-primary ms-3">
                    {t('page.settings_home_page_about_us_upload_btn')}
                  </button>
                  <div className="preview-image change-align">
                    <div>
                      {formik.values.our_team_image ? (
                        <>
                          <img
                            width={150}
                            src={imagePreviewFromik(formik.values.our_team_image)}
                            alt="about_us-img"
                          />
                          <FontAwesomeIcon
                            onClick={() => {
                              formik.setFieldValue('our_team_image', '');
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
                  {formik.touched.our_team_image && formik.errors.our_team_image ? (
                    <div>{t(formik.errors.our_team_image)}</div>
                  ) : null}
                </div>
              </Col>
            </Row>
            <div className="primary-button">
              <span className="link-center" onClick={handleCancel}>
                {t('page.cancel_button_text')}
              </span>
              <TNButton
                type="submit"
                loading={isLoading}
                isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
                {t('page.save_button_text')}
              </TNButton>
            </div>
          </Form>
        </div>
      </Card>
    </>
  );
};
AddOurTeamPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default AddOurTeamPage;
