import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CKEditor } from 'ckeditor4-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import { TNBreadCurm, TNButton } from 'common/components';
import { useAddEmailTemplate } from 'hooks';
import validationSchema from './AddEditTemplateValidation';

const AddEmailTemplatePage = ({ t }) => {
  const navigate = useNavigate();

  const [isEditable, setIsEditable] = useState(false);

  /**
   * !This API will call when user click on Submit Button
   */
  const { mutate: doUpdateEmailTemplate, isLoading } = useAddEmailTemplate((response) => {
    toast.success(response.message);
    navigate('/email-template/list');
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      email_template_key: '',
      subject: '',
      parameter: '',
      content: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doUpdateEmailTemplate(values);
    },
  });
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.email_template_list_label'),
      link: '/email-template/list',
      active: '',
    },
    {
      label: t('page.add_email_template_label'),
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
                    navigate(`/email-template/list`);
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
      navigate(`/email-template/list`);
    }
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center ">{t('page.add_email_template_label')}</h1>
        <div>
          <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.email_template_title_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.title && formik.errors.title
                        ? 'form-field-error'
                        : formik.touched.title && !formik.errors.title
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="title"
                    placeholder={t('page.email_template_title_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      let keyVal = e.currentTarget.value;
                      keyVal = keyVal
                        .trim()
                        .split(/[`!@#$%^&*()_+\-=[\]{};':"\\ |,.<>/?~]/)
                        .join('-')
                        .split(/-+/)
                        .join('-')
                        .toLowerCase();
                      formik.setFieldValue('email_template_key', keyVal);
                      formik.handleBlur(e);
                    }}
                    value={formik.values.title}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.title && formik.errors.title ? (
                      <div>{t(formik.errors.title)}</div>
                    ) : null}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="field-label field-label-top d-flex justify-content-between">
                    <p className="mb-0">{t('page.email_template_key_label')}</p>
                    <p className="float-end me-4 mb-0">
                      <FontAwesomeIcon
                        icon={isEditable == false ? faEdit : faClose}
                        onClick={() => {
                          setIsEditable(!isEditable);
                        }}
                      />
                    </p>
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.email_template_key && formik.errors.email_template_key
                        ? 'form-field-error'
                        : formik.touched.email_template_key && !formik.errors.email_template_key
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="email_template_key"
                    disabled={!isEditable}
                    placeholder={t('page.email_template_key_placeholder')}
                    value={formik.values.email_template_key}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      let keyVal = e.currentTarget.value;
                      keyVal = keyVal
                        .trim()
                        .split(/[`!@#$%^&*()_+\-=[\]{};':"\\ |,.<>/?~]/)
                        .join('-')
                        .split(/-+/)
                        .join('-')
                        .toLowerCase();
                      formik.setFieldValue('email_template_key', keyVal);
                      formik.handleBlur(e);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.email_template_key && formik.errors.email_template_key ? (
                      <div>{t(formik.errors.email_template_key)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.email_template_subject_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.subject && formik.errors.subject
                        ? 'form-field-error'
                        : formik.touched.subject && !formik.errors.subject
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="subject"
                    placeholder={t('page.email_template_subject_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subject}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.subject && formik.errors.subject ? (
                      <div>{t(formik.errors.subject)}</div>
                    ) : null}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.email_template_parameter_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.parameter && formik.errors.parameter
                        ? 'form-field-error'
                        : formik.touched.parameter && !formik.errors.parameter
                        ? 'form-field-success'
                        : '')
                    }
                    disabled
                    type="text"
                    name="parameter"
                    placeholder={t('page.email_template_parameter_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.parameter}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.parameter && formik.errors.parameter ? (
                      <div>{t(formik.errors.parameter)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.email_template_content_label')}
                  </Form.Label>
                  <CKEditor
                    onInstanceReady={({ editor }) => {
                      editor.setData(formik.values.content);
                    }}
                    name="content"
                    initData={formik.values.content}
                    config={{
                      allowedContent: true,
                    }}
                    onChange={(value) => {
                      const data = value.editor.getData();
                      formik.setFieldValue('content', data);
                    }}
                    onBlur={(value) => {
                      let paramStr = value.editor.getData();
                      paramStr = paramStr.split(/{{(.*?)}}/);
                      paramStr = paramStr.filter((a, i) => i % 2 === 1);
                      let uniqueParams = [...new Set(paramStr)].join(', ');
                      formik.setFieldValue('parameter', uniqueParams);
                    }}
                  />
                  <p className="my-2">
                    Please do not remove these <b> {formik.values.parameter}</b> parameters.
                  </p>
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
AddEmailTemplatePage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default AddEmailTemplatePage;
