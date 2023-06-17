import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import validationSchema from './AddEditStatesValidations';
import { TNButton } from 'common/components/TNButton';
import { useUpdateStatesMaster, useViewStatesMaster } from 'hooks';
import { TNBreadCurm } from 'common/components';
import { allowNumbersOnly, defaultValue } from 'helpers';

const EditStatesPage = ({ t }) => {
  const navigate = useNavigate();
  const { state_id } = useParams();

  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.state_list_label'),
      link: '/states/list',
      active: '',
    },
    {
      label: t('page.edit_state_list_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * !This API will call when user click on Submit Button, and user will be redirected to the listing page
   */
  const { mutate: doUseUpdateStatesMaster, isLoading } = useUpdateStatesMaster((response) => {
    toast.success(response.message);
    navigate('/states/list');
  });
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  useViewStatesMaster(state_id, ({ data: states }) => {
    if (states) {
      formik.values.name = states.name;
      formik.values.short_code = states.short_code;
      formik.values.sequence = states.sequence;
      formik.values.status = states.status.toString();
    }
  });

  /**
   * This Block will execute on Form Submit, provides form fields and validations for that
   */
  const formik = useFormik({
    initialValues: {
      name: '',
      short_code: '',
      sequence: '',
      status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      values.state_id = state_id;
      doUseUpdateStatesMaster(values);
    },
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
                    navigate(`/states/list`);
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
      navigate(`/states/list`);
    }
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center">{t('page.edit_state_list_label')}</h1>
        <div className="edit-profile-form">
          <Form className="edit-profile-form" onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.states_name_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.name && formik.errors.name
                        ? 'form-field-error'
                        : formik.touched.name && !formik.errors.name
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="name"
                    placeholder={t('page.states_name_placeholder')}
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
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.states_sequence_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.sequence && formik.errors.sequence
                        ? 'form-field-error'
                        : formik.touched.sequence && !formik.errors.sequence
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="sequence"
                    placeholder={t('page.states_sequence_placeholder')}
                    onChange={(e) => {
                      formik.setFieldValue('sequence', allowNumbersOnly(e));
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.sequence}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.sequence && formik.errors.sequence ? (
                      <div>{t(formik.errors.sequence)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.states_short_code_label')}
                  </Form.Label>
                  <Form.Control
                    className={
                      'form-field ' +
                      (formik.touched.short_code && formik.errors.short_code
                        ? 'form-field-error'
                        : formik.touched.short_code && !formik.errors.short_code
                        ? 'form-field-success'
                        : '')
                    }
                    type="text"
                    name="short_code"
                    placeholder={t('page.states_short_code_placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.short_code}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.short_code && formik.errors.short_code ? (
                      <div>{t(formik.errors.short_code)}</div>
                    ) : null}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="field-label field-label-top">
                    {t('page.states_status_label')}
                  </Form.Label>
                  <Select
                    placeholder={t('page.select_status')}
                    options={options}
                    value={defaultValue(options, formik.values.status)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('status', selectedOption.value);
                    }}
                  />
                  <div className="form-field-error-text">
                    {formik.touched.status && formik.errors.status ? (
                      <div>{t(formik.errors.status)}</div>
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
EditStatesPage.propTypes = {
  t: PropTypes.func,
};
export default EditStatesPage;
