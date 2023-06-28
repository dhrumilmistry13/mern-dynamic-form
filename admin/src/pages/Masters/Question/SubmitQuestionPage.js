import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { Col, Row, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import validationSchema from './SubmitQuestionValidation';
import { useGetActiveQuestion, useStoreBasicQuestionData } from 'hooks';
import { TNButton } from 'common/components';
import { dateStringConvertDate } from 'helpers';
import { useNavigate } from 'react-router';

const SubmitQuestionPage = () => {
  const dobRef = useRef();
  const navigate = useNavigate();
  const initValues = {
    answers: [],
  };
  const { isLoading: isLoadingbasicQuestionData, data: basicQuestionData } = useGetActiveQuestion(
    ({ data }) => {
      initValues.answers = data.QuestionData;
    }
  );
  if (!isLoadingbasicQuestionData && basicQuestionData) {
    initValues.answers = basicQuestionData.data;
    initValues.answers.map((value) => {
      value.ans_val = '';
    });
  }

  /**
   * This function call on Form submit (Next button), API will call and user will be navigate to the next page
   */
  const { mutate: doAddBasicQuestionData, isLoadingSubmit } = useStoreBasicQuestionData(
    (response) => {
      if (response.data.success) {
        toast.success(response.message);
        navigate('/');
      } else {
        toast.success(response.message);
      }
    },
    (error) => {
      toast.error(error.message);
      navigate('/');
    }
  );

  const fromSubmit = (values) => {
    doAddBasicQuestionData(values);
  };

  const handleCancel = () => {
    navigate(`/`);
  };
  return (
    <Container>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h1 className="text-center">Fill The Form Details</h1>
          <h5 className="text-center">
            (Fields with <span className="text-danger">*</span> is required)
          </h5>
        </Col>
        {!isLoadingbasicQuestionData && (
          <Formik
            initialValues={initValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={fromSubmit}>
            {({
              handleSubmit,
              values,
              errors,
              touched,
              dirty,
              handleBlur,
              handleChange,
              setFieldValue,
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <FieldArray name="friends">
                      {() =>
                        values.answers.length > 0 &&
                        values.answers.map((answer, index) => {
                          const questionOPErrors = errors?.answers?.[index]?.ans_val || '';
                          const questionOPTouched = touched?.answers?.[index]?.ans_val || '';
                          const questionOptionErrors =
                            errors?.answers?.[index]?.user_question_ans_option || '';
                          const questionOptionTouched =
                            touched?.answers?.[index]?.user_question_ans_option || '';
                          const optionValue =
                            answer.question_options &&
                            answer.question_options.map((option) => {
                              return {
                                value: option.option_value,
                                label: option.option_value,
                              };
                            });
                          return (
                            <Col key={index} lg={6} md={6} sm={12} className="mt-3">
                              {answer.question_type === 1 && (
                                <div className="form-group">
                                  <label className="form-label" htmlFor={`friends.${index}.name`}>
                                    {answer.question}
                                    <span className={answer.is_required ? 'text-danger' : ''}>
                                      {answer.is_required ? ' *' : ''}
                                    </span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    name={`answers.${index}.ans_val`}
                                    placeholder={answer.question}
                                    type="text"
                                    value={values.answers[index].ans_val}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />
                                </div>
                              )}
                              {answer.question_type === 2 && (
                                <div className="form-group">
                                  <label className="form-label" htmlFor={`friends.${index}.name`}>
                                    {answer.question}
                                    <span className={answer.is_required ? 'text-danger' : ''}>
                                      {answer.is_required ? ' *' : ''}
                                    </span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    name={`answers.${index}.ans_val`}
                                    placeholder={answer.question}
                                    type="text"
                                    value={values.answers[index].ans_val}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    as="textarea"
                                  />
                                </div>
                              )}
                              {answer.question_type === 3 && (
                                <>
                                  <label className="form-label" htmlFor={`friends.${index}.name`}>
                                    {answer.question}
                                    <span className={answer.is_required ? 'text-danger' : ''}>
                                      {answer.is_required ? ' *' : ''}
                                    </span>
                                  </label>
                                  <Select
                                    className={'inner-page-dropdown '}
                                    name={`answers.${index}.ans_option`}
                                    options={optionValue}
                                    value={
                                      values.answers[index].ans_val !== ''
                                        ? optionValue.map((val) => {
                                            return values.answers[index].ans_val === val.value
                                              ? val
                                              : '';
                                          })
                                        : ''
                                    }
                                    onChange={(e) => {
                                      setFieldValue(`answers.${index}.ans_val`, e.value);
                                    }}
                                    onBlur={handleBlur}
                                  />
                                </>
                              )}
                              {answer.question_type === 4 && (
                                <>
                                  <label>
                                    <span>{answer.question}</span>
                                  </label>
                                  <input
                                    type="hidden"
                                    name={`answers.${index}.ans_val`}
                                    // value={values.answer[index].ans_val}
                                  />
                                  <br></br>
                                  {answer.question_options &&
                                    answer.question_options.map((option, i) => {
                                      return (
                                        <div
                                          className="form-check form-check-inline"
                                          key={option.option_value}>
                                          <input
                                            className="form-check-input"
                                            name={`answers.${index}.radio.${index}`}
                                            type="radio"
                                            value={option.option_value}
                                            onChange={(e) => {
                                              setFieldValue(
                                                `answers.${index}.ans_val`,
                                                `${
                                                  values.answers[index].ans_val != ''
                                                    ? `${values.answers[index].ans_val},`
                                                    : ''
                                                }${e.target.value}`
                                              );
                                              handleChange(e);
                                            }}
                                          />
                                          <label
                                            key={option.option_value}
                                            htmlFor={`answers.${index}.checkbox.${i}`}>
                                            <span>{option.option_value}</span>
                                          </label>
                                        </div>
                                      );
                                    })}
                                  <div className="form-field-error-text">
                                    {questionOptionTouched &&
                                    questionOptionErrors &&
                                    typeof questionOptionErrors === 'string' ? (
                                      <div className="input-error-message">
                                        {questionOptionErrors}
                                      </div>
                                    ) : null}
                                  </div>
                                </>
                              )}
                              {answer.question_type === 5 && (
                                <>
                                  <label>
                                    <span>{answer.question}</span>
                                  </label>
                                  <br></br>
                                  {answer.question_options &&
                                    answer.question_options.map((option, i) => {
                                      return (
                                        <div
                                          className="form-check form-check-inline"
                                          key={option.option_value}>
                                          <input
                                            className="form-check-input"
                                            name={`answers.${index}.checkbox.${i}`}
                                            type="checkbox"
                                            value={option.option_value}
                                            onChange={(e) => {
                                              setFieldValue(
                                                `answers.${index}.ans_val`,
                                                `${
                                                  values.answers[index].ans_val != ''
                                                    ? `${values.answers[index].ans_val},`
                                                    : ''
                                                }${e.target.value}`
                                              );
                                              handleChange(e);
                                            }}
                                          />
                                          <label
                                            key={option.option_value}
                                            htmlFor={`answers.${index}.checkbox.${i}`}>
                                            <span>{option.option_value}</span>
                                          </label>
                                        </div>
                                      );
                                    })}
                                  <div className="form-field-error-text">
                                    {questionOptionTouched &&
                                    questionOptionErrors &&
                                    typeof questionOptionErrors === 'string' ? (
                                      <div className="input-error-message">
                                        {questionOptionErrors}
                                      </div>
                                    ) : null}
                                  </div>
                                </>
                              )}
                              {answer.question_type === 7 && (
                                <>
                                  <label className="form-label" htmlFor={`friends.${index}.name`}>
                                    {answer.question}
                                    <span className={answer.is_required ? 'text-danger' : ''}>
                                      {answer.is_required ? ' *' : ''}
                                    </span>
                                  </label>
                                  <div className="custom-datepicker">
                                    <DatePicker
                                      className="form-control"
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      placeholderText={answer.label}
                                      name={`answers.${index}.ans_val`}
                                      ref={dobRef}
                                      maxDate={new Date()}
                                      selected={
                                        values.answers[index].ans_val &&
                                        new Date(values.answers[index].ans_val)
                                      }
                                      onChange={(date) => {
                                        setFieldValue(
                                          `answers.${index}.ans_val`,
                                          `${dateStringConvertDate(date)} 00:00:00`
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="form-field-error-text">
                                {questionOPTouched && questionOPErrors ? (
                                  <div className="input-error-message">{questionOPErrors}</div>
                                ) : null}
                              </div>
                            </Col>
                          );
                        })
                      }
                    </FieldArray>
                  </Row>
                  <div className="inner-page-button mt-3">
                    <TNButton
                      className="inner-button section-button"
                      type="submit"
                      isdirtyform={dirty.toString()}
                      loading={isLoadingSubmit}>
                      Submit
                    </TNButton>
                    <button className="btn btn-danger" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </Row>
    </Container>
  );
};
SubmitQuestionPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default SubmitQuestionPage;
