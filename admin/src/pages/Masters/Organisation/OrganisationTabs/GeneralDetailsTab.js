import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { useViewOrganisation } from 'hooks';
import { defaultValue, imagePreviewFromik } from 'helpers';

const GeneralDetailsTab = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  // Initial Values of General data of organisation
  let initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    admin_status: '',
    user_status: '',
    profile_image: '',
    reason: '',
    npi_number: '',
    dob: '',
    user_reason: '',
    text: '',
  };
  /**
   * !This API will call when page set. When response came we are setting up data into the form
   */
  const { isLoading: isLoadingData, data: organisation } = useViewOrganisation(user_id);
  if (!isLoadingData && organisation) {
    initialValues = {
      first_name: organisation.data.first_name,
      last_name: organisation.data.last_name,
      email: organisation.data.email,
      admin_status: organisation.data.admin_status,
      user_status: organisation.data.user_status,
      profile_image: organisation.data.profile_image,
      reason: organisation.data.reason,
      user_reason: organisation.data.user_reason,
      text: organisation.data.text,
      is_insurance_required: organisation.data.is_insurance_required,
      doctor_visit_fee: organisation.data.doctor_visit_fee,
      telemedicine_platform_fee: organisation.data.telemedicine_platform_fee,
    };
  }
  /**
   * Default options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
    { value: 3, label: `${t('page.lock_active_status_name')}` },
  ];
  /**
   * !This block will call on click cancel, and user will be redirect to the listing page
   */
  const handleCancel = () => {
    navigate(`/organisation/list`);
  };
  return (
    <Card className="inner-box">
      <Card.Body>
        <h1 className="page-heading-center ">{t('page.view_gereral_detail_organisation_label')}</h1>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_first_name_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{initialValues.first_name}</span>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_last_name_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{initialValues.last_name && initialValues.last_name}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_admin_status_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{defaultValue(options, initialValues.admin_status).label}</span>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_user_status_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{defaultValue(options, initialValues.user_status).label}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_email_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{initialValues.email && initialValues.email}</span>
              </Col>
            </Row>
          </Col>
          {initialValues.profile_image ? (
            <Col lg={6}>
              <Row>
                <Col lg={4} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.organisation_profile_image_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1} className={'divider'}>
                  :
                </Col>
                <Col lg={7} xs={5}>
                  {initialValues.profile_image && (
                    <img
                      src={imagePreviewFromik(initialValues.profile_image)}
                      alt="profile-image"
                    />
                  )}
                </Col>
              </Row>
            </Col>
          ) : (
            ''
          )}
        </Row>
        <Row>
          {initialValues.admin_status == 2 && (
            <Col lg={6}>
              <Row>
                <Col lg={4} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.organisation_reason_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1} className={'divider'}>
                  :
                </Col>
                <Col lg={7} xs={5}>
                  <span>{initialValues.reason && initialValues.reason}</span>
                </Col>
              </Row>
            </Col>
          )}
          {initialValues.user_status == 2 && (
            <Col lg={6}>
              <Row>
                <Col lg={4} xs={6}>
                  <Form.Label className="field-label">
                    {t('page.organisation_user_reason_label')}
                  </Form.Label>
                </Col>
                <Col lg={1} xs={1} className={'divider'}>
                  :
                </Col>
                <Col lg={7} xs={5}>
                  <span>{initialValues.user_reason && initialValues.user_reason}</span>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_timezone_label')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                <span>{initialValues.text && initialValues.text}</span>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.organisation_is_insurance_required')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              <Col lg={7} xs={5}>
                {initialValues.is_insurance_required &&
                initialValues.is_insurance_required === 1 ? (
                  <span>{t('page.genral_details_insurence_on_lable')}</span>
                ) : (
                  <span>{t('page.genral_details_insurence_off_lable')} </span>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.doctor_visit_fees_lable_text')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              {initialValues.doctor_visit_fee ? (
                <Col lg={7} xs={5}>
                  <span>{initialValues.doctor_visit_fee}</span>
                </Col>
              ) : (
                <Col lg={7} xs={5}>
                  <span>{t('page.genral_details_no_data_text')}</span>
                </Col>
              )}
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={4} xs={6}>
                <Form.Label className="field-label">
                  {t('page.telemedicine_platform_fee')}
                </Form.Label>
              </Col>
              <Col lg={1} xs={1} className={'divider'}>
                :
              </Col>
              {initialValues.telemedicine_platform_fee ? (
                <Col lg={7} xs={5}>
                  <span>{initialValues.telemedicine_platform_fee}</span>
                </Col>
              ) : (
                <Col lg={7} xs={5}>
                  <span>{t('page.genral_details_no_data_text')}</span>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <div className="primary-button">
          <span className="link-center" onClick={handleCancel}>
            {t('page.cancel_button_text')}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};
GeneralDetailsTab.propTypes = {
  t: PropTypes.func,
};
export default GeneralDetailsTab;
