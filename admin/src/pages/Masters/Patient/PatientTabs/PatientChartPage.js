import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import { createGlobalStyle } from 'styled-components';

import 'assets/scss/page/_order_pages.scss';
import { usePatientOrders, useGetAllNotes } from 'hooks';
import { TNBreadCurm } from 'common/components';
import TabsNavBar from './TabsNavBar';
import Pagination from 'common/components/Pagination';
import { settingData } from 'store/features/settingSlice';
import { setFormatDate, setFormatDateAndTime, currencyType } from 'helpers';
import PdfChart from './PdfChart';

const Global = createGlobalStyle`
  /* paper.css */
  https://github.com/cognitom/paper-css

  /* @page { margin: 0 } */
  #print {
    width: 210mm;
    margin: 0;
    font-family: "IPAexGothic", sans-serif;
  }
  .sheet {
    margin: 0;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
  }
  .add-caption {
    position: absolute;
    background-color: #fff;
    top: -21px;
    padding: 0px 10px 6px 10px;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    border-radius:0;
    border: 0;
  }

  .patient-chart-card .question-text {
    color: #4d8481;
}
  
  /** Paper sizes **/
  #print.A3               .sheet { width: 297mm; height: 419mm }
  #print.A3.landscape     .sheet { width: 420mm; height: 296mm }
  #print.A4               .sheet { width: 210mm; height: 296mm }
  #print.A4.landscape     .sheet { width: 297mm; height: 209mm }
  #print.A5               .sheet { width: 148mm; height: 209mm }
  #print.A5.landscape     .sheet { width: 210mm; height: 147mm }
  #print.letter           .sheet { width: 216mm; height: 279mm }
  #print.letter.landscape .sheet { width: 280mm; height: 215mm }
  #print.legal            .sheet { width: 216mm; height: 356mm }
  #print.legal.landscape  .sheet { width: 357mm; height: 215mm }
  
  /** Padding area **/
  .sheet.padding-10mm { padding: 10mm }
  .sheet.padding-15mm { padding: 15mm }
  .sheet.padding-20mm { padding: 20mm }
  .sheet.padding-25mm { padding: 25mm }
  
  /** For screen preview **/
  @media screen {
    body {
      background: #E0E0E0;
      height: 100%;
    }
    .sheet {
      background: #FFFFFF;
      /* margin: 5mm auto; */
      padding: 5mm 0;
    }
  }
  
  /** Fix for Chrome issue #273306 **/
  @media print {
    #print.A3.landscape            { width: 420mm }
    #print.A3, #print.A4.landscape { width: 297mm }
    #print.A4, #print.A5.landscape { width: 210mm }
    #print.A5                      { width: 148mm }
    #print.letter, #print.legal    { width: 216mm }
    #print.letter.landscape        { width: 280mm }
    #print.legal.landscape         { width: 357mm }
  }

 
`;
const PatientChartPage = ({ t }) => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [printContent, setPrintContent] = useState();
  const [page, setPage] = useState(
    localStorage.adminPatientChartTable !== undefined && localStorage.adminPatientChartTable !== ''
      ? JSON.parse(localStorage.adminPatientChartTable).user_id === user_id
        ? JSON.parse(localStorage.adminPatientChartTable).page
        : 1
      : 1
  );
  useEffect(() => {
    let adminPatientChartTable = {
      page: page,
      user_id: user_id,
    };
    localStorage.adminPatientChartTable = JSON.stringify(adminPatientChartTable);
  }, [page]);

  const checkAdminData = useSelector(settingData);

  let orderData = {};
  let paginationData = {};
  let notes = {};

  const handleClick = () => {
    const doc = new jsPDF({
      format: 'a1',
      unit: 'px',
    });

    // Adding the fonts.

    doc.html(printContent, {
      async callback(doc) {
        await doc.save('document');
      },
      padding: [10, 30, 10, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 200, //target width in the PDF document
    });

    // var doc = new jsPDF();

    // doc.textWithLink('Click here', 10, 10, { url: 'http://www.google.com' });
    // doc.save('output.pdf');
  };
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
  const orderStatusShow = (order) => {
    console.warn('order chart', order);
    if (order.order_status === 1)
      return (
        <h4 className="add-caption text-info">
          {t('page.admin_org_order_view_order_status_draft_label')}
        </h4>
      );
    else if (order.order_status === 2)
      return (
        <h4 className="add-caption text-info">
          {t('page.admin_org_order_view_order_status_placed_label')}
        </h4>
      );
    else if (order.order_status === 3)
      return (
        <h4 className="add-caption text-warning">
          {t('page.admin_org_order_view_order_status_rx_accepted_label')}
        </h4>
      );
    else if (order.order_status === 4)
      return (
        <h4 className="add-caption text-warning">
          {t('page.admin_org_order_view_order_status_pharmacy_placed_label')}
        </h4>
      );
    else if (order.order_status === 5)
      return (
        <h4 className="add-caption text-primary">
          {t('page.admin_org_order_view_order_status_delivered_label')}
        </h4>
      );
    else if (order.order_status === 6)
      return (
        <h4 className="add-caption text-danger">
          {t('page.admin_org_order_view_order_status_canceled_label')}
        </h4>
      );
    else '';
  };
  const { isLoading: isLoadingOrderList, data: Order_data } = usePatientOrders(
    {
      page,
      user_id,
    },
    (data) => {
      orderData = data.order_list;
      paginationData = data.pagination;
    }
  );

  if (!isLoadingOrderList && Order_data) {
    orderData = Order_data.data.order_list;
    paginationData = Order_data.data.pagination;
  }
  if (!user_id) {
    setPage(1);
  }

  /**
   * Getting All notes added by Organisation In Order
   */
  const {
    // refetch,
    isLoading: isLoadingNotes,
    data: notes_data,
  } = useGetAllNotes(
    {
      user_id,
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
      link: '',
      active: 'active',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Container className="orderpage inner-section-container px-0 px-sm-2">
        <Card className="card-with-box-shadow">
          <div className="inner-section-content mb-3 inner-page-header-section d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="inner-previous-icon">
                <h4 className="order-heading">{t('page.patient_all_orders_notes_text')}</h4>
              </div>
            </div>
            <div className="inner-back-icon desktop-navigation-icons">
              <Button type="button" className="innner-header-button" onClick={handleClick}>
                {t('page.ptaient_chart_pdf_download')}
              </Button>
            </div>
          </div>
          <div className="">
            <Global />
            <div id="print" className="A4">
              <div
                style={{
                  position: 'fixed',
                  width: '1255px',
                  visibility: 'hidden',
                }}>
                <div
                  ref={(el) => {
                    setPrintContent(el);
                  }}>
                  <PdfChart t={t} user_id={user_id} />
                </div>
              </div>
            </div>
          </div>
          <Card className="body-card">
            <Row className="order-details-note-section item-align-center">
              <div className="order-note order-notes-row">
                <div className="all-notes ps-3 pt-2">
                  <p>{t('page.patient_orders_all_notes_text')}</p>
                  {!isLoadingNotes ? (
                    !isLoadingNotes && notes && notes.length > 0 ? (
                      notes.map((val, i) => {
                        return (
                          <div key={i} className="single-note">
                            <div className="note-text">
                              {val.note.includes('\n') ? (
                                val.note.split('\n')?.map((d, i) => {
                                  return <p key={i}>{d}</p>;
                                })
                              ) : (
                                <p>{val.note}</p>
                              )}
                              <span className="date">
                                {val.created_at && setFormatDateAndTime(val.created_at)}
                              </span>
                              <span className="px-2">
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
                          {t('page.patient_no_order_notes_added_text')}
                        </div>
                      </div>
                    )
                  ) : (
                    <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
                  )}
                </div>
              </div>
            </Row>
          </Card>
          <hr />
          <div className="order-head">
            <h4 className="order-heading">{t('page.patient_order_history_order_header_text')}</h4>
          </div>
          {isLoadingOrderList ? (
            <div className="page-not-found">
              <div className="error-page-text">{t('page.patient_orders_loading_data_text')}</div>
            </div>
          ) : !isLoadingOrderList && Order_data ? (
            <>
              {orderData && orderData.length > 0 ? (
                orderData.map((order, i) => {
                  const quantities = order.order_items.reduce((val, object) => {
                    return val + object.qty;
                  }, 0);
                  return (
                    <Card key={i} className="body-card">
                      <Card.Header className="order-inner-card p-3 item-align-center card-head-caption">
                        {orderStatusShow(order)}
                        <Row className="item-align-center">
                          <Col lg={6}>
                            <Row>
                              <Col lg={4} sm={4} xs={12} className="card-single-item">
                                <div className="order-view-details">
                                  <div className="inner-card-header">
                                    <h4>{t('page.patient_order_view_order_received_text')}</h4>
                                    <span>{setFormatDate(order.created_at)}</span>
                                  </div>
                                </div>
                              </Col>
                              <Col lg={4} sm={4} xs={6} className="card-single-item">
                                <div className="order-view-details">
                                  <div className="inner-card-header">
                                    <h4>{t('page.patient_order_view_patient_items_text')}</h4>
                                    <span>{quantities}</span>
                                  </div>
                                </div>
                              </Col>
                              <Col lg={4} sm={4} xs={6} className="card-single-item">
                                <div className="order-view-details">
                                  <div className="inner-card-header">
                                    <h4>{t('page.patient_order_view_total_text')}</h4>
                                    <span>{`${currencyType()}${order.total_amount}`}</span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={6}>
                            <Row className="mobile-col-reverse my-2">
                              <Col lg={7} md={6} className="mt-2 px-0 px-sm-2">
                                {order.intake_question_count > 0 &&
                                order.user_intake_question_count > 0 &&
                                order.is_intake_question_fill === 1 ? (
                                  <div className="feature-single-item">
                                    <span
                                      onClick={() =>
                                        navigate(
                                          `/patient/chart/${user_id}/general-intake/${order.order_id}`
                                        )
                                      }>
                                      {t('page.patient_view_order_general_intake_text')}
                                    </span>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </Col>
                              <Col lg={5} md={3} className="card-single-item pe-3 px-0 px-sm-2">
                                <div className="order-details text-md-end text-start">
                                  <div className="order-id">
                                    {t('page.patient_view_order_order_id_text')}
                                    {` #${order.order_id}`}
                                  </div>
                                  <span
                                    onClick={() =>
                                      navigate(
                                        `/patient/chart/${user_id}/order-details/${order.order_id}`
                                      )
                                    }
                                    className="order-detail-link">
                                    {t('page.patient_view_order_details_button_text')}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Header>
                      {order.order_items &&
                        order.order_items.length > 0 &&
                        order.order_items.map((item, index) => (
                          <Card.Body key={index} className="card-product-details">
                            <div className="inner-details">
                              <Row className="item-align-center">
                                <Col lg={2} md={3} className="card-single-item">
                                  <div className="order-imgs">
                                    <LazyLoadImage
                                      alt={item.formulary.featured_image}
                                      key={
                                        item.formulary.featured_image
                                          ? item.formulary.featured_image
                                          : checkAdminData.home_page_general_header_logo
                                      }
                                      placeholderSrc={checkAdminData.home_page_general_header_logo}
                                      className="img-fluid"
                                      src={
                                        item.formulary.featured_image
                                          ? item.formulary.featured_image
                                          : checkAdminData.home_page_general_header_logo
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col lg={5} md={6} className="card-single-item">
                                  <div className="order-product-details">
                                    <h3>{item.formulary.name}</h3>
                                    {item.formulary.short_description && (
                                      <p>{item.formulary.short_description}</p>
                                    )}
                                    {item.question_count > 0 &&
                                    item.use_question_count > 0 &&
                                    item.is_question_fill === 1 ? (
                                      <span
                                        onClick={() =>
                                          navigate(
                                            `/patient/chart/${user_id}/medical-intake/${order.order_id}/formulary/${item.formulary_id}`
                                          )
                                        }
                                        className="view-link">
                                        {t('page.patient_view_order_singleintake_response_text')}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </Col>
                                <Col lg={2} md={3} className="text-center card-single-item">
                                  <div className="qty-price mobile-flex-d-row">
                                    <span className="qty-details">
                                      {t('page.patient_view_order_qty_text')} : {item.qty}
                                    </span>
                                    <br />
                                    <span className="price-details mt-1">{`$${item.sub_total}`}</span>
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
                  <div className="error-page-text">
                    {t('page.patient_no_order_data_found_text')}
                  </div>
                </div>
              )}
              {orderData && orderData.length > 0 && (
                <Pagination paginationData={paginationData} page={page} setPage={setPage} />
              )}
            </>
          ) : (
            ''
          )}
        </Card>
      </Container>
    </>
  );
};
PatientChartPage.propTypes = {
  t: PropTypes.func,
};
export default PatientChartPage;
