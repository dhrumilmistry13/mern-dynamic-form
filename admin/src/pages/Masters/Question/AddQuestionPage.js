import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Formik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import { TNBreadCurm, TNButton } from 'common/components';
import { useAddQuestion } from 'hooks';
import validationSchema from './AddQuestionValidation';
import { defaultValue } from 'helpers';

const AddQuestionPage = ({ t }) => {
  const navigate = useNavigate();
  const [isdirty, setIsDirty] = useState();

  /**
   * !This API will call when user click on Submit Button, and user will be redirected to the listing page
   */
  const { mutate: doStoreQuestion, isLoading } = useAddQuestion((response) => {
    toast.success(response.message);
    navigate('/question/list');
  });
  /**
   * Default Options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * Default Options for Options types
   */
  const optionType = [
    { value: '', label: `${t('page.question_type_select_label')}` },
    { value: 1, label: `${t('page.question_type_intake')}` },
    { value: 2, label: `${t('page.question_type_business')}` },
    { value: 5, label: `${t('page.question_type_patient_register')}` },
    { value: 6, label: `${t('page.question_type_patient_insurance')}` },
  ];

  /**
   * Default Options for Question types
   */
  const [optionQuestionType, setOptionQuestionType] = useState([
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.question_question_type_text')}` },
    { value: 2, label: `${t('page.question_question_type_textarea')}` },
    { value: 3, label: `${t('page.question_question_type_dropdown')}` },
    { value: 4, label: `${t('page.question_question_type_radio')}` },
    { value: 5, label: `${t('page.question_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.question_question_type_upload')}` },
    { value: 7, label: `${t('page.question_question_type_date')}` },
    { value: 8, disabled: true, label: t('page.question_question_type_state_drop_down') },
  ]);
  /**
   * Default Options for Options required or not
   */
  const optionsRquired = [
    { value: '', label: `${t('page.question_is_required_select_label')}` },
    { value: 1, label: `${t('page.question_is_required_yes')}` },
    { value: 2, label: `${t('page.question_is_required_no')}` },
  ];

  // Initial Values of form fields
  const initialValues = {
    label: '',
    type: '',
    question_type: '',
    is_required: '',
    sequence: 0,
    status: '',
    question_options: [],
  };
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.question_list_label'),
      link: '/question/list',
      active: '',
    },
    {
      label: t('page.add_question_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and will display alert
   */
  const handleCancel = () => {
    if (isdirty && isdirty !== undefined) {
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
                    navigate(`/question/list`);
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
      navigate(`/question/list`);
    }
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <h1 className="page-heading-center ">{t('page.add_question_label')}</h1>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              doStoreQuestion(values);
            }}>
            {({
              values,
              errors,
              touched,
              dirty,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => {
              const questionOptionErrors =
                (errors.question_options?.length && errors.question_options) || '';
              const questionOptionTouched =
                (touched.question_options?.length && touched.question_options) || '';
              setIsDirty(dirty);
              return (
                <Form className="edit-profile-form" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={12}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_label_label')}
                        </Form.Label>
                        <Form.Control
                          className={
                            'form-field-height ' +
                            (touched.label && errors.label
                              ? 'form-field-error'
                              : touched.label && !errors.label
                              ? 'form-field-success'
                              : '')
                          }
                          type="text"
                          name="label"
                          placeholder={t('page.question_label_placeholder')}
                          onChange={handleChange}
                          handleBlur={handleBlur}
                          value={values.label}
                        />
                        <div className="form-field-error-text">
                          {touched.label && errors.label ? <div>{t(errors.label)}</div> : null}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_type_label')}
                        </Form.Label>
                        <Select
                          placeholder={t('page.question_type_placeholder')}
                          options={optionType}
                          value={defaultValue(optionType, values.type)}
                          onChange={(selectedOption) => {
                            setFieldValue('type', selectedOption.value);
                            if (parseInt(selectedOption.value) === 5) {
                              setOptionQuestionType(
                                optionQuestionType.map((val) => {
                                  if (val.disabled) {
                                    val.disabled = false;
                                  } else {
                                    val.disabled = false;
                                  }
                                  return val;
                                })
                              );
                            } else {
                              setOptionQuestionType(
                                optionQuestionType.map((val) => {
                                  if (val.value === 8) {
                                    val.disabled = true;
                                  } else {
                                    val.disabled = false;
                                  }
                                  return val;
                                })
                              );
                            }
                          }}
                        />
                        <div className="form-field-error-text">
                          {touched.type && errors.type ? <div>{t(errors.type)}</div> : null}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_question_type_label')}
                        </Form.Label>
                        <Select
                          placeholder={t('page.question_question_type_placeholder')}
                          options={values.type === 5 ? optionQuestionType : optionQuestionType}
                          value={defaultValue(
                            values.type === 5 ? optionQuestionType : optionQuestionType,
                            values.question_type
                          )}
                          isOptionDisabled={(option) => option.disabled}
                          onChange={(selectedOption) => {
                            setFieldValue('question_type', selectedOption.value);
                            if (
                              [3, 4, 5].includes(selectedOption.value) &&
                              values.question_options.length === 0
                            ) {
                              values.question_options.push({ option_value: '' });
                            } else if ([1, 2, 6, 7].includes(selectedOption.value)) {
                              values.question_options = [];
                            }
                          }}
                        />
                        <div className="form-field-error-text">
                          {touched.question_type && errors.question_type ? (
                            <div>{t(errors.question_type)}</div>
                          ) : null}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_is_required_label')}
                        </Form.Label>
                        <Select
                          placeholder={t('page.question_is_required_placeholder')}
                          options={optionsRquired}
                          value={defaultValue(optionsRquired, values.is_required)}
                          onChange={(selectedOption) => {
                            setFieldValue('is_required', selectedOption.value);
                          }}
                        />
                        <div className="form-field-error-text">
                          {touched.is_required && errors.is_required ? (
                            <div>{t(errors.is_required)}</div>
                          ) : null}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_status_label')}
                        </Form.Label>
                        <Select
                          placeholder={t('page.question_status_placeholder')}
                          options={options}
                          value={defaultValue(options, values.status)}
                          onChange={(selectedOption) => {
                            setFieldValue('status', selectedOption.value);
                          }}
                        />
                        <div className="form-field-error-text">
                          {touched.status && errors.status ? <div>{t(errors.status)}</div> : null}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label className="field-label field-label-top">
                          {t('page.question_sequence_label')}
                        </Form.Label>
                        <Form.Control
                          className={
                            'form-field ' +
                            (touched.sequence && errors.sequence
                              ? 'form-field-error'
                              : touched.sequence && !errors.sequence
                              ? 'form-field-success'
                              : '')
                          }
                          type="text"
                          name="sequence"
                          placeholder={t('page.question_sequence_placeholder')}
                          onBlur={handleBlur}
                          value={values.sequence}
                          onChange={(e) => {
                            handleChange(e);
                            let sq = e.target.value;
                            if (sq !== '') {
                              if (isNaN(sq)) {
                                sq = '';
                                setFieldValue('sequence', values.sequence);
                              } else {
                                sq = e.target.value;
                                setFieldValue('sequence', e.target.value);
                                return sq;
                              }
                            }
                          }}
                        />
                        <div className="form-field-error-text">
                          {touched.sequence && errors.sequence ? (
                            <div>{t(errors.sequence)}</div>
                          ) : null}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {[3, 4, 5].includes(values.question_type) ? (
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <FieldArray
                          name="question_options"
                          render={(arrayHelpers) => (
                            <div>
                              {values.question_options && values.question_options.length > 0
                                ? values.question_options.map((question_option, index) => {
                                    const option_valueErrors =
                                      (errors.question_options?.length &&
                                        errors.question_options[index]?.option_value) ||
                                      '';
                                    const option_valueTouched =
                                      (touched.question_options?.length &&
                                        touched.question_options[index]?.option_value) ||
                                      '';
                                    return (
                                      <>
                                        <div key={'option_value-' + index}>
                                          <Row>
                                            <Col lg={12}>
                                              <Form.Group className="row-top">
                                                <Form.Label className="field-label">
                                                  {t('page.question_question_options_label')}
                                                </Form.Label>
                                                <div>
                                                  <Row>
                                                    <Col lg={8} xs={12}>
                                                      <Field
                                                        name={`question_options.${index}.option_value`}
                                                        placeholder={t(
                                                          'page.question_question_options_placeholder'
                                                        )}
                                                        type="text"
                                                        className={
                                                          'form-control form-field ' +
                                                          (option_valueTouched && option_valueErrors
                                                            ? ' form-field-error'
                                                            : option_valueTouched &&
                                                              !option_valueErrors
                                                            ? ' form-field-success'
                                                            : '')
                                                        }
                                                        value={question_option.option_value}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                      />
                                                      <div className="form-field-error-text">
                                                        {option_valueTouched &&
                                                        option_valueErrors ? (
                                                          <div>{t(option_valueErrors)}</div>
                                                        ) : null}
                                                      </div>
                                                    </Col>
                                                    <Col lg={4} xs={12}>
                                                      {index >= 2 && (
                                                        <Button
                                                          className="secondary-remove-button"
                                                          onClick={() =>
                                                            arrayHelpers.remove(index)
                                                          }>
                                                          {t(
                                                            'page.question_option_value_remove_btn'
                                                          )}
                                                        </Button>
                                                      )}
                                                    </Col>
                                                  </Row>
                                                </div>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </div>
                                      </>
                                    );
                                  })
                                : ''}
                              <Button
                                className={'secondary-add-button'}
                                onClick={() => arrayHelpers.push({ option_value: '' })}>
                                {t('page.question_option_value_add_btn')}
                              </Button>
                            </div>
                          )}
                        />
                        <div className="form-field-error-text">
                          {questionOptionTouched &&
                          typeof questionOptionErrors === 'string' &&
                          questionOptionErrors !== '' ? (
                            <div>{t(questionOptionErrors)}</div>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  <div className="primary-button">
                    <span className="link-center" onClick={handleCancel}>
                      {t('page.cancel_button_text')}
                    </span>
                    <TNButton
                      type="submit"
                      loading={isLoading}
                      isdirtyform={dirty && dirty !== undefined ? 1 : 0}>
                      {t('page.save_button_text')}
                    </TNButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Card>
    </>
  );
};
AddQuestionPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default AddQuestionPage;
