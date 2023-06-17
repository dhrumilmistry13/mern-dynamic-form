import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Formik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';

import { TNBreadCurm, TNButton } from 'common/components';
import { useUpdateQuestion, useViewQuestion } from 'hooks';
import validationSchema from './EditQuestionValidation';
import { defaultValue } from 'helpers';

const EditQuestionPage = ({ t }) => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const [isdirty, setIsDirty] = useState();

  // Initial Values of form fields
  let initialValues = {
    label: '',
    type: '',
    question_type: '',
    is_required: '',
    sequence: 0,
    status: '',
    question_options: [],
  };
  /**
   * Default Options for Options Questions types
   */
  let optionQuestionType = [
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.question_question_type_text')}` },
    { value: 2, label: `${t('page.question_question_type_textarea')}` },
    { value: 3, label: `${t('page.question_question_type_dropdown')}` },
    { value: 4, label: `${t('page.question_question_type_radio')}` },
    { value: 5, label: `${t('page.question_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.question_question_type_upload')}` },
    { value: 7, label: `${t('page.question_question_type_date')}` },
  ];

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: question_data } = useViewQuestion(question_id);
  if (!isLoadingData && question_data) {
    if (parseInt(question_data.data.type) === 5) {
      optionQuestionType.push({
        value: 8,
        label: t('page.question_question_type_state_drop_down'),
      });
    } else {
      optionQuestionType = optionQuestionType.filter((val) => {
        return val.value !== 8;
      });
    }
    initialValues = {
      label: question_data.data.label,
      type: question_data.data.type,
      question_type: question_data.data.question_type,
      is_required: question_data.data.is_required,
      sequence: question_data.data.sequence,
      status: question_data.data.status,
      question_options: question_data.data.question_options.map((value) => {
        return {
          question_option_id: value.question_option_id,
          option_value: value.option_value,
          is_delete: 1,
          is_new: 1,
        };
      }),
    };
  }
  /**
   * !This API will call when user click on Submit Button, and user will be redirected to the listing page
   */
  const { mutate: doUpdateQuestion, isLoading } = useUpdateQuestion((response) => {
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
    // { value: 4, label: `${t('page.question_type_checkout')}` }
  ];
  /**
   * Default Options for Options required or not
   */
  const optionsRquired = [
    { value: '', label: `${t('page.question_is_required_select_label')}` },
    { value: 1, label: `${t('page.question_is_required_yes')}` },
    { value: 2, label: `${t('page.question_is_required_no')}` },
  ];
  /**
   * Default options for status
   */
  const breadcurmArray = [
    {
      label: t('page.question_list_label'),
      link: '/question/list',
      active: '',
    },
    {
      label: t('page.edit_question_label'),
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
        <h1 className="page-heading-center ">{t('page.edit_question_label')}</h1>
        <div>
          {!isLoadingData && (
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                values.question_id = question_id;
                doUpdateQuestion(values);
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
                setIsDirty(dirty);
                const questionOptionErrors =
                  (errors.question_options?.length && errors.question_options) || '';
                const questionOptionTouched =
                  (touched.question_options?.length && touched.question_options) || '';
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
                                optionQuestionType.push({
                                  value: 8,
                                  label: t('page.question_question_type_state_drop_down'),
                                });
                              } else {
                                optionQuestionType = optionQuestionType.filter((val) => {
                                  return val.value !== 8;
                                });
                              }
                            }}
                            isDisabled={true}
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
                            options={optionQuestionType}
                            value={defaultValue(optionQuestionType, values.question_type)}
                            onChange={(selectedOption) => {
                              setFieldValue('question_type', selectedOption.value);
                              if ([3, 4, 5].includes(selectedOption.value)) {
                                values.question_options.push({ option_value: '' });
                              }
                            }}
                            isDisabled={true}
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
                              'form-field' +
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
                                      return question_option.is_delete === 1 ? (
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
                                                            (option_valueTouched &&
                                                            option_valueErrors
                                                              ? ' form-field-error'
                                                              : option_valueTouched &&
                                                                !option_valueErrors
                                                              ? ' form-field-success'
                                                              : '')
                                                          }
                                                          value={
                                                            values.question_options[index]
                                                              .option_value
                                                          }
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
                                                              setFieldValue(
                                                                `question_options[${index}].is_delete`,
                                                                2
                                                              )
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
                                      ) : (
                                        ''
                                      );
                                    })
                                  : ''}
                                <Button
                                  className={'secondary-add-button'}
                                  onClick={() =>
                                    arrayHelpers.push({
                                      question_option_id: 0,
                                      option_value: '',
                                      is_delete: 1,
                                      is_new: 2,
                                    })
                                  }>
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
          )}
        </div>
      </Card>
    </>
  );
};
EditQuestionPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default EditQuestionPage;
