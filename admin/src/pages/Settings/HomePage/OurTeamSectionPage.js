import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import validationSchema from './OurTeamValidations';
import { useUpdateOurTeam, useViewOurTeam } from 'hooks';
import { TNButton } from 'common/components';
import SettingNavBar from './SettingNavBar';
import { fileToDataUri, s3BucketFileUpload } from 'helpers';

const OurTeamSectionPage = ({ t }) => {
  const navigate = useNavigate();
  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      home_page_our_team_header_title: '',
      home_page_our_team_header_sub_title: '',
      home_page_our_team_header_text: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateOurTeam(values);
    },
  });
  /**
   * This function will call on page load, and data will be set to the form fields
   */
  const { refetch: doViewOurTeam, isLoading: isLoadingData } = useViewOurTeam(
    ({ data: our_team }) => {
      if (our_team) {
        formik.values.home_page_our_team_header_title = our_team.home_page_our_team_header_title;
        formik.values.home_page_our_team_header_sub_title =
          our_team.home_page_our_team_header_sub_title;
        formik.values.home_page_our_team_header_text = our_team.home_page_our_team_header_text;
      }
    }
  );
  /**
   * This function will call on submit, and data will get updated
   */
  const { mutate: doUpdateOurTeam, isLoading } = useUpdateOurTeam((response) => {
    if (response.data.length > 0) {
      response.data.map(async (value) => {
        fileToDataUri(formik.values[value.fieldname]).then(async (dataUri) => {
          await s3BucketFileUpload(dataUri, formik.values[value.fieldname].type, value.uploadURL);
        });
      });
    }
    setTimeout(() => {
      toast.success(response.message);
      doViewOurTeam();
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
        <h1 className="page-heading-center"> {t('page.settings_home_page_our_team_label')}</h1>
        <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_our_team_header_title_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_our_team_header_title &&
                    formik.errors.home_page_our_team_header_title
                      ? 'form-field-error'
                      : formik.touched.home_page_our_team_header_title &&
                        !formik.errors.home_page_our_team_header_title
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_our_team_header_title"
                  placeholder={t('page.settings_home_page_our_team_header_title_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_our_team_header_title}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_our_team_header_title &&
                  formik.errors.home_page_our_team_header_title ? (
                    <div>{t(formik.errors.home_page_our_team_header_title)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_our_team_header_sub_title_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    'form-field ' +
                    (formik.touched.home_page_our_team_header_sub_title &&
                    formik.errors.home_page_our_team_header_sub_title
                      ? 'form-field-error'
                      : formik.touched.home_page_our_team_header_sub_title &&
                        !formik.errors.home_page_our_team_header_sub_title
                      ? 'form-field-success'
                      : '')
                  }
                  type="text"
                  name="home_page_our_team_header_sub_title"
                  placeholder={t('page.settings_home_page_our_team_header_sub_title_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_our_team_header_sub_title}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_our_team_header_sub_title &&
                  formik.errors.home_page_our_team_header_sub_title ? (
                    <div>{t(formik.errors.home_page_our_team_header_sub_title)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="field-label field-label-top">
                  {t('page.settings_home_page_our_team__description_label')}:
                </Form.Label>
                <Form.Control
                  className={
                    formik.touched.home_page_our_team_header_text &&
                    formik.errors.home_page_our_team_header_text
                      ? 'form-field-error'
                      : formik.touched.home_page_our_team_header_text &&
                        !formik.errors.home_page_our_team_header_text
                      ? 'form-field-success'
                      : ''
                  }
                  as="textarea"
                  rows={5}
                  type="text"
                  name="home_page_our_team_header_text"
                  placeholder={t('page.settings_home_page_our_team__description_placeholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.home_page_our_team_header_text}
                />
                <div className="form-field-error-text">
                  {formik.touched.home_page_our_team_header_text &&
                  formik.errors.home_page_our_team_header_text ? (
                    <div>{t(formik.errors.home_page_our_team_header_text)}</div>
                  ) : null}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <div className="primary-button">
            <Link to="#" className="link-center" onClick={handleCancel}>
              {t('page.settings_home_page_our_team_cancel_btn')}
            </Link>
            <TNButton
              type="submit"
              disabled={isLoadingData}
              loading={isLoading}
              isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
              {t('page.settings_home_page_our_team_submit_btn')}
            </TNButton>
          </div>
        </Form>
      </Card>
    </>
  );
};
OurTeamSectionPage.propTypes = {
  t: PropTypes.func,
};
export default OurTeamSectionPage;
