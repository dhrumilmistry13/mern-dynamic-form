import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { useViewPatientOrganisationGD } from 'hooks';
import { defaultValue } from 'helpers';
import { settingData } from 'store/features/settingSlice';
import { TNButton } from 'common/components';

const ViewGeneralDetails = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const checkAdminData = useSelector(settingData);

  // Initial Values of General data of organisation and Patient
  let initialPatientValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone_code: '',
    phone: '',
    admin_status: '',
    user_status: '',
    profile_image: '',
    reason: '',
    user_reason: '',
  };
  let initialOrgValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone_code: '',
    phone: '',
    admin_status: '',
    user_status: '',
    profile_image: '',
    reason: '',
    user_reason: '',
    company_name: '',
    user_id: '',
  };
  const isObjDataEmpty = (obj) => {
    return Object.values(obj).every((d) => d === '');
  };

  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: data } = useViewPatientOrganisationGD({
    user_id,
  });
  if (!isLoadingData && data) {
    if (data.data.patientData && !isObjDataEmpty(data.data.patientData)) {
      initialPatientValues = {
        first_name: data.data.patientData.first_name,
        last_name: data.data.patientData.last_name,
        email: data.data.patientData.email,
        phone_code: data.data.patientData.phone_code,
        phone: data.data.patientData.phone,
        admin_status:
          data.data.patientData.admin_status !== ''
            ? data.data.patientData.admin_status === 1
              ? 1
              : 2
            : '',
        user_status:
          data.data.patientData.user_status !== ''
            ? data.data.patientData.user_status === 1
              ? 1
              : 2
            : '',
        profile_image: data.data.patientData.profile_image,
        reason: data.data.patientData.reason,
        user_reason: data.data.patientData.reason,
      };
    }
    if (data.data.oraganizationData && !isObjDataEmpty(data.data.oraganizationData)) {
      initialOrgValues = {
        user_id: data.data.oraganizationData.user_id,
        first_name: data.data.oraganizationData.first_name,
        last_name: data.data.oraganizationData.last_name,
        email: data.data.oraganizationData.email,
        phone_code: data.data.oraganizationData.phone_code,
        phone: data.data.oraganizationData.phone,
        company_name: data.data.oraganizationData.company_name,
        admin_status:
          data.data.oraganizationData.admin_status &&
          data.data.oraganizationData.admin_status !== ''
            ? data.data.oraganizationData.admin_status === 1
              ? 1
              : 2
            : '',
        user_status:
          data.data.oraganizationData.user_status !== ''
            ? data.data.oraganizationData.user_status === 1
              ? 1
              : 2
            : '',
        profile_image: data.data.oraganizationData.profile_image,
        reason: data.data.oraganizationData.reason,
        user_reason: data.data.oraganizationData.reason,
      };
    }
  }
  /**
   * Default options for status
   */
  const options = [
    { value: '', label: '' },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
    { value: 3, label: `${t('page.lock_active_status_name')}` },
  ];
  /**
   * !This block will call on click cancel, and user will be redirect to the listing page
   */
  const handleCancel = () => {
    navigate(`/patient/list`);
  };
  return (
    <>
      <Card className="inner-box">
        <h1 className="page-heading-center ">
          {t('page.patient_view_gereral_detail_patient_label')}
        </h1>
        {!isLoadingData ? (
          data.data && !isObjDataEmpty(initialPatientValues) ? (
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_first_name_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{initialPatientValues.first_name}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_last_name_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>
                        {initialPatientValues.last_name && initialPatientValues.last_name}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_admin_status_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{defaultValue(options, initialPatientValues.admin_status).label}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_user_status_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{defaultValue(options, initialPatientValues.user_status).label}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_email_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{initialPatientValues.email && initialPatientValues.email}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_phone_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>
                        {(initialPatientValues.phone_code || initialPatientValues.phone) &&
                          `+${initialPatientValues.phone_code} - ${initialPatientValues.phone}`}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {initialPatientValues.profile_image ? (
                  <Col lg={6}>
                    <Row>
                      <Col lg={4} xs={6}>
                        <Form.Label className="field-label">
                          {t('page.view_patient_profile_image_label')}
                        </Form.Label>
                      </Col>
                      <Col lg={1} xs={1} className={'divider'}>
                        :
                      </Col>
                      <Col lg={7} xs={5}>
                        {initialPatientValues.profile_image && (
                          <div className="answer-img preview-image">
                            <LazyLoadImage
                              alt={initialPatientValues.profile_image}
                              key={
                                initialPatientValues.profile_image
                                  ? initialPatientValues.profile_image
                                  : checkAdminData.home_page_general_header_logo
                              }
                              placeholderSrc={checkAdminData.home_page_general_header_logo}
                              className="img-fluid"
                              src={
                                initialPatientValues.profile_image
                                  ? initialPatientValues.profile_image
                                  : checkAdminData.home_page_general_header_logo
                              }
                              onClick={() => {
                                setModalImgUrl(
                                  initialPatientValues.profile_image
                                    ? initialPatientValues.profile_image
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
                                <img className="text-center" src={modalImgUrl} alt="profile_img" />
                              </Modal.Body>
                            </Modal>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  ''
                )}
                {initialPatientValues.admin_status == 2 && (
                  <Col lg={6}>
                    <Row>
                      <Col lg={4} xs={6}>
                        <Form.Label className="field-label">
                          {t('page.view_patient_reason_label')}
                        </Form.Label>
                      </Col>
                      <Col lg={1} xs={1} className={'divider'}>
                        :
                      </Col>
                      <Col lg={7} xs={5}>
                        <span>{initialPatientValues.reason && initialPatientValues.reason}</span>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </Card.Body>
          ) : (
            <h5 className="page-heading-center">{t('page.page.patient_no_data_found_text')}</h5>
          )
        ) : (
          <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
        )}
      </Card>
      <br />
      <Card className="inner-box">
        <h1 className="page-heading-center ">
          {t('page.patient_view_gereral_detail_organisation_label')}
        </h1>
        {!isLoadingData ? (
          data.data && !isObjDataEmpty(initialOrgValues) ? (
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_first_name_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{initialOrgValues.first_name}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_last_name_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{initialOrgValues.last_name && initialOrgValues.last_name}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_admin_status_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>
                        {
                          defaultValue(
                            options,
                            initialOrgValues.admin_status ? initialOrgValues.admin_status : ''
                          ).label
                        }
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_user_status_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{defaultValue(options, initialOrgValues.user_status).label}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_email_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>{initialOrgValues.email && initialOrgValues.email}</span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg={4} xs={6}>
                      <Form.Label className="field-label">
                        {t('page.view_patient_organisation_phone_label')}
                      </Form.Label>
                    </Col>
                    <Col lg={1} xs={1} className={'divider'}>
                      :
                    </Col>
                    <Col lg={7} xs={5}>
                      <span>
                        {(initialPatientValues.phone_code || initialPatientValues.phone) &&
                          `+${initialPatientValues.phone_code} - ${initialPatientValues.phone}`}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {initialOrgValues.profile_image ? (
                  <Col lg={6}>
                    <Row>
                      <Col lg={4} xs={6}>
                        <Form.Label className="field-label">
                          {t('page.view_patient_organisation_profile_image_label')}
                        </Form.Label>
                      </Col>
                      <Col lg={1} xs={1} className={'divider'}>
                        :
                      </Col>
                      <Col lg={7} xs={5}>
                        {initialOrgValues.profile_image && (
                          <div className="answer-img preview-image">
                            <LazyLoadImage
                              alt={initialOrgValues.profile_image}
                              key={
                                initialOrgValues.profile_image
                                  ? initialOrgValues.profile_image
                                  : checkAdminData.home_page_general_header_logo
                              }
                              placeholderSrc={checkAdminData.home_page_general_header_logo}
                              className="img-fluid profile-image"
                              src={
                                initialOrgValues.profile_image
                                  ? initialOrgValues.profile_image
                                  : checkAdminData.home_page_general_header_logo
                              }
                              onClick={() => {
                                setModalImgUrl(
                                  initialOrgValues.profile_image
                                    ? initialOrgValues.profile_image
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
                                <img className="text-center" src={modalImgUrl} alt="profile_img" />
                              </Modal.Body>
                            </Modal>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  ''
                )}
                {initialOrgValues.company_name !== '' && (
                  <Col lg={6}>
                    <Row>
                      <Col lg={4} xs={6}>
                        <Form.Label className="field-label">
                          {t('page.view_patient_organisation_company_name_label')}
                        </Form.Label>
                      </Col>
                      <Col lg={1} xs={1} className={'divider'}>
                        :
                      </Col>
                      <Col lg={7} xs={5}>
                        <span>
                          {initialOrgValues.company_name && initialOrgValues.company_name}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                )}
                {initialOrgValues.admin_status == 2 && (
                  <Col lg={6}>
                    <Row>
                      <Col lg={4} xs={6}>
                        <Form.Label className="field-label">
                          {t('page.view_patient_organisation_reason_label')}
                        </Form.Label>
                      </Col>
                      <Col lg={1} xs={1} className={'divider'}>
                        :
                      </Col>
                      <Col lg={7} xs={5}>
                        <span>{initialOrgValues.reason && initialOrgValues.reason}</span>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
              <div className="text-center my-2">
                <TNButton
                  className="table-primary-button"
                  onClick={() =>
                    navigate(`/organisation/general-details/${initialOrgValues.user_id}`)
                  }>
                  {t('page.view_organisation_details_action_button_text')}
                </TNButton>
              </div>
            </Card.Body>
          ) : (
            <h5 className="page-heading-center">{t('page.patient_data_not_found_text')}</h5>
          )
        ) : (
          <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
        )}
      </Card>
      <div className="primary-button">
        <span className="link-center" onClick={handleCancel}>
          {t('page.cancel_button_text')}
        </span>
      </div>
    </>
  );
};
ViewGeneralDetails.propTypes = {
  t: PropTypes.func,
};
export default ViewGeneralDetails;
