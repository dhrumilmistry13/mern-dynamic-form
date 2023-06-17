import React, { useEffect, useState } from 'react';
import { Card, Container, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { ReactComponent as DownloadIcon } from 'assets/images/download.svg';
import { useGetMedicalResponse } from 'hooks';
import { settingData } from 'store/features/settingSlice';
import 'assets/scss/page/view_question_response.scss';
import { TNBreadCurm } from 'common/components';
import TabsNavBar from './TabsNavBar';
import { ReactComponent as BackIcon } from 'assets/images/previous-arrow.svg';

const ViewMedicalQuestions = ({ t }) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const { order_id, formulary_id, user_id } = useParams();
  const checkAdminData = useSelector(settingData);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, ![modalShow, modalImgUrl]);
  let intakeResponse = [];

  /**
   * !This API will call while Page Load and set data. Once data load we are Get Medical Response
   */
  const { isLoading: isLoadingIntake, data: intake_respobse } = useGetMedicalResponse(
    { order_id, formulary_id, user_id },
    (data) => {
      intakeResponse =
        data.length > 0 &&
        data
          .map((question) => {
            if (question.user_question_ans_id !== 0) {
              return {
                label: question.label,
                question_type: question.question_type,
                ans_value: question.ans_value,
                option_value:
                  question.user_question_ans_option &&
                  question.user_question_ans_option
                    .map((val) => {
                      if (val.is_new === 2 && val.user_question_ans_id !== 0) {
                        return val.option_value;
                      }
                    })
                    .filter((val) => val !== undefined),
              };
            } else {
              return 0;
            }
          })
          .filter((val) => val !== 0);
    }
  );
  if (!isLoadingIntake && intake_respobse) {
    intakeResponse =
      intake_respobse.data.length > 0 &&
      intake_respobse.data
        .map((question) => {
          if (question.user_question_ans_id !== 0) {
            return {
              label: question.label,
              question_type: question.question_type,
              ans_value: question.ans_value,
              option_value:
                question.user_question_ans_option &&
                question.user_question_ans_option
                  .map((val) => {
                    if (val.is_new === 2 && val.user_question_ans_id !== 0) {
                      return val.option_value;
                    }
                  })
                  .filter((val) => val !== undefined),
            };
          } else {
            return 0;
          }
        })
        .filter((val) => val !== 0);
  }
  /**
   * BreadCum Labels and Links
   */
  const breadcurmArray = [
    {
      label: t('page.patient_details_label'),
      link: '/patient/list',
      active: '',
    },
    {
      label: t('page.view_patient_chart_detail_patient_label'),
      link: `/patient/chart/${user_id}`,
      active: '',
    },
    {
      label: t('page.patient_medical_intake_response_label'),
      link: '',
      active: 'active',
    },
  ];
  return (
    <Container className="orders-response-container">
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <div className="questions">
        <Card className="questions-card">
          <div className="inner-section-content">
            <div className="inner-previous-icon">
              <BackIcon className="custom-icon" onClick={() => navigate(-1)} />
              <Card.Title className="questions-card-title ">
                {t('page.patient_medical_intake_response_view_title')}
              </Card.Title>
            </div>
          </div>
          <hr />
          {!isLoadingIntake ? (
            intakeResponse.length ? (
              <Row className="questions-lists">
                <ul className=" lists">
                  {!isLoadingIntake && intakeResponse.length > 0 ? (
                    intakeResponse.map((question, i) => {
                      let document_type = '';
                      if (question.question_type === 6) {
                        const documentTypeArr = question.ans_value
                          ?.split('?')[0]
                          ?.split('.')
                          ?.slice(-1);
                        if (['png', 'jpg', 'jpeg', 'avif', 'svg'].includes(documentTypeArr[0])) {
                          document_type = 1;
                        } else {
                          document_type = 2;
                        }
                      }
                      return (
                        <>
                          <li key={i} className="question-label">
                            <p>{question.label && question.label}</p>
                            {question.question_type === 6 ? (
                              question.ans_value !== '' &&
                              (document_type === 1 ? (
                                <div className="answer-img preview-image">
                                  <LazyLoadImage
                                    alt={question.ans_value}
                                    key={
                                      question.ans_value
                                        ? question.ans_value
                                        : checkAdminData.home_page_general_header_logo
                                    }
                                    placeholderSrc={checkAdminData.home_page_general_header_logo}
                                    className="img-fluid"
                                    src={
                                      question.ans_value
                                        ? question.ans_value
                                        : checkAdminData.home_page_general_header_logo
                                    }
                                    onClick={() => {
                                      setModalImgUrl(
                                        question.ans_value
                                          ? question.ans_value
                                          : checkAdminData.home_page_general_header_logo
                                      );
                                      setModalShow(true);
                                    }}
                                  />
                                  <Modal
                                    show={modalShow}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered>
                                    <Modal.Body className="text-center">
                                      <div className="close-popup">
                                        <FontAwesomeIcon
                                          icon={faClose}
                                          className="custom-icon"
                                          onClick={() => setModalShow(false)}
                                        />
                                      </div>
                                      <img
                                        className="text-center"
                                        src={modalImgUrl}
                                        alt="profile_img"
                                      />
                                    </Modal.Body>
                                  </Modal>
                                </div>
                              ) : (
                                <div className="align-self-center py-2">
                                  <br />
                                  <a
                                    href={question.ans_value}
                                    download
                                    className="download-link sub-text">
                                    <DownloadIcon className="heading-text download-icon me-2" />
                                    {t('page.patient_intake_response_download_file')}
                                  </a>
                                </div>
                              ))
                            ) : [3, 4, 5].includes(question.question_type) ? (
                              question.option_value &&
                              question.option_value.length > 0 &&
                              question.option_value.map((option, index) => (
                                <span key={index} className="sub-text question-answer">
                                  {option}
                                </span>
                              ))
                            ) : (
                              <span className="sub-text question-answer">
                                {question?.ans_value !== ''
                                  ? question.ans_value
                                  : t('page.patient_not_added_answer')}
                              </span>
                            )}
                          </li>
                          <hr />
                        </>
                      );
                    })
                  ) : (
                    <div className="page-not-found data-not-found">
                      <div className="error-page-text">
                        {t('page.patient_medical_intake_question_no_data_found_text')}
                      </div>
                      <div className="primary-button"></div>
                    </div>
                  )}
                </ul>
              </Row>
            ) : (
              <div className="page-not-found data-not-found">
                <div className="error-page-text">
                  {t('page.patient_medical_intake_question_no_data_found_text')}
                </div>
                <div className="primary-button"></div>
              </div>
            )
          ) : (
            <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
          )}
        </Card>
      </div>
    </Container>
  );
};
ViewMedicalQuestions.propTypes = {
  t: PropTypes.func,
};
export default ViewMedicalQuestions;
