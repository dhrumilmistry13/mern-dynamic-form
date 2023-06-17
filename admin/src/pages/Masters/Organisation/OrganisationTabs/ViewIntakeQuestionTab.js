import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { useViewIntakeQuestions } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { defaultValue } from 'helpers';
import { TNBreadCurm } from 'common/components';

const ViewIntakeQuestionTab = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  // Initial Values for Intake Questions
  let intakeQuestions = {
    label: '',
    question_options: '',
    Question_type: '',
  };
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: intakeData } = useViewIntakeQuestions(user_id);
  if (!isLoadingData && intakeData) {
    intakeQuestions =
      intakeData.data?.length >= 0 &&
      intakeData.data?.map((data) => {
        let obj = {
          label: data.label,
          question_options: data.question_options,
          Question_type: data.question_type,
        };
        return obj;
      });
  }
  /**
   * Default options for questions types
   */
  const optionQuestionType = [
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.organisation_question_type_text')}` },
    { value: 2, label: `${t('page.organisation_question_type_textarea')}` },
    { value: 3, label: `${t('page.organisation_question_type_dropdown')}` },
    { value: 4, label: `${t('page.organisation_question_type_radio')}` },
    { value: 5, label: `${t('page.organisation_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.organisation_question_type_upload')}` },
  ];
  /**
   * !This block will call on click cancel, and user will be redirected to the listing page
   */
  const handleCancel = () => {
    navigate(`/organisation/list`);
  };
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.organisation_details_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.vew_intake_questions_organisation_label'),
      link: '',
      active: 'active',
    },
  ];

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">
            {t('page.vew_intake_questions_organisation_label')}
          </h1>
          <Row>
            {intakeQuestions?.length > 0 ? (
              intakeQuestions.map((queAndAns, i) => (
                <Col lg={12} key={i}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row>
                        <Col lg={1} xs={6}>
                          <Form.Label className="field-label">
                            {t('page.organisation_intake_question_label')} - {i + 1}
                          </Form.Label>
                        </Col>
                        <Col lg={1} xs={1} className="divider">
                          :
                        </Col>
                        <Col lg={9} xs={5}>
                          <>
                            <div className="field-label">
                              {queAndAns.label}
                              <span>
                                &nbsp;[&nbsp;
                                {defaultValue(optionQuestionType, queAndAns.Question_type).label}
                                &nbsp;]
                              </span>
                            </div>
                          </>
                        </Col>
                      </Row>
                      {queAndAns.question_options && queAndAns.question_options.length > 0 ? (
                        [3, 4, 5].includes(queAndAns.Question_type) ? (
                          <Row>
                            <Col lg={1} xs={6}>
                              <Form.Label className="field-label">
                                {t('page.organisation_intake_question_option_label')}
                              </Form.Label>
                            </Col>
                            <Col lg={1} xs={1} className="divider">
                              :
                            </Col>
                            <Col lg={9} xs={5}>
                              <span>
                                <ol className="ps-3">
                                  {queAndAns.question_options.map((value, key) => {
                                    return <li key={key}>{value.option_value}</li>;
                                  })}
                                </ol>
                              </span>
                            </Col>
                          </Row>
                        ) : (
                          ''
                        )
                      ) : (
                        ' '
                      )}
                    </Col>
                  </Row>
                </Col>
              ))
            ) : (
              <h5 className="page-heading-center">{t('page.organisation_no_data_found')}</h5>
            )}
          </Row>
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
ViewIntakeQuestionTab.propTypes = {
  t: PropTypes.func,
};
export default ViewIntakeQuestionTab;
