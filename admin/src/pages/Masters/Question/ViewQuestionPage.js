import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { TNBreadCurm } from 'common/components';
import { useViewQuestion } from 'hooks';
import { defaultValue } from 'helpers';

const ViewQuestionPage = ({ t }) => {
  const { question_id } = useParams();
  const navigate = useNavigate();

  // Initial Values
  let initialValues = {
    type: '',
    question_type: '',
    is_required: '',
    sequence: 0,
    status: '',
    question_options: [],
  };

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: question_data } = useViewQuestion(question_id);
  if (!isLoadingData && question_data) {
    initialValues = {
      label: question_data.data.label,
      type: question_data.data.type,
      question_type: question_data.data.question_type,
      is_required: question_data.data.is_required,
      sequence: question_data.data.sequence,
      status: question_data.data.status,
      question_options: question_data.data.question_options.map((value) => {
        return {
          option_value: value.option_value,
        };
      }),
    };
  }
  /**
   * Default Options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * Default Options for Question types
   */
  const optionType = [
    { value: '', label: `${t('page.question_type_select_label')}` },
    { value: 1, label: `${t('page.question_type_intake')}` },
    { value: 2, label: `${t('page.question_type_business')}` },
    { value: 5, label: `${t('page.question_type_patient_register')}` },
    { value: 6, label: `${t('page.question_type_patient_insurance')}` },
  ];
  /**
   * Default Options for Options Questions types
   */
  const optionQuestionType = [
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.question_question_type_text')}` },
    { value: 2, label: `${t('page.question_question_type_textarea')}` },
    { value: 3, label: `${t('page.question_question_type_dropdown')}` },
    { value: 4, label: `${t('page.question_question_type_radio')}` },
    { value: 5, label: `${t('page.question_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.question_question_type_upload')}` },
    { value: 7, label: `${t('page.question_question_type_date')}` },
    { value: 8, disabled: true, label: t('page.question_question_type_state_drop_down') },
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
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.question_list_label'),
      link: '/question/list',
      active: '',
    },
    {
      label: t('page.view_question_label'),
      link: '',
      active: 'active',
    },
  ];
  /**
   * This function will call on cancel button click, and user will be redirected to teh listing page
   */
  const handleCancel = () => {
    navigate(`/question/list`);
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">{t('page.view_question_label')}</h1>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Row>
                <Col lg={3} xs={6}>
                  <Form.Label className="field-label">{t('page.question_label_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1} className={'divider'}>
                  :
                </Col>
                <Col lg={8} xs={5}>
                  <span>{initialValues.label}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">{t('page.question_type_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{defaultValue(optionType, initialValues.type).label}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.question_question_type_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{defaultValue(optionQuestionType, initialValues.question_type).label}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.question_is_required_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{defaultValue(optionsRquired, initialValues.is_required).label}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">{t('page.question_status_label')}</Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{defaultValue(options, initialValues.status).label}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <Row>
                <Col lg={6} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.question_sequence_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1}>
                  :
                </Col>
                <Col lg={5} xs={5}>
                  <span>{initialValues.sequence}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          {[3, 4, 5].includes(initialValues.question_type) ? (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col lg={3} xs={6}>
                    <Form.Label className="field-label">
                      {t('page.question_question_options_label')}
                    </Form.Label>
                  </Col>
                  <Col lg={1} xs={1} className={'divider'}>
                    :
                  </Col>
                  <Col lg={8} xs={5}>
                    <span>
                      <ol className="ps-3">
                        {initialValues.question_options.map((value, key) => {
                          return <li key={key}>{value.option_value}</li>;
                        })}
                      </ol>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            ''
          )}
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
ViewQuestionPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default ViewQuestionPage;
