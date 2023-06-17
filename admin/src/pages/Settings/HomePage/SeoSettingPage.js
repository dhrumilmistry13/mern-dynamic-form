import { React } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import { useFormik } from 'formik';

import validationSchema from './SeoSettingValidation';
import { useGetSettingSeoData, useStoreSettingSeoData } from 'hooks';
import { TNButton } from 'common/components/TNButton';
import 'assets/scss/page/_generalsetting.scss';
import SettingNavBar from './SettingNavBar';

const SeoSettingPage = ({ t }) => {
  const navigate = useNavigate();

  /**
   * This function will call on page load, and data will be set to the form fields
   */
  const { refetch: doViewHomeSeo, isLoading: isLoadingData } = useGetSettingSeoData(
    ({ data: home_data }) => {
      if (home_data) {
        formik.values.home_page_seo_title = home_data.home_page_seo_title;
        formik.values.home_page_seo_description = home_data.home_page_seo_description;
      }
    }
  );
  /**
   * This function will call on submit, and data will get updated
   */
  const { mutate: doStoreSettingData, isLoading } = useStoreSettingSeoData((response) => {
    toast.success(response.message);
    setTimeout(function () {
      doViewHomeSeo();
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
      home_page_seo_title: '',
      home_page_seo_description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      doStoreSettingData(values);
    },
  });

  return (
    <>
      <SettingNavBar t={t} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.home_setting_header_text')}</h1>
        <div className="settings">
          <div className="general-setting">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col lg={12}>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.home_setting_seo_title_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        'form-field-height ' +
                        (formik.touched.home_page_seo_title && formik.errors.home_page_seo_title
                          ? 'form-field-error'
                          : formik.touched.home_page_seo_title && !formik.errors.home_page_seo_title
                          ? 'form-field-success'
                          : '')
                      }
                      type="text"
                      name="home_page_seo_title"
                      placeholder={t('page.home_setting_seo_title_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_seo_title}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_seo_title && formik.errors.home_page_seo_title ? (
                        <div>{t(formik.errors.home_page_seo_title)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.home_setting_seo_description_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        formik.touched.home_page_seo_description &&
                        formik.errors.home_page_seo_description
                          ? 'form-field-error'
                          : formik.touched.home_page_seo_description &&
                            !formik.errors.home_page_seo_description
                          ? 'form-field-success'
                          : ''
                      }
                      as="textarea"
                      rows={3}
                      type="text"
                      name="home_page_seo_description"
                      placeholder={t('page.home_setting_seo_description_placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.home_page_seo_description}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.home_page_seo_description &&
                      formik.errors.home_page_seo_description ? (
                        <div>{t(formik.errors.home_page_seo_description)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                </Col>
                <div className="primary-button">
                  <span className="link-center" onClick={handleCancel}>
                    {t('page.home_setting_cancel_link')}
                  </span>
                  <TNButton
                    type="submit"
                    disabled={isLoadingData}
                    loading={isLoading}
                    isdirtyform={formik.dirty && formik.dirty !== undefined ? 1 : 0}>
                    {t('page.home_setting_save_button')}
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
SeoSettingPage.propTypes = {
  t: PropTypes.func,
  isdirtyform: PropTypes.any,
};
export default SeoSettingPage;
