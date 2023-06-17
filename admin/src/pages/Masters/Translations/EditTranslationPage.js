import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './AddTranslationValidation';
import { TNBreadCurm, TNButton } from 'common/components';
import { useUpdateTranslation, useViewTranslation } from 'hooks';

const EditTranslationPage = ({ t }) => {
  let { translation_id } = useParams();
  const navigate = useNavigate();

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      key: '',
      text: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      values.translation_id = translation_id;
      doUpdateTranslation(values);
    },
  });

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  useViewTranslation(translation_id, ({ data: translation }) => {
    if (translation) {
      formik.values.key = `${translation.group}.${translation.key}`;
      formik.values.text = translation.text;
    }
  });

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { mutate: doUpdateTranslation, isLoading } = useUpdateTranslation((response) => {
    toast.success(response.message);
    navigate('/translations/list');
  });
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.translation_list_label'),
      link: '/translations/list',
      active: '',
    },
    {
      label: t('page.edit_translation_label'),
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
                    navigate(`/translations/list`);
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
      navigate(`/translations/list`);
    }
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.edit_translation_label')}</h1>
        <div className="edit-profile-form">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.translation_key_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.key && formik.errors.key
                        ? 'form-field-error'
                        : formik.touched.key && !formik.errors.key
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="key"
                    readOnly={true}
                    placeholder={t('page.translation_key_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.key}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.key && formik.errors.key ? (
                      <div>{t(formik.errors.key)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.translation_language_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.language && formik.errors.language
                        ? 'form-field-error'
                        : formik.touched.language && !formik.errors.language
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="language"
                    readOnly={true}
                    placeholder={t('page.translation_language_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={'EN'}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.language && formik.errors.language ? (
                      <div>{t(formik.errors.language)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6} xs={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.translation_text_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.text && formik.errors.text
                        ? 'form-field-error'
                        : formik.touched.text && !formik.errors.text
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="text"
                    placeholder={t('page.translation_text_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.text}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.text && formik.errors.text ? (
                      <div>{t(formik.errors.text)}</div>
                    ) : null}
                  </div>
                </Form.Group>
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
EditTranslationPage.propTypes = {
  t: PropTypes.func,
};
export default EditTranslationPage;
