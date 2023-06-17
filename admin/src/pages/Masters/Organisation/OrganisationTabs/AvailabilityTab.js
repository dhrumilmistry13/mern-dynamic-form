import React, { useState, useEffect } from 'react';
import { Container, Card, Tabs, Tab, Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { setFormatDate } from 'helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

import 'assets/scss/page/_availibility.scss';
import 'assets/scss/page/_intake_question_formulary.scss';
import ListView from './ListView';
import CalenderView from './CalenderView';
import { useGetAvailabilities } from 'hooks';
import TabsNavBar from './TabsNavBar';
import { TNBreadCurm } from 'common/components';
const AvailibilityPage = ({ t }) => {
  const { user_id } = useParams();
  const navigation = useNavigate();
  const [slotData, setSlotData] = useState();

  const [key, setKey] = useState('home');

  /**
   * !This block will call on click cancel, and user will be navigate to the listing page
   */
  const handleCancel = () => {
    navigation(`/organisation/list`);
  };

  /**
   * This is InitialValues object
   */
  const initialValues = {
    user_id,
    is_date_range: '',
    start_date: '',
    end_date: '',
    days_slot_1: [],
    days_slot_2: [],
    days_slot_3: [],
    days_slot_4: [],
    days_slot_5: [],
    days_slot_6: [],
    days_slot_7: [],
  };

  /**
   * This will run on page renders, and call api for Slot Data
   */
  useEffect(() => {
    doGetOrganisationSlot({ user_id });
  }, []);

  /**
   * !This API will call while Page Load and set data. Once data load get Avilability data
   */
  const { mutate: doGetOrganisationSlot, isLoading: loadingSlodData } = useGetAvailabilities(
    ({ data: slotData }) => {
      setSlotData(slotData);
    }
  );
  if (!loadingSlodData && slotData) {
    initialValues.is_date_range =
      slotData.orgAvailabilities !== '' ? slotData.orgAvailabilities.is_date_range : '';
    initialValues.start_date =
      slotData.orgAvailabilities !== '' ? slotData.orgAvailabilities.start_date : '';
    initialValues.end_date =
      slotData.orgAvailabilities !== '' ? slotData.orgAvailabilities.end_date : '';

    initialValues.days_slot_1 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 1).length > 0
        ? slotData.orgSlots
            .filter((v) => v.day === 1)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_1;
    initialValues.days_slot_2 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 2).length > 0
        ? slotData.orgSlots
            .filter((v) => v.day === 2)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_2;
    initialValues.days_slot_3 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 3).length
        ? slotData.orgSlots
            .filter((v) => v.day === 3)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_3;
    initialValues.days_slot_4 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 4).length
        ? slotData.orgSlots
            .filter((v) => v.day === 4)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_4;
    initialValues.days_slot_5 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 5).length
        ? slotData.orgSlots
            .filter((v) => v.day === 5)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_5;
    initialValues.days_slot_6 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 6).length
        ? slotData.orgSlots
            .filter((v) => v.day === 6)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_6;
    initialValues.days_slot_7 =
      slotData.orgSlots.length && slotData.orgSlots.filter((v) => v.day === 7).length
        ? slotData.orgSlots
            .filter((v) => v.day === 7)
            .map((slots) => {
              return {
                org_slot_id: slots.org_slot_id ? slots.org_slot_id : 0,
                is_closed: slots.is_closed === 1 ? 1 : 2,
                start_time:
                  slots.start_time !== ''
                    ? moment(slots.start_time, 'HH:mm').format('HH:mm A')
                    : '09:30',
                end_time:
                  slots.end_time !== ''
                    ? moment(slots.end_time, 'HH:mm').format('HH:mm A')
                    : '10:00',
                is_new: slots.org_slot_id ? 1 : 2,
                is_delete: 1,
              };
            })
        : initialValues.days_slot_7;
  }

  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.organisation_details_label'),
      link: '/organisation/list',
      active: '',
    },
    {
      label: t('page.view_availability_organisation_label'),
      link: '',
      active: 'active',
    },
  ];

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Container className="question_formulary_intake formulary-container availability-booking inner-section-container">
        <Card className="inner-card-section intake-editor-card pb-0">
          {/* heading with save n cancel button */}
          <div className="inner-head">
            <h1 className="inner-page-heading page-heading-center ">
              {t('page.admin_organisation_availibility_subheading_text')}
            </h1>
          </div>
          {/* Within A Date Range (radio button and date picker)  */}
          <div className="intake-editor-heading card-heading-section card-header-section">
            {initialValues.is_date_range === 2 ? (
              <Row className="w-100 booking-experience auth-inner-container ">
                <Col xxl={2} lg={3} md={12}>
                  <div className="mt-md-3 mb-md-4 ">
                    <Form.Label htmlFor="WithinDateRange" className="text-break">
                      {t('page.admin_organisation_availibility_radio_btn_within_date_range')}
                    </Form.Label>
                  </div>
                </Col>
                {initialValues.is_date_range === 2 && (
                  <>
                    <Col xxl={2} lg="3" md="6">
                      <Form.Group className="auth-form-group">
                        <div className="custom-datepicker">
                          <Form.Control
                            placeholder={t(
                              'page.admin_organisation_availibility_within_date_range_startdate_placeholder'
                            )}
                            disabled={true}
                            className={'form-control auth-input-field '}
                            value={setFormatDate(initialValues.start_date)}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xxl={2} lg="3" md="6">
                      <Form.Group className="auth-form-group">
                        <div className="custom-datepicker">
                          <Form.Control
                            placeholder={t(
                              'page.admin_organisation_availibility_within_date_range_enddate_placeholder'
                            )}
                            disabled={true}
                            className={'form-control auth-input-field '}
                            value={setFormatDate(initialValues.end_date)}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>
            ) : (
              ''
            )}
            {initialValues.is_date_range === 1 ? (
              <Row className="w-100 booking-experience auth-inner-container mt-lg-0 mt-3 ">
                <Col lg="4">
                  <div>
                    <Form.Label htmlFor="Indefinitely_Into_The_Future" className="text-break">
                      {t('page.admin_organisation_availibility_radio_btn_indefinitely')}
                    </Form.Label>
                  </div>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </div>
          <div className="setWeekly-hour-wrapper">
            <div className="intake-editor-heading card-heading-section card-header-section card-search-header">
              <div className="">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3">
                  <Tab
                    eventKey="home"
                    title={
                      <span>
                        <FontAwesomeIcon icon={faList} className="me-2" />
                        {t('page.admin_organisation_availibility_list_view_tab_text')}
                      </span>
                    }>
                    <ListView t={t} initialValues={initialValues} />
                  </Tab>
                  <Tab
                    eventKey="profile"
                    title={
                      <span>
                        <FontAwesomeIcon icon={faCalendar} className="me-2" />
                        {t('page.admin_organisation_availibility_calender_view_tab_text')}
                      </span>
                    }>
                    <CalenderView t={t} />
                  </Tab>
                </Tabs>
                <Col className="mt-4 d-flex justify-content-center gap-2">
                  <div className="primary-button">
                    <span className="link-center" onClick={handleCancel}>
                      {t('page.cancel_button_text')}
                    </span>
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
};
AvailibilityPage.propTypes = {
  t: PropTypes.func,
};
export default AvailibilityPage;
