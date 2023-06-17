import React from 'react';
import PropTypes from 'prop-types';
import { setFormatDateAndTime, setFormatDate, currencyType } from 'helpers';
import {
  useGetAllNotes,
  useGetGeneralDetails,
  useGetPatientBasicDetails,
  useGetInsuranceDetails,
  usePatientAllOrders,
} from 'hooks';
import { Card, Col, Row } from 'react-bootstrap';
// import userIcon from 'assets/images/place-holder.png';
import { useSelector } from 'react-redux';
import { settingData } from 'store/features/settingSlice';
import 'assets/scss/page/_order_pages.scss';

const orderview = { color: ' #4d8481', fontSize: 14 };
const sectionTitle = { fontWeight: 700, fontSize: 22 };
const orderviewheading = { color: '#212529', fontSize: 14, marginBottom: 5 };
const noteFont = {
  fontWeight: 500,
  fontSize: 14,
  marginBottom: 5,
  color: ' #4d8481',
};
const noteDateFont = {
  fontWeight: 400,
  fontSize: 13,
};
const PdfChart = ({ t, user_id }) => {
  // const imagee =
  let orderData = {};
  let notes = {};
  const checkOrganization = useSelector(settingData);

  let generalDetails = [];
  let insuranceDetails = [];
  let basicDetails = [];

  const rxStatusShow = (item) => {
    if (item.rx_status === 1)
      return (
        <span className={'text-info'}>{t('page.admin_order_view_rx_status_pending_label')}</span>
      );
    else if (item.rx_status === 2)
      return (
        <span className={'text-primary'}>{t('page.admin_order_view_rx_status_accept_label')}</span>
      );
    else if (item.rx_status === 3)
      return (
        <span className={'text-danger'}>{t('page.admin_order_view_rx_status_reject_label')}</span>
      );
    else if (item.rx_status === 4)
      return <span className={'text-warning'}>{t('page.admin_order_view_rx_refund_label')}</span>;
    else if (item.rx_status === 5)
      return (
        <span className={'text-danger'}>{t('page.admin_order_view_rx_status_cancel_label')}</span>
      );
    else return '';
  };

  const preStatusShow = (item) => {
    if (item.pre_status === 1)
      return (
        <span className={'text-warning'}>
          {t('page.admin_order_view_pre_status_pending_patient_contact_label')}
        </span>
      );
    else if (item.pre_status === 2)
      return (
        <span className={'text-warning'}>
          {t('page.admin_order_view_pre_status_pending_patient_contact_insurance_label')}
        </span>
      );
    else if (item.pre_status === 3)
      return (
        <span className={'text-warning'}>
          {t('page.admin_order_view_pre_status_pending_patient_contact_shipping_label')}
        </span>
      );
    else if (item.pre_status === 4)
      return (
        <span className={'text-primary'}>
          {t('page.admin_order_view_pre_status_processed_shipped_label')}
        </span>
      );
    else if (item.pre_status === 5)
      return (
        <span className={'text-primary'}>
          {t('page.admin_order_view_pre_status_shipped_label')}
        </span>
      );
    else if (item.pre_status === 6)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_pre_status_closed_patient_cancelled_label')}
        </span>
      );
    else if (item.pre_status === 7)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_pre_status_closed_patient_no_response_label')}
        </span>
      );
    else if (item.pre_status === 8)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_pre_status_closed_patient_declined_therapy_label')}
        </span>
      );
    else if (item.pre_status === 9)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_pre_status_closed_prescriber_no_response_label')}
        </span>
      );
    else if (item.pre_status === 10)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_pre_status_closed_prescriber_cancelled_therapy_label')}
        </span>
      );
    else return '';
  };
  const orderStatusShow = (order) => {
    if (order.order_status === 1)
      return (
        <h5 className="add-caption border-0 text-info">
          {t('page.admin_org_order_view_order_status_draft_label')}
        </h5>
      );
    else if (order.order_status === 2)
      return (
        <h5 className="add-caption border-0 text-info">
          {t('page.admin_org_order_view_order_status_placed_label')}
        </h5>
      );
    else if (order.order_status === 3)
      return (
        <h5 className="add-caption border-0 text-warning">
          {t('page.admin_org_order_view_order_status_rx_accepted_label')}
        </h5>
      );
    else if (order.order_status === 4)
      return (
        <h5 className="add-caption border-0 text-warning">
          {t('page.admin_org_order_view_order_status_pharmacy_placed_label')}
        </h5>
      );
    else if (order.order_status === 5)
      return (
        <h5 className="add-caption border-0 text-primary">
          {t('page.admin_org_order_view_order_status_delivered_label')}
        </h5>
      );
    else if (order.order_status === 6)
      return (
        <h5 className="add-caption border-0 text-danger">
          {t('page.admin_org_order_view_order_status_canceled_label')}
        </h5>
      );
    else '';
  };
  const fillStatusShow = (item) => {
    if (item.transitionrx_fill_status === 1)
      return (
        <span className={'text-warning'}>
          {t('page.admin_order_view_fill_status_placed_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 2)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_status_replacement_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 3)
      return (
        <span className={'text-primary'}>{t('page.admin_order_view_fill_shipped_label')}</span>
      );
    else if (item.transitionrx_fill_status === 4)
      return (
        <span className={'text-danger'}>{t('page.admin_order_view_fill_cancelled_label')}</span>
      );
    else if (item.transitionrx_fill_status === 5)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_missing_rx_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 6)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_expired_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 7)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_too_soon_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 8)
      return (
        <span className={'text-danger'}>{t('page.admin_order_view_fill_exception_dob_label')}</span>
      );
    else if (item.transitionrx_fill_status === 9)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_name_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 10)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_address_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 11)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_rx_confirmation_label')}
        </span>
      );
    else if (item.transitionrx_fill_status === 12)
      return (
        <span className={'text-danger'}>
          {t('page.admin_order_view_fill_exception_pending_label')}
        </span>
      );
    else return '';
  };
  const { isLoading: isLoadingOrderList, data: Order_data } = usePatientAllOrders(
    { user_id: user_id },
    (data) => {
      orderData = data.order_list;
    }
  );
  if (!isLoadingOrderList && Order_data) {
    orderData = Order_data.data.order_list;
  }
  /**
   * Getting All notes added by Organisation In Order
   */
  const { isLoading: isLoadingNotes, data: notes_data } = useGetAllNotes(
    {
      user_id: user_id,
    },
    (data) => {
      notes = data.data.map((val) => {
        return val;
      });
    }
  );
  if (!isLoadingNotes && notes_data) {
    notes = notes_data.data;
  }
  const { isLoading: isLoadingGeneralDetails, data: general_details } = useGetGeneralDetails({
    user_id: user_id,
  });
  if (!isLoadingGeneralDetails && general_details) {
    generalDetails =
      general_details.data?.length >= 0 &&
      general_details.data?.map((data) => {
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
  const { isLoading: isLoadingInsuranceDetails, data: insurance_details } = useGetInsuranceDetails({
    user_id: user_id,
  });

  if (!isLoadingInsuranceDetails && insurance_details) {
    insuranceDetails =
      insurance_details.data?.length >= 0 &&
      insurance_details.data?.map((data) => {
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
  const { isLoading: isLoadingBasicDetails, data: basic_details } = useGetPatientBasicDetails(
    {
      user_id: user_id,
    },
    (data) => {
      basicDetails = data.data;
    }
  );

  if (!isLoadingBasicDetails && basic_details) {
    basicDetails = basic_details.data;
  }
  return (
    <Card className="card-with-box-shadow p-sm-3 border-0">
      <Card.Header className="text-black" style={{ fontSize: 26 }}>
        {t('page.patient_company_name_label_text')}
        {basicDetails.company_name}
      </Card.Header>
      <Card.Body>
        <Row>
          <Col lg={6}>
            <h5 className="chart-inner-heading py-3" style={sectionTitle}>
              {t('page.admin_patient_chart_patient_id_text')}
            </h5>
            <Card className="p-2 patient-chart-card body-card ">
              {!isLoadingBasicDetails ? (
                basicDetails && (
                  <div className="text-center align-items-center">
                    <p className="py-1 question-text">{`${basicDetails.first_name}  ${basicDetails.last_name}`}</p>
                  </div>
                )
              ) : (
                <div className="page-not-found">
                  <div className="error-page-text">{t('page.orders_loading_data_sub_text')}</div>
                </div>
              )}
            </Card>
            <h5 className="chart-inner-heading py-3 pt-4" style={sectionTitle}>
              {t('page.admin_patient_chart_insurance_details_lable')}
            </h5>
            <Card className="p-4 patient-chart-card body-card">
              {!isLoadingInsuranceDetails ? (
                insuranceDetails.length > 0 ? (
                  insuranceDetails.map((qandA, i) => {
                    const image = qandA.ans_value
                      ? qandA.ans_value
                      : checkOrganization.home_page_general_header_logo;
                    console.log('image', image);
                    return (
                      qandA.label != 'Upload your ID Card' && (
                        <Row key={i} className="py-1">
                          <Col sm={5} xs={5} className="question-text">
                            {qandA.label && qandA.label}
                          </Col>
                          <Col sm={1} xs={1}>
                            :
                          </Col>
                          <Col sm={6} xs={6} className="answer-text">
                            {[1, 2].includes(qandA.question_type)
                              ? qandA.ans_value
                              : [3, 4, 5].includes(qandA.question_type)
                              ? qandA?.option_value.length > 0 &&
                                qandA?.option_value.map((d, index) => {
                                  return <span key={index}>{d.option}</span>;
                                })
                              : qandA.question_type === 7
                              ? setFormatDate(qandA.ans_value)
                              : qandA.question_type === 6
                              ? ''
                              : ''}
                          </Col>
                        </Row>
                      )
                    );
                  })
                ) : (
                  <div className="page-not-found">
                    <div className="error-page-text">
                      <p>{t('page.admin_patient_chart__no_insurance_added_text')}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="page-not-found">
                  <div className="error-page-text">{t('page.orders_loading_data_sub_text')}</div>
                </div>
              )}
            </Card>
          </Col>
          <Col lg={6}>
            <h5 className="chart-inner-heading py-3" style={sectionTitle}>
              {t('page.admin_patine_chart_view_general_details_lable')}
            </h5>
            <Card className="p-4 patient-chart-card body-card">
              {!isLoadingGeneralDetails ? (
                generalDetails.length > 0 ? (
                  generalDetails.map((qandA, i) => {
                    return (
                      qandA.label != 'Upload your ID Card' && (
                        <Row key={i} className="py-1">
                          <Col sm={5} xs={5} className="question-text">
                            {qandA.label && qandA.label}
                          </Col>
                          <Col sm={1} xs={1}>
                            :
                          </Col>
                          <Col className="answer-text" sm={6} xs={6}>
                            {[1, 2, 8].includes(qandA.question_type)
                              ? qandA.ans_value
                                ? qandA.ans_value
                                : t('page.admin_patient_chart_general_detail_no_data')
                              : [3, 4, 5].includes(qandA.question_type)
                              ? qandA?.option_value.length > 0 &&
                                qandA?.option_value.map((d, index) => {
                                  return <span key={index}>{d.option}</span>;
                                })
                              : qandA.question_type === 7
                              ? setFormatDate(qandA.ans_value)
                              : qandA.question_type === 6
                              ? ''
                              : ''}
                          </Col>
                        </Row>
                      )
                    );
                  })
                ) : (
                  <div className="page-not-found">
                    <div className="error-page-text">
                      {t('page.patient_details_not_found_text')}
                    </div>
                  </div>
                )
              ) : (
                <div className="page-not-found">
                  <div className="error-page-text">{t('page.orders_loading_data_sub_text')}</div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card.Body>

      <Card.Body className="py-0">
        {notes && notes.length > 0 && (
          <>
            <h5 className="order-heading py-3" style={sectionTitle}>
              {t('page.patient_all_orders_notes_text')}
            </h5>
            <Card className="body-card">
              <Row className="order-details-note-section border-bottom-0 item-align-center">
                <div className="order-note bg-transparent order-notes-row">
                  <div
                    className="ps-3 pt-2 "
                    style={{
                      maxHeight: 'auto !important',
                      overflowX: 'unset !important',
                      overflowY: 'unset !important',
                    }}>
                    <p>{t('page.patient_orders_all_notes_text')}</p>
                    {!isLoadingNotes ? (
                      notes && notes.length > 0 ? (
                        notes.map((val, i) => {
                          return (
                            <div key={i} className="single-note border-bottom me-3 mt-2">
                              <div className="note-text ">
                                {val.note.includes('\n') ? (
                                  val.note.split('\n')?.map((d, i) => {
                                    return (
                                      <p className="question-text" style={noteFont} key={i}>
                                        {d}
                                      </p>
                                    );
                                  })
                                ) : (
                                  <p className="question-text" style={noteFont}>
                                    {val.note}
                                  </p>
                                )}
                                <span className="date mb-2 d-inline-block" style={noteDateFont}>
                                  {val.created_at && setFormatDateAndTime(val.created_at)}
                                </span>
                                <span className="px-2 mb-2 d-inline-block" style={noteDateFont}>
                                  {`( ${t('page.order_note_view_order_orderid_text')} -
                        ${val.order_id && val.order_id} )`}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="page-not-found">
                          <div className="error-page-text">
                            {t('page.no_order_notes_added_for_patient_text')}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="page-not-found">
                        <div className="error-page-text">
                          {t('page.orders_loading_data_sub_text')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Row>
            </Card>
          </>
        )}
      </Card.Body>
      <Card.Body className="py-0 mt-2">
        <h5 className="order-heading py-3" style={sectionTitle}>
          {t('page.patient_order_history_order_header_text')}
        </h5>
        {isLoadingOrderList ? (
          <div className="page-not-found">
            <div className="error-page-text">{t('page.orders_loading_data_sub_text')}</div>
          </div>
        ) : !isLoadingOrderList && Order_data ? (
          <>
            {orderData && orderData.length > 0 ? (
              orderData.map((order, i) => {
                const quantities = order.order_items.reduce((val, object) => {
                  return val + object.qty;
                }, 0);
                return (
                  <Card key={i} className="mt-2 mb-3 body-card">
                    <Card.Header className="order-inner-card p-3 item-align-center card-head-caption">
                      {orderStatusShow(order)}
                      <Row className="item-align-center">
                        <Col lg={7}>
                          <Row>
                            <Col lg={3} sm={4} xs={6} className="card-single-item">
                              <div className="order-view-details">
                                <div className="inner-card-header">
                                  <h4 style={orderviewheading}>
                                    {t('page.patient_order_view_order_received_text')}
                                  </h4>
                                  <span style={orderview}>{setFormatDate(order.created_at)}</span>
                                </div>
                              </div>
                            </Col>
                            <Col lg={3} sm={4} xs={6} className="card-single-item">
                              <div className="order-view-details">
                                <div className="inner-card-header">
                                  <h4 style={orderviewheading}>
                                    {t('page.patient_order_view_order_patient_name_text')}
                                  </h4>
                                  <span style={orderview}>
                                    {order.users &&
                                      `${order.users.first_name} ${order.users.last_name}`}
                                  </span>
                                </div>
                              </div>
                            </Col>
                            <Col lg={2} sm={4} xs={6} className="card-single-item">
                              <div className="order-view-details">
                                <div className="inner-card-header">
                                  <h4 style={orderviewheading}>
                                    {t('page.patient_order_view_order_patient_id_text')}
                                  </h4>
                                  <span style={orderview}>{user_id}</span>
                                </div>
                              </div>
                            </Col>
                            <Col lg={2} sm={4} xs={6} className="card-single-item">
                              <div className="order-view-details">
                                <div className="inner-card-header">
                                  <h4 style={orderviewheading}>
                                    {t('page.patient_order_view_patient_items_text')}
                                  </h4>
                                  <span style={orderview}>{quantities}</span>
                                </div>
                              </div>
                            </Col>
                            <Col lg={2} sm={4} xs={6} className="card-single-item">
                              <div className="order-view-details">
                                <div className="inner-card-header">
                                  <h4 style={orderviewheading}>
                                    {t('page.patient_order_details_total_amount_text')}
                                  </h4>
                                  <span style={orderview}>{`${currencyType()}${
                                    order.total_amount
                                  }`}</span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={5} className="px-sm-2 p-0">
                          <Row className="mobile-col-reverse my-2">
                            {/* <Col lg={7} md={6} className="mt-2">
                              {order.intake_question_count > 0 &&
                              order.user_intake_question_count > 0 &&
                              order.is_intake_question_fill === 1 ? (
                                <div className="feature-single-item d-flex justify-content-center">
                                  <a href={`/orders/order/${encryptValues(order.order_id)}`}>
                                    {t('page.patient_view_order_general_intake_text')}
                                  </a>
                                </div>
                              ) : (
                                ''
                              )}
                            </Col> */}
                            <Col lg={12} className="card-single-item pe-3">
                              <div className="order-details mb-1 text-md-end text-start">
                                <div className="order-id mb-2">
                                  {t('page.order_note_view_order_orderid_text')}
                                  {` #${order.order_id}`}
                                </div>
                                {/* <a
                                  href={`/orders/order-details/${encryptValues(order.order_id)}`}
                                  className="order-detail-link">
                                  {t('page.patient_view_order_details_button_text')}
                                </a> */}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Header>
                    {order.order_items &&
                      order.order_items.length > 0 &&
                      order.order_items.map((item, index) => (
                        <Card.Body
                          key={index}
                          style={{ borderColor: '#7c7979 !important' }}
                          className={`card-product-details ${
                            index !== order.order_items.length - 1 ? 'border-bottom' : ''
                          } `}>
                          <div className="inner-details">
                            <Row className="item-align-center">
                              <Col lg={5} md={6} className="card-single-item">
                                <div className="order-product-details" style={{ marginTop: 35 }}>
                                  <h3 style={{ color: '#212529', fontWeight: 400, fontSize: 28 }}>
                                    {item.formulary.name}
                                  </h3>
                                  {item.formulary.short_description && (
                                    <p className="fw-normal" style={{ fontSize: 14 }}>
                                      {item.formulary.short_description}
                                    </p>
                                  )}
                                  {/* {item.question_count > 0 &&
                                  item.use_question_count > 0 &&
                                  item.is_question_fill === 1 ? (
                                    <span
                                      onClick={() =>
                                        window.open(
                                          `/orders/order/${encryptValues(
                                            order.order_id
                                          )}/formulary/${encryptValues(item.formulary_id)}`
                                        )
                                      }
                                      className="view-link">
                                      {t('page.order_view_order_singleintake_response_text')}
                                    </span>
                                  ) : (
                                    ''
                                  )} */}
                                </div>
                              </Col>
                              <Col lg={2} md={3} className="text-center card-single-item">
                                <div
                                  className="qty-price mobile-flex-d-row"
                                  style={{ marginTop: 35 }}>
                                  <span
                                    className="qty-details"
                                    style={{
                                      color: '#212529',
                                      fontWeight: 400,
                                      fontSize: 20,
                                      display: 'inline-block',
                                      marginBottom: 10,
                                    }}>
                                    {t('page.patient_view_order_qty_text')} : {item.qty}
                                  </span>
                                  <br />
                                  <span
                                    className="price-details mt-1"
                                    style={{
                                      color: '#4d8481',
                                      fontWeight: 700,
                                      fontSize: 24,
                                    }}>{`$${item.sub_total}`}</span>
                                </div>
                              </Col>
                              <Col lg={3} className="card-single-item">
                                <div className="inner-card-header text-center">
                                  <h4>
                                    {t('page.admin_order_view_rx_status_label')}:{' '}
                                    {rxStatusShow(item)}
                                  </h4>
                                  {item.rx_status === 2 && item.pre_status ? (
                                    <>
                                      <h4>
                                        {t('page.admin_order_view_pre_status_label')}:{' '}
                                        {preStatusShow(item)}{' '}
                                        {item.transitionrx_fill_status ? (
                                          <span>/ {fillStatusShow(item)}</span>
                                        ) : null}
                                      </h4>
                                      {item.shipped_date && (
                                        <h4>
                                          {t('page.admin_order_view_shipped_date_label')}:{' '}
                                          <span className="text-primary">
                                            {setFormatDateAndTime(item.shipped_date)}
                                          </span>
                                        </h4>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Card.Body>
                      ))}
                  </Card>
                );
              })
            ) : (
              <div className="page-not-found">
                <div className="error-page-text">{t('page.admin_order_no_data_found_text')} </div>
              </div>
            )}
          </>
        ) : (
          ''
        )}
      </Card.Body>
    </Card>
  );
};
PdfChart.propTypes = {
  t: PropTypes.any,
  user_id: PropTypes.any,
};
export default PdfChart;
