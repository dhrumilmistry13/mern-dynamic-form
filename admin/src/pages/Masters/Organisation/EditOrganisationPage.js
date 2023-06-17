import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './EditOrganisationValidation';
import { TNButton } from 'common/components/TNButton';
import {
  useGetCountryCodeList,
  useUpdateOrganisation,
  useViewOrganisation,
  useGetTimezoneList,
} from 'hooks';
import { TNBreadCurm } from 'common/components';
import { defaultValue, currencyFormatFloat } from 'helpers';

const EditOrganisationPage = ({ t }) => {
  const navigate = useNavigate();
  const [adminStatus, setAdminStatus] = useState();
  let { user_id } = useParams();
  /**
   * !This API will call when user click on Submit Button
   */
  const { mutate: doUpdateOrganisation, isLoading } = useUpdateOrganisation((response) => {
    toast.success(response.message);
    navigate('/organisation/list');
  });

  /**
   * This Is Custom Style to Select Component
   */
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'transperant',
      border: 'none ',
      boxShadow: 'none',
      borderRadius: '60px',
    }),
  };
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  useViewOrganisation(user_id, ({ data: organisation }) => {
    if (organisation) {
      formik.values.first_name = organisation.first_name;
      formik.values.last_name = organisation.last_name;
      formik.values.email = organisation.email;
      formik.values.phone = organisation.phone;
      formik.values.country_id = organisation.country_id;
      formik.values.timezone_id = organisation.timezone_id;
      formik.values.admin_status = organisation.admin_status;
      formik.values.user_status = organisation.user_status;
      formik.values.reason = organisation.reason;
      formik.values.is_insurance_required = organisation.is_insurance_required;
      formik.values.doctor_visit_fee = organisation.doctor_visit_fee;
      formik.values.telemedicine_platform_fee = organisation.telemedicine_platform_fee;
      setAdminStatus(organisation.admin_status);
    }
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      admin_status: '',
      phone: '',
      country_id: '',
      timezone_id: '',
      user_status: '',
      reason: '',
      is_insurance_required: '',
      doctor_visit_fee: '',
      telemedicine_platform_fee: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.warn('values', values);
      values.user_id = user_id;
      values.admin_status == 1 && (values.reason = '');
      doUpdateOrganisation(values);
    },
  });
  /**
   * Default Options for Status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**BreadCum Labels and Links */
  const breadcurmArray = [
    {
      label: t('page.organisation_list_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.edit_organisation_label'),
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
  /**
   * This api call will gives List of Timezone
   */
  const { isLoading: timezoneIsLoad, data: timezoneList } = useGetTimezoneList();
  const optionsTimezone = [];
  if (timezoneList !== undefined) {
    timezoneList.data.map((val) => {
      return optionsTimezone.push({
        value: val.timezone_id,
        label: val.text + ' (' + val.utc + ')',
      });
    });
  }
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box edit-org">
        <h1 className="page-heading-center">{t('page.edit_organisation_label')}</h1>
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
                    value={formik.values.last_name}
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
            <Row>
              <Col className={formik.values.admin_status == 1 && 'd-none'}>
                {adminStatus == 2 || formik.values.admin_status == 2 ? (
                  <Form.Group>
                    <Form.Label className="field-label field-label-top">
                      {t('page.organisation_reason_label')}
                    </Form.Label>
                    <Form.Control
                      className={
                        'form-field-height ' +
                        (formik.touched.reason && formik.errors.reason
                          ? 'form-field-error'
                          : formik.touched.reason && !formik.errors.reason
                          ? 'form-field-success'
                          : '')
                      }
                      type="text"
                      as="textarea"
                      name="reason"
                      placeholder={t('page.organisation_reason_placeholder')}
                      disabled={adminStatus == 2}
                      onChange={formik.handleChange}
                      onBlur={formik.onBlur}
                      value={formik.values.reason && formik.values.reason}
                    />
                    <div className="form-field-error-text">
                      {formik.touched.reason && formik.errors.reason ? (
                        <div>{t(formik.errors.reason)}</div>
                      ) : null}
                    </div>
                  </Form.Group>
                ) : (
                  ''
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organization_edit_profile_timezone_label')}
                  </Form.Label>

                  <Select
                    name="timezone_id"
                    value={defaultValue(optionsTimezone, formik.values.timezone_id)}
                    defaultValue={formik.values.timezone_id}
                    styles={selectStyles}
                    placeholder={t('page.organization_edit_profile_timezone_id_placeholder')}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        formik.setFieldValue('timezone_id', selectedOption.value);
                      } else {
                        formik.setFieldValue('timezone_id', '');
                      }
                    }}
                    className={
                      'contry-code auth-input-field profile-input profile-select form-control ' +
                      (formik.touched.timezone_id && formik.errors.timezone_id
                        ? 'form-field-error'
                        : formik.touched.timezone_id && !formik.errors.timezone_id
                        ? 'form-field-success'
                        : '')
                    }
                    options={timezoneIsLoad ? optionsTimezone : optionsTimezone}
                  />
                </Form.Group>
                <div className="form-field-error-text">
                  {formik.touched.country_id && formik.errors.timezone_id ? (
                    <div className="input-error-message">{t(formik.errors.timezone_id)}</div>
                  ) : null}
                </div>
              </Col>

              <Col lg={6} className="field-label field-label-top">
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.organisation_is_insurance_button')}
                  </Form.Label>
                  <Form.Check
                    type="switch"
                    name="is_insurance_required"
                    id="custom-switch"
                    checked={formik.values.is_insurance_required === 1 ? true : false}
                    onChange={(selectedOption) => {
                      console.warn('select', selectedOption.target.checked);
                      if (selectedOption.target.checked === true) {
                        formik.setFieldValue('is_insurance_required', 1);
                      } else {
                        formik.setFieldValue('is_insurance_required', 2);
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.doctor_visit_fees_lable_text')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height' +
                      (formik.touched.doctor_visit_fee && formik.errors.doctor_visit_fee
                        ? 'form-field-error'
                        : formik.touched.doctor_visit_fee && !formik.errors.doctor_visit_fee
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="doctor_visit_fee"
                    placeholder={t('page.doctor_visit_fee_placeholder')}
                    value={formik.values.doctor_visit_fee}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.setFieldValue('doctor_visit_fee', currencyFormatFloat(e));
                    }}
                    onKeyUp={currencyFormatFloat}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.doctor_visit_fee && formik.errors.doctor_visit_fee ? (
                      <div>{t(formik.errors.doctor_visit_fee)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.telemedicine_platform_fee')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field-height' +
                      (formik.telemedicine_platform_fee && formik.errors.telemedicine_platform_fee
                        ? 'form-field-error'
                        : formik.touched.telemedicine_platform_fee &&
                          !formik.errors.telemedicine_platform_fee
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="telemedicine_platform_fee"
                    placeholder={t('page.telemedicine_platform_fee_placeholder')}
                    value={formik.values.telemedicine_platform_fee}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.setFieldValue('telemedicine_platform_fee', currencyFormatFloat(e));
                    }}
                    onKeyUp={currencyFormatFloat}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.telemedicine_platform_fee &&
                    formik.errors.telemedicine_platform_fee ? (
                      <div>{t(formik.errors.telemedicine_platform_fee)}</div>
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
EditOrganisationPage.propTypes = {
  t: PropTypes.func,
};
export default EditOrganisationPage;
