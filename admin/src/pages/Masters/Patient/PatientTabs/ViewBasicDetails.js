import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import { useGetBasicDetails } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { defaultValue, setFormatDate } from 'helpers';
import { TNBreadCurm } from 'common/components';
import { ReactComponent as DownloadIcon } from 'assets/images/download.svg';
import { settingData } from 'store/features/settingSlice';

const ViewBasicDetails = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const checkAdminData = useSelector(settingData);

  // Initial Values for Basic Questions and Ans
  let basicDetails = {
    Question_type: '',
    label: '',
    ans_type: '',
    ans_value: '',
    is_required: '',
    option_value: '',
  };
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingBasciData, data: basicData } = useGetBasicDetails({ user_id });
  if (!isLoadingBasciData && basicData) {
    basicDetails =
      basicData.data?.length >= 0 &&
      basicData.data?.map((data) => {
        let document_type;
        if (data.question_type === 6) {
          const documentTypeArr = data.ans_value?.split('?')[0]?.split('.')?.slice(-1);
          if (['png', 'jpg', 'jpeg', 'avif', 'svg'].includes(documentTypeArr[0])) {
            document_type = 1;
          } else {
            document_type = 2;
          }
        }
        let obj = {
          question_type: data.question_type,
          label: data.label && data.label,
          ans_value: data.ans_value,
          is_required: data.is_required,
          ans_type: data.ans_type,
          document_type,
          option_value:
            data.user_question_ans_option &&
            data.user_question_ans_option
              .map((val) => {
                if (val.is_new === 2 && val.user_question_ans_id !== 0) {
                  return { option: val.option_value };
                }
              })
              .filter((val) => val !== undefined),
        };
        return obj;
      });
  }
  /**
   * Default options for questions types
   */
  const optionQuestionType = [
    { value: '', label: `${t('page.patient_question_question_type_select_label')}` },
    { value: 1, label: `${t('page.patient_question_type_text')}` },
    { value: 2, label: `${t('page.patient_question_type_textarea')}` },
    { value: 3, label: `${t('page.patient_question_type_dropdown')}` },
    { value: 4, label: `${t('page.patient_question_type_radio')}` },
    { value: 5, label: `${t('page.patient_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.patient_question_type_upload')}` },
    { value: 7, label: `${t('page.patient_question_type_date')}` },
    { value: 8, disabled: true, label: t('page.patient_question_type_state_drop_down') },
  ];
  /**
   * !This block will call on click cancel, and user will be redirected to the listing page
   */
  const handleCancel = () => {
    navigate(`/patient/list`);
  };
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
      label: t('page.view_basic_detail_patient_label'),
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
            {t('page.patient_basic_questions_and_ans_label')}
          </h1>
          {!isLoadingBasciData ? (
            basicData && basicDetails?.length > 0 ? (
              <Row>
                {basicDetails?.length > 0 ? (
                  basicDetails.map((queAndAns, i) => (
                    <Col lg={12} key={i}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Row>
                            <Col lg={1} xs={6}>
                              <Form.Label className="field-label">
                                {t('page.patient_basic_question_label')} - {i + 1}
                              </Form.Label>
                            </Col>
                            <Col lg={1} xs={1} className="divider">
                              :
                            </Col>
                            <Col lg={9} xs={5}>
                              <div className="field-label">
                                {queAndAns?.label && queAndAns?.label}
                                <span>
                                  &nbsp;[&nbsp;
                                  {defaultValue(optionQuestionType, queAndAns.question_type).label}
                                  &nbsp;]
                                </span>
                              </div>
                            </Col>
                          </Row>
                          {[3, 4, 5].includes(
                            queAndAns.question_type && queAndAns.question_type
                          ) ? (
                            queAndAns.option_value && queAndAns.option_value ? (
                              <Row>
                                <Col lg={1} xs={6}>
                                  <Form.Label className="field-label">
                                    {t('page.patient_basic_question_option_label')}
                                  </Form.Label>
                                </Col>
                                <Col lg={1} xs={1} className="divider">
                                  :
                                </Col>
                                <Col lg={9} xs={5}>
                                  <span>
                                    {queAndAns.option_value.length > 0
                                      ? queAndAns.option_value.map((value, key) => {
                                          return <li key={key}>{value.option}</li>;
                                        })
                                      : t('page.patient_not_added_answer')}
                                  </span>
                                </Col>
                              </Row>
                            ) : (
                              ''
                            )
                          ) : [1, 2, 7, 8].includes(
                              queAndAns.question_type && queAndAns.question_type
                            ) ? (
                            <Row>
                              <Col lg={1} xs={6}>
                                <Form.Label className="field-label">
                                  {t('page.patient_basic_question_answer_label')}
                                </Form.Label>
                              </Col>
                              <Col lg={1} xs={1} className="divider">
                                :
                              </Col>
                              <Col lg={9} xs={5}>
                                <span>
                                  {queAndAns?.ans_value !== ''
                                    ? queAndAns.question_type === 7
                                      ? setFormatDate(queAndAns.ans_value)
                                      : queAndAns.ans_value
                                    : t('page.patient_not_added_answer')}
                                </span>
                              </Col>
                            </Row>
                          ) : queAndAns.question_type === 6 ? (
                            <Row className="align-items-center">
                              <Col lg={1} xs={6}>
                                <Form.Label className="field-label">
                                  {t('page.patient_basic_question_answer_label')}
                                </Form.Label>
                              </Col>
                              <Col lg={1} xs={1} className="divider">
                                :
                              </Col>
                              {queAndAns.document_type === 1 ? (
                                <Col lg={9} xs={5}>
                                  <div className="answer-img preview-image">
                                    <LazyLoadImage
                                      alt={queAndAns?.ans_value}
                                      key={
                                        queAndAns?.ans_value
                                          ? queAndAns?.ans_value
                                          : checkAdminData.home_page_general_header_logo
                                      }
                                      placeholderSrc={checkAdminData.home_page_general_header_logo}
                                      className="img-fluid"
                                      src={
                                        queAndAns?.ans_value
                                          ? queAndAns?.ans_value
                                          : checkAdminData.home_page_general_header_logo
                                      }
                                      onClick={() => {
                                        setModalImgUrl(
                                          queAndAns?.ans_value
                                            ? queAndAns?.ans_value
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
                                </Col>
                              ) : (
                                <Col lg={9} xs={5} className="my-3">
                                  <a
                                    href={queAndAns.ans_value}
                                    download
                                    className="download-link sub-text">
                                    <DownloadIcon className="download-icon me-2" />
                                    {t('page.patient_basic_question_response_download_file')}
                                  </a>
                                </Col>
                              )}
                            </Row>
                          ) : (
                            ''
                          )}
                        </Col>
                      </Row>
                    </Col>
                  ))
                ) : (
                  <h5 className="page-heading-center">{t('page.patient_no_data_found')}</h5>
                )}
              </Row>
            ) : (
              <h5 className="page-heading-center">{t('page.patient_data_not_found_text')}</h5>
            )
          ) : (
            <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
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
ViewBasicDetails.propTypes = {
  t: PropTypes.func,
};
export default ViewBasicDetails;
