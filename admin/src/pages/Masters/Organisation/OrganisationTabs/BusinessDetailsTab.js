import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { useViewBusinessDetail, useViewPracticeQuestion } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { TNBreadCurm } from 'common/components';
import { checkAllValueEmptyInObj, imagePreviewFromik, urlToGetExnsion } from 'helpers';
import { setFormatDate } from 'helpers';

const BusinessDetailsTab = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  // Modal Image preview
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  //Initial Values for Practice Data, and business questions
  let practiceQuestion = {
    company_name: '',
    subdomain_name: '',
    state_name: '',
    organization_specialities: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    dob: '',
    npi_number: '',
  };
  let businessDetails = {
    ans_type: '',
    ans_value: '',
    label: '',
    option_value: '',
  };
  /**
   * This API will be called when page set, and response data will be set to the object of Practice Data
   */
  const { isLoading: isLoadingData, data: practiceData } = useViewPracticeQuestion(user_id);
  if (!isLoadingData && practiceData) {
    practiceQuestion = {
      company_name: practiceData.data.company_name,
      subdomain_name: practiceData.data.subdomain_name,
      state_name: practiceData.data.state_names?.split(','),
      organization_specialities: practiceData?.data?.organization_specialities,
      address: practiceData.data.address,
      city: practiceData.data.city,
      state: practiceData.data.state,
      postcode: practiceData.data.postcode,
      country: practiceData.data.country,
      dob: practiceData.data.users?.dob,
      npi_number: practiceData.data.npi_number,
    };
  }
  /**
   * This API will be called when page set, and response data will be set to the object of business Questions
   */
  const { isLoading: isLoadingPracticeData, data: businessData } = useViewBusinessDetail(user_id);
  if (!isLoadingPracticeData && businessData) {
    businessDetails =
      businessData.data?.length >= 0 &&
      businessData.data?.map((data) => {
        let obj = {
          ans_type: data.ans_type,
          ans_value: data.ans_value,
          label: data.question_text,
          option_value: data.user_question_ans_option,
          questions: data.questions,
        };
        return obj;
      });
  }
  /**
   * !This block will call on click cancel, and user will be navigate to the listing page
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
      label: t('page.view_business_details_organisation_label'),
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
            {t('page.view_practice_question_organisation_label')}
          </h1>
          {!checkAllValueEmptyInObj(practiceData) ? (
            <>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_comapny_name_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.company_name ? (
                        <span>{practiceQuestion.company_name}</span>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_company_url_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.subdomain_name ? (
                        <span>{practiceQuestion.subdomain_name}</span>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_states_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.state_name?.length > 0 &&
                        practiceQuestion.state_name.map((state, i) => (
                          <span key={i}>
                            {i + 1}. {state && state}
                            <br />
                          </span>
                        ))}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_specialities_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.organization_specialities?.length > 0 &&
                        practiceQuestion.organization_specialities?.map((item, i) => (
                          <span key={i}>
                            {item.specialities_type === 1
                              ? `${i + 1}. ${item.name}`
                              : `${i + 1}. ${item.typespecialities_other_text} (other)`}
                            <br />
                          </span>
                        ))}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_dob_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.dob ? (
                        <span>
                          {setFormatDate(practiceQuestion.dob) &&
                            setFormatDate(practiceQuestion.dob)}
                        </span>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_npi_number_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.npi_number ? (
                        <span>{practiceQuestion.npi_number}</span>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_address_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.address ? <span>{practiceQuestion.address}</span> : ''}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_city_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.city ? <span>{practiceQuestion.city}</span> : ''}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_state_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.state ? <span>{practiceQuestion.state}</span> : ''}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_postcode_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.postcode ? <span>{practiceQuestion.postcode}</span> : ''}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={5} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.organisation_country_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1}>
                      :
                    </Col>
                    <Col lg={6} xs={5}>
                      {practiceQuestion.country ? <span>{practiceQuestion.country}</span> : ''}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <h5 className="page-heading-center">{t('page.organisation_no_data_found')}</h5>
          )}
        </Card.Body>
      </Card>
      <br />
      <Card className="inner-box">
        <Card.Body>
          <h1 className="page-heading-center ">
            {t('page.view_business_details_organisation_label')}
          </h1>
          <Row>
            {businessDetails?.length > 0 ? (
              businessDetails.map((queAndAns, i) => {
                return (
                  <Col lg={6} key={i}>
                    <Row>
                      <Col lg={12} xs={6}>
                        <Form.Label className="field-label">
                          <span className="primary-color">
                            {t('page.organisation_business_question_label')} : &nbsp;
                          </span>
                          {queAndAns.label && queAndAns.label}
                        </Form.Label>
                      </Col>
                      <Col lg={12} xs={6}>
                        {queAndAns.ans_type === 1 ? (
                          <>
                            <span className="primary-color">
                              {t('page.organisation_business_answer_label')} : &nbsp;
                            </span>
                            <span>
                              {queAndAns.questions?.question_type === 6 ? (
                                urlToGetExnsion(queAndAns.ans_value) === 'pdf' ? (
                                  <a target="_blank" href={queAndAns.ans_value} rel="noreferrer">
                                    <span>
                                      <div className="preview-image">
                                        <img
                                          src={imagePreviewFromik(queAndAns.ans_value)}
                                          alt="profile_img"
                                        />
                                      </div>
                                    </span>
                                  </a>
                                ) : (
                                  <span>
                                    <div className="preview-image">
                                      <img
                                        src={imagePreviewFromik(queAndAns.ans_value)}
                                        alt="profile_img"
                                        onClick={() => {
                                          setModalImgUrl(queAndAns.ans_value);
                                          setModalShow(true);
                                        }}
                                      />
                                    </div>
                                  </span>
                                )
                              ) : (
                                queAndAns.ans_value && queAndAns.ans_value
                              )}
                            </span>
                          </>
                        ) : queAndAns.option_value.length > 0 ? (
                          <>
                            <Form.Label className="field-label">
                              <span className="primary-color">
                                {t('page.organisation_business_options_label')} :
                              </span>
                            </Form.Label>
                            <br />
                            {queAndAns.option_value.map((option, i) => (
                              <span key={i}>
                                {i + 1}. &nbsp;
                                {option.question_options.option_value &&
                                  option.question_options.option_value}
                                <br />
                              </span>
                            ))}
                          </>
                        ) : (
                          <span>null</span>
                        )}
                      </Col>
                    </Row>
                  </Col>
                );
              })
            ) : (
              <h5 className="page-heading-center">{t('page.organisation_no_data_found')}</h5>
            )}
          </Row>
        </Card.Body>
      </Card>
      <Modal show={modalShow} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="text-center">
          <div className="close-popup">
            <FontAwesomeIcon icon={faClose} onClick={() => setModalShow(false)} />
          </div>
          <img className="text-center" src={modalImgUrl} alt="profile_img" />
        </Modal.Body>
      </Modal>
      <div className="primary-button">
        <span className="link-center" onClick={handleCancel}>
          {t('page.cancel_button_text')}
        </span>
      </div>
    </>
  );
};
BusinessDetailsTab.propTypes = {
  t: PropTypes.func,
};
export default BusinessDetailsTab;
