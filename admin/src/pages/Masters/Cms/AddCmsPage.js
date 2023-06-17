import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { CKEditor } from 'ckeditor4-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './AddCmsValidation';
import { TNButton } from 'common/components/TNButton';
import { useAddCms } from 'hooks';
import { TNBreadCurm } from 'common/components';
import { defaultValue } from 'helpers';
const AddCmsPage = ({ t }) => {
  const navigate = useNavigate();
  const [isSlug, setISSlug] = useState(true);

  /**
   * !This API will call when user click on Submit Button
   */
  const { mutate: doAddCms, isLoading } = useAddCms((response) => {
    toast.success(response.message);
    navigate('/cms/list');
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      slug: '',
      seo_meta_title: '',
      seo_meta_desc: '',
      description: '',
      is_active: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doAddCms(values);
    },
  });
  /**
   * options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.cms_list_label'),
      link: '/cms/list',
      active: '',
    },
    {
      label: t('page.add_cms_label'),
      link: '/cms/add',
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
                    navigate(`/cms/list`);
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
      navigate(`/cms/list`);
    }
  };

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.add_cms_label')}</h1>
        <div className="edit-profile-form">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Label className="field-label field-label-top">
                {t('page.cms_title_label')}
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
                placeholder={t('page.cms_title_placeholder')}
                onChange={formik.handleChange}
                onBlur={(event) => {
                  let title = event.currentTarget.value;
                  let url = title.replace(/[^a-z0-9\s]/gi, ' ').replace(/[_\s]/g, ' ');
                  url = url.replace(/  +/g, ' ').replace(/\s?$/, '');
                  url = url.split(' ').join('-').toLowerCase();
                  formik.setFieldValue('slug', url);
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
              <Form.Label className="field-label field-label-top">
                {t('page.cms_slug_label')}
              </Form.Label>
              <Form.Label className="field-label field-label-top float-end me-4">
                <FontAwesomeIcon
                  icon={isSlug == true ? faEdit : faClose}
                  onClick={() => {
                    setISSlug(isSlug === true ? false : true);
                  }}
                />
              </Form.Label>
              <Form.Control
                className={
                  'form-field-height ' +
                  (formik.touched.slug && formik.errors.slug
                    ? 'form-field-error'
                    : formik.touched.slug && !formik.errors.slug
                    ? 'form-field-success'
                    : '')
                }
                type="text"
                name="slug"
                readOnly={isSlug}
                placeholder={t('page.cms_slug_placeholder')}
                onChange={formik.handleChange}
                onBlur={(event) => {
                  let title = event.currentTarget.value;
                  let url = title.replace(/[^a-z0-9\s]/gi, ' ').replace(/[_\s]/g, ' ');
                  url = url.replace(/  +/g, ' ').replace(/\s?$/, '');
                  url = url.split(' ').join('-').toLowerCase();
                  formik.setFieldValue('slug', url);
                }}
                value={formik.values.slug}
              />
              <div className="form-field-error-text">
                {formik.touched.slug && formik.errors.slug ? (
                  <div>{t(formik.errors.slug)}</div>
                ) : null}
              </div>
              <a
                href={`https://${window.location.host.replace('admin.', '')}/${formik.values.slug}`}
                className="link-center">
                {`https://${window.location.host.replace('admin.', '')}/${formik.values.slug}`}
              </a>
            </Form.Group>
            <Form.Group>
              <Form.Label className="field-label field-label-top">
                {t('page.cms_description_label')}
              </Form.Label>
              <CKEditor
                onInstanceReady={({ editor }) => {
                  editor.setData(formik.values.description);
                }}
                onChange={(value) => {
                  formik.setFieldValue('description', value.editor.getData());
                }}
                config={{
                  allowedContent: true,
                }}
                name="description"
                initData={formik.values.description}
              />
            </Form.Group>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.cms_is_active_label')}
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
              <Col lg={6}></Col>
            </Row>
            <Form.Group>
              <Form.Label className="field-label field-label-top">
                {t('page.cms_seo_meta_title_label')}
              </Form.Label>
              <Form.Control
                className={
                  'form-field-height ' +
                  (formik.touched.seo_meta_title && formik.errors.seo_meta_title
                    ? 'form-field-error'
                    : formik.touched.seo_meta_title && !formik.errors.seo_meta_title
                    ? 'form-field-success'
                    : '')
                }
                type="text"
                name="seo_meta_title"
                placeholder={t('page.cms_seo_meta_title_placeholder')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.seo_meta_title}
              />
              <div className="form-field-error-text">
                {formik.touched.seo_meta_title && formik.errors.seo_meta_title ? (
                  <div>{t(formik.errors.seo_meta_title)}</div>
                ) : null}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="field-label field-label-top">
                {t('page.cms_seo_meta_desc_label')}
              </Form.Label>
              <Form.Control
                className={
                  formik.touched.seo_meta_desc && formik.errors.seo_meta_desc
                    ? 'form-field-error'
                    : formik.touched.seo_meta_desc && !formik.errors.seo_meta_desc
                    ? 'form-field-success'
                    : ''
                }
                as="textarea"
                rows={3}
                name="seo_meta_desc"
                placeholder={t('page.cms_seo_meta_desc_placeholder')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.seo_meta_desc}
              />
              <div className="form-field-error-text">
                {formik.touched.seo_meta_desc && formik.errors.seo_meta_desc ? (
                  <div>{t(formik.errors.seo_meta_desc)}</div>
                ) : null}
              </div>
            </Form.Group>

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
AddCmsPage.propTypes = {
  t: PropTypes.func,
};
export default AddCmsPage;
