import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import validationSchema from './AddOrganisationValidation';
import { TNButton } from 'common/components/TNButton';
import { useAddOrganisation, useGetCountryCodeList } from 'hooks';
import { TNBreadCurm } from 'common/components';
import { defaultValue } from 'helpers';

const AddOrganisationPage = ({ t }) => {
  const navigate = useNavigate();

  /**
   * !This API will call when user click on Submit Button
   */
  const { mutate: doAddOrganisation, isLoading } = useAddOrganisation((response) => {
    toast.success(response.message);
    navigate('/organisation/list');
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country_id: '',
      admin_status: '',
      user_status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      doAddOrganisation(values);
    },
  });
  /**
   * Default options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * BreadCum Label and Links
   */
  const breadcurmArray = [
    {
      label: t('page.organisation_list_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.add_organisation_label'),
      link: '/organisation/add',
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
                    navigate(`/organisation/list`);
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
      navigate(`/organisation/list`);
    }
  };
  /**
   * This api call will gives List of country code
   */
  const { isLoading: countryIsLoad, data: countryCodeList } = useGetCountryCodeList();

  const optionsCountry = [];
  if (countryCodeList !== undefined) {
    countryCodeList.data.map((val) => {
      return optionsCountry.push({
        value: val.country_id,
        label: val.phone_code + ' (' + val.name + ')',
      });
    });
  }
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.add_organisation_label')}</h1>
        <div className="edit-profile-form">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_first_name_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.first_name && formik.errors.first_name
                        ? 'form-field-error'
                        : formik.touched.first_name && !formik.errors.first_name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="first_name"
                    placeholder={t('page.organisation_first_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
                    value={formik.values.first_name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.first_name && formik.errors.first_name ? (
                      <div>{t(formik.errors.first_name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_last_name_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.last_name && formik.errors.last_name
                        ? 'form-field-error'
                        : formik.touched.last_name && !formik.errors.last_name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="last_name"
                    placeholder={t('page.organisation_last_name_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
                    value={formik.values.name}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.last_name && formik.errors.last_name ? (
                      <div>{t(formik.errors.last_name)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_email_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height ' +
                      (formik.touched.email && formik.errors.email
                        ? 'form-field-error'
                        : formik.touched.email && !formik.errors.email
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="email"
                    placeholder={t('page.organisation_email_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
                    value={formik.values.email}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.email && formik.errors.email ? (
                      <div>{t(formik.errors.email)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_phone_label')}
                  </Form.Label>
                  <Row>
                    <Col lg={6} xs={6}>
                      <Select
                        name="country_id"
                        value={defaultValue(optionsCountry, formik.values.country_id)}
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
                        options={countryIsLoad ? optionsCountry : optionsCountry}
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
                        placeholder={t('page.organisation_phone_placeholder')}
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
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_admin_status_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_status')}
                    options={options}
                    value={defaultValue(options, formik.values.admin_status)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('admin_status', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.admin_status && formik.errors.admin_status ? (
                      <div>{t(formik.errors.admin_status)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_user_status_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_status')}
                    options={options}
                    value={defaultValue(options, formik.values.user_status)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('user_status', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.user_status && formik.errors.user_status ? (
                      <div>{t(formik.errors.user_status)}</div>
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
AddOrganisationPage.propTypes = {
  t: PropTypes.func,
};
export default AddOrganisationPage;
