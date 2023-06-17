import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { useViewMedicalQuestions } from 'hooks';
import { defaultValue } from 'helpers';
import { TNBreadCurm } from 'common/components';
import TabsNavBar from '../Organisation/OrganisationTabs/TabsNavBar';

const MedicalQuestions = ({ t }) => {
  // This will get two different ids from url
  const { user_id } = useParams();
  const { formulary_id } = useParams();

  const navigate = useNavigate();
  // Questions object
  let MedicalQuestions = {
    label: '',
    question_options: '',
    Question_type: '',
  };
  /**
   * We are passing this object to the api call, with different ids required for it
   * based on from which page we're going to the Questions page.
   */
  let urlData = {};
  if (user_id === undefined || user_id === '') {
    urlData = {
      formulary_id: formulary_id,
      user_id: '',
    };
  } else {
    urlData = {
      formulary_id: formulary_id,
      user_id: user_id,
    };
  }
  /**
   * Default types of Questions
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
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: MedicalData } = useViewMedicalQuestions(
    urlData,
    ({ data: MedicalData }) => {
      if (MedicalData) {
        MedicalQuestions =
          MedicalData.length >= 0 &&
          MedicalData.map((data) => {
            let obj = {
              label: data.label,
              question_options: data.question_options,
              Question_type: data.question_type,
            };
            return obj;
          });
      }
    }
  );
  if (!isLoadingData && MedicalData) {
    MedicalQuestions =
      MedicalData.data?.length >= 0 &&
      MedicalData.data?.map((data) => {
        let obj = {
          label: data.label,
          question_options: data.question_options,
          Question_type: data.question_type,
        };
        return obj;
      });
  }
  /**
   * !This block will call on click cancel, and redirecting users to the page from where they have came
   */
  const handleCancel = () => {
    if (user_id === undefined || user_id === '') {
      navigate(`/formulary/list`);
    } else {
      navigate(`/organisation/formulary-details/${user_id}`);
    }
  };
  /**
   * BreadCums array is setting up based on the page of formulary question, or organisation formulary questions
   */
  let breadcurmArray;
  if (user_id === undefined || user_id === '') {
    breadcurmArray = [
      {
        label: t('page.formulary_list_label'),
        link: `/formulary/list`,
        active: '',
      },
      {
        label: t('page.vew_medical_question_label'),
        link: '',
        active: 'active',
      },
    ];
  } else {
    breadcurmArray = [
      {
        label: t('page.organisation_details_label'),
        link: `/organisation/list`,
        active: '',
      },
      {
        label: t('page.view_formulary_details_organisation_label'),
        link: `/organisation/formulary-details/${user_id}`,
        active: '',
      },
      {
        label: t('page.vew_medical_question_label'),
        link: '',
        active: 'active',
      },
    ];
  }
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      {user_id && <TabsNavBar user_id={user_id} t={t} />}
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">{t('page.vew_medical_question_label')}</h1>
          <Row>
            {MedicalQuestions?.length > 0 ? (
              MedicalQuestions.map((queAndAns, i) => (
                <Col lg={12} key={i}>
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
MedicalQuestions.propTypes = {
  t: PropTypes.func,
};
export default MedicalQuestions;
