import React from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-confirm-alert/src/react-confirm-alert.css';

import userIcon from 'assets/images/place-holder.png';
import 'assets/scss/page/_order_pages.scss';
import { settingData } from 'store/features/settingSlice';
import { useGetOrderDetails, useGetOrderTransaction, useGetPatientOrderNotes } from 'hooks';

import { ReactComponent as MasterCardIcon } from 'assets/images/master_card.svg';
import { ReactComponent as DiscoverCardIcon } from 'assets/images/discover-color-large.svg';
import { ReactComponent as DinnerClubCardIcon } from 'assets/images/dinnerclub-color-large.svg';
import { ReactComponent as UnionPayCardIcon } from 'assets/images/unionpay-svgrepo-com.svg';
import { ReactComponent as JcbCardIcon } from 'assets/images/jcb-color-large.svg';
import { ReactComponent as VisaCardIcon } from 'assets/images/visa_card.svg';
import { ReactComponent as AmericanCardIcon } from 'assets/images/american_card.svg';
import { TNBreadCurm } from 'common/components';
import TabsNavBar from './TabsNavBar';
import { ReactComponent as BackIcon } from 'assets/images/previous-arrow.svg';
import { setFormatDate, setFormatDateAndTime, currencyType } from 'helpers';

const OrderDetailsPage = ({ t }) => {
  const checkAdminData = useSelector(settingData);

  const navigate = useNavigate();
  const { order_id, user_id } = useParams();

  let orderDetail = {};
  let OrderTransactionData = {};
  let notes = {};

  /**
   * Order Detail Data get
   */
  const { isLoading: isLoadingOrderDetails, data: Order_data } = useGetOrderDetails(
    {
      user_id,
      order_id,
    },
    (data) => {
      orderDetail = data.data;
      orderDetail.address = data.data.order_addresses;
      orderDetail.quantities = data.data.order_items?.reduce((val, object) => {
        return val + object.qty;
      }, 0);
    }
  );
  if (!isLoadingOrderDetails && Order_data) {
    orderDetail = Order_data.data;
    orderDetail.address = Order_data.data.order_addresses;
    orderDetail.quantities = Order_data.data.order_items?.reduce((val, object) => {
      return val + object.qty;
    }, 0);
  }
  const { isLoading: isLoadingTransactionData, data: trans_data } = useGetOrderTransaction(
    { order_id, user_id },
    (data) => {
      OrderTransactionData = data.data;
    }
  );
  if (!isLoadingTransactionData && trans_data) {
    OrderTransactionData = trans_data.data;
  }

  /**
   * Getting Order notes added by Organisation In Order
   */
  const { isLoading: isLoadingNotes, data: notes_data } = useGetPatientOrderNotes(
    {
      user_id,
      order_id,
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
   * BreadCum labels and links
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
      label: t('page.patient_order_details_header_text'),
      link: '',
      active: 'active',
    },
  ];
  const isObjDataEmpty = (obj) => {
    return Object.values(obj).every((d) => d === undefined || d === '');
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} order_id={order_id} t={t} />
      <Container className="orderpage inner-section-container">
        <div className="inner-previous-icon d-flex align-items-center pt-2 pb-4">
          <BackIcon className="custom-icon" onClick={() => navigate(-1)} />
          <h4 className="order-heading p-0 m-0 ps-2">
            {t('page.patient_order_details_header_text')}
          </h4>
        </div>
        <Card.Body>
          {!isLoadingOrderDetails ? (
            !isObjDataEmpty(orderDetail) ? (
              <Card className="new-proper-cls-add">
                <Card.Header className="order-inner-card item-align-center">
                  <Row className="item-align-center">
                    <Col lg={8}>
                      <Row>
                        <Col lg={4} sm={4} xs={6} className="card-single-item">
                          {orderDetail.quantities && (
                            <div className="order-view-details">
                              <div className="inner-card-header">
                                <h4>{t('page.patient_order_details_total_item_text')}</h4>
                                <span>{orderDetail.quantities}</span>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col lg={4} sm={4} xs={6} className="card-single-item">
                          {orderDetail.total_amount && (
                            <div className="order-view-details">
                              <div className="inner-card-header">
                                <h4>{t('page.patient_order_details_total_amount_text')}</h4>
                                <span>{`${currencyType()}${orderDetail.total_amount}`}</span>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col lg={4} sm={4} xs={6} className="card-single-item">
                          {orderDetail.order_id && (
                            <div className="order-view-details">
                              <div className="inner-card-header">
                                <h4>{t('page.patient_view_order_order_id_text')}</h4>
                                <span>{` #${orderDetail.order_id}`}</span>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4}>
                      <Row className="mobile-col-reverse my-2">
                        <Col className="mt-2">
                          {orderDetail.intake_question_count > 0 &&
                          orderDetail.user_intake_question_count > 0 &&
                          orderDetail.is_intake_question_fill === 1 ? (
                            <div className="feature-single-item">
                              <span
                                onClick={() =>
                                  navigate(
                                    `/patient/chart/${user_id}/general-intake/${orderDetail.order_id}`
                                  )
                                }>
                                {t('page.patient_view_order_general_intake_text')}
                              </span>
                            </div>
                          ) : (
                            ''
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {orderDetail.order_note && (
                    <div className="notes">
                      <p>{t('page.patient_view_order_notes_text')}</p>
                      <span>{orderDetail.order_note}</span>
                    </div>
                  )}
                  <div className="inner-card-header">
                    {orderDetail.created_at && (
                      <span>
                        {t('page.patient_order_view_order_received_text')}&nbsp;
                        {setFormatDate(orderDetail.created_at)}
                      </span>
                    )}
                    <Row className="order-profile-details">
                      <Col lg={3} md={6} className="card-single-item">
                        <div className="user-profile-imgs">
                          {orderDetail.users && (
                            <LazyLoadImage
                              alt={orderDetail.users.profile_image}
                              key={
                                orderDetail.users.profile_image
                                  ? orderDetail.users.profile_image
                                  : userIcon
                              }
                              placeholderSrc={userIcon}
                              className="selfie-img"
                              src={
                                orderDetail.users.profile_image
                                  ? orderDetail.users.profile_image
                                  : userIcon
                              }
                            />
                          )}
                        </div>
                      </Col>
                      {orderDetail.address &&
                        orderDetail.address.length > 0 &&
                        orderDetail.address.map((add) => (
                          <>
                            {add.type === 1 ? (
                              <>
                                <Col lg={3} md={6} className="card-single-item p-sm-0">
                                  <div className="order-shipping-address">
                                    <h3 className="text-uppercase fw-bold ">
                                      {t('page.patient_order_details_shipping_address_text')}
                                    </h3>
                                    <p>
                                      {`${add.address} ${add.city},`}
                                      <br />
                                      {`${add.statename} ${add.zipcode},`}
                                      <br />
                                      {`${add.first_name} ${add.last_name},`}
                                      <br />
                                      {`${add.phone},`}
                                    </p>
                                  </div>
                                </Col>
                                {orderDetail.address.length === 1 && (
                                  <Col lg={3} md={6} className="card-single-item ps-md-0 p-sm-0">
                                    <div className="order-billing-address">
                                      <h3 className="text-uppercase fw-bold ">
                                        {t('page.patient_order_details_billing_address_text')}
                                      </h3>
                                      <p>
                                        {`${add.address} ${add.city},`}
                                        <br />
                                        {`${add.statename} ${add.zipcode},`}
                                        <br />
                                        {`${add.first_name} ${add.last_name},`}
                                        <br />
                                        {`${add.phone},`}
                                      </p>
                                    </div>
                                  </Col>
                                )}
                              </>
                            ) : (
                              <Col lg={3} md={6} className="card-single-item ps-md-0 p-sm-0">
                                <div className="order-billing-address">
                                  <h3 className="text-uppercase fw-bold ">
                                    {t('page.patient_order_details_billing_address_text')}
                                  </h3>
                                  <p>
                                    {`${add.address} ${add.city},`}
                                    <br />
                                    {`${add.statename} ${add.zipcode},`}
                                    <br />
                                    {`${add.first_name} ${add.last_name},`}
                                    <br />
                                    {`${add.phone},`}
                                  </p>
                                </div>
                              </Col>
                            )}
                          </>
                        ))}
                      {orderDetail.user_cards && (
                        <Col lg={3} md={6} className="card-single-item">
                          <div className="order-payment-method">
                            <h3 className="text-uppercase fw-bold">
                              {t('page.patient_order_details_payment_method_text')}
                            </h3>
                            {orderDetail.user_cards.type ? (
                              orderDetail.user_cards.type === 1 ? (
                                <MasterCardIcon />
                              ) : orderDetail.user_cards.type === 2 ? (
                                <VisaCardIcon />
                              ) : orderDetail.user_cards.type === 3 ? (
                                <AmericanCardIcon />
                              ) : orderDetail.user_cards.type === 4 ? (
                                <DiscoverCardIcon />
                              ) : orderDetail.user_cards.type === 5 ? (
                                <DinnerClubCardIcon />
                              ) : orderDetail.user_cards.type === 6 ? (
                                <JcbCardIcon />
                              ) : orderDetail.user_cards.type === 7 ? (
                                <UnionPayCardIcon />
                              ) : (
                                <MasterCardIcon />
                              )
                            ) : (
                              ''
                            )}
                            <span>
                              {orderDetail.user_cards &&
                                orderDetail.user_cards.card_last_digit &&
                                `**** ${orderDetail.user_cards.card_last_digit}`}
                            </span>
                          </div>
                        </Col>
                      )}
                    </Row>
                    {orderDetail.order_items &&
                      orderDetail.order_items.length > 0 &&
                      orderDetail.order_items.map((item, index) => {
                        return (
                          <Row key={index} className="item-align-center single-product-details">
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
                            <Col lg={8} md={6} className="card-single-item">
                              <div className="order-product-details">
                                <h3>{item.formulary.name}</h3>
                                <p>{item.formulary.short_description}</p>
                                {item.question_count > 0 &&
                                item.use_question_count > 0 &&
                                item.is_question_fill === 1 ? (
                                  <span
                                    onClick={() =>
                                      navigate(
                                        `/patient/chart/${user_id}/medical-intake/${order_id}/formulary/${item.formulary_id}`
                                      )
                                    }
                                    className="view-link">
                                    {t('page.patient_order_view_single_intake_response_text')}
                                  </span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </Col>
                            <Col lg={2} md={3} className="text-center card-single-item">
                              <div className="qty-price">
                                <span className="qty-details">
                                  {t('page.patient_details_qty_text')}: {item.qty}
                                </span>
                                <br />
                                <span className="price-details mt-1">{`$${item.sub_total}`}</span>
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
                    {!isLoadingNotes ? (
                      notes &&
                      notes.length > 0 && (
                        <Row className="order-details-note-section item-align-center pe-3">
                          <div className="order-note order-notes-row pb-0">
                            <h2 className="order-heading p-0 mb-0">
                              {t('page.patient_all_orders_notes_text')}
                            </h2>
                          </div>
                          <div className="all-notes notes-height ps-3 pt-2">
                            {notes.map((val, i) => {
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
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Row>
                      )
                    ) : (
                      <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
                    )}
                    {!isLoadingTransactionData ? (
                      OrderTransactionData &&
                      OrderTransactionData.length > 0 && (
                        <Row className="transaction-details">
                          <Col lg={12}>
                            <h2>
                              {t('page.patient_view_order_details_transaction_details_heading')}
                            </h2>
                            <h4>{t('page.patient_view_order_details_transaction_details_note')}</h4>
                            <div className="transaction-details-table">
                              <Table responsive="md">
                                <thead>
                                  <tr>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_table_id_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_table_date_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_table_pname_order_id_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_payment_option_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_order_price_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_type_heading'
                                      )}
                                    </th>
                                    <th>
                                      {t(
                                        'page.patient_view_order_details_transaction_status_heading'
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {OrderTransactionData.map((val, i) => {
                                    let status = 'order';
                                    if (val.type === 2 && val.payment_status === 1) {
                                      if (val.payment_status === 1) {
                                        status = 'Approve';
                                      } else if (val.payment_status === 2) {
                                        status = 'Failed';
                                      } else if (val.payment_status === 3) {
                                        status = 'Rejected';
                                      }
                                    } else if (val.type === 3 && val.payment_status === 1) {
                                      if (val.payment_status === 1) {
                                        status = 'ReFund';
                                      } else if (val.payment_status === 2) {
                                        status = 'Failed';
                                      } else if (val.payment_status === 3) {
                                        status = 'Rejected';
                                      }
                                    } else {
                                      if (val.payment_status === 2) {
                                        status = 'Failed';
                                      } else if (val.payment_status === 3) {
                                        status = 'Rejected';
                                      }
                                    }
                                    return (
                                      <tr key={i}>
                                        <td>{val.transaction_id}</td>
                                        <td>{setFormatDate(val.created_at)}</td>
                                        <td>
                                          {val.type == 1
                                            ? `#${val.order_id}`
                                            : `${
                                                val.order_items && val.order_items.formulary.name
                                              }`}
                                        </td>
                                        <td>
                                          {t(
                                            'page.patient_view_order_detail_transaction_paid_by_text'
                                          )}
                                          {` ****${val.user_cards.card_last_digit}`}
                                        </td>
                                        <td>{val.amount}</td>
                                        <td className="transaction-type">
                                          {val.type === 1
                                            ? t(
                                                'page.patient_view_order_detail_transaction_type_ordered_text'
                                              )
                                            : val.type === 2
                                            ? t(
                                                'page.patient_view_order_detail_transaction_type_charge_text'
                                              )
                                            : val.type === 3
                                            ? t(
                                                'page.patient_view_order_detail_transaction_type_refund_text'
                                              )
                                            : t(
                                                'page.patient_view_order_detail_transaction_type_dash_text'
                                              )}
                                        </td>
                                        <td>
                                          {status === 'order' ? (
                                            <span className="approve-order">
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_paid_text'
                                              )}
                                            </span>
                                          ) : status === 'Approve' ? (
                                            <span className="approve-order">
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_approve_text'
                                              )}
                                            </span>
                                          ) : status === 'ReFund' ? (
                                            <span className="refund-order">
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_refund_text'
                                              )}
                                            </span>
                                          ) : status === 'Rejected' ? (
                                            <span className="rejected-order">
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_rejected_text'
                                              )}
                                            </span>
                                          ) : status === 'Failed' ? (
                                            <span className="failed-order">
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_failed_text'
                                              )}
                                            </span>
                                          ) : (
                                            <span>
                                              {t(
                                                'page.patient_view_order_detail_transaction_status_no_status_text'
                                              )}
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      )
                    ) : (
                      <h5 className="page-heading-center">{t('page.patient_data_Loading_text')}</h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <div className="page-not-found data-not-found border">
                <div className="error-page-text pt-4">{t('page.patient_data_not_found_text')}</div>
              </div>
            )
          ) : (
            <div className="page-not-found data-not-found border">
              <h5 className="page-heading-center error-page-text py-5">
                {t('page.patient_data_Loading_text')}
              </h5>
            </div>
          )}
        </Card.Body>
      </Container>
    </>
  );
};
OrderDetailsPage.propTypes = {
  t: PropTypes.func,
};
export default OrderDetailsPage;
