/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import { useListOrders, useOrdersStatusChange } from 'hooks';
import { useGetOrganisationList, userGetPatientsList } from 'hooks/useRQTransactionMasters';
import { TNBreadCurm, TNButton } from 'common/components';
import { dateFormatCommon, setFormatDate } from 'helpers';
import { IndeterminateCheckbox, ReactTable } from 'common/components/ReactTable';

const ListOrdersPage = ({ t }) => {
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).currentPage
      : 1
  );
  const [organization_id, setOrganizationId] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).organization_id
      : ''
  );
  const [patient_id, setPatientId] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).patient_id
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectepayoutStatus, setSelectepayoutStatus] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).selectepayoutStatus
      : ''
  );
  const [selectetransactionType, setSelectetransactionType] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).selectetransactionType
      : ''
  );
  const [selecteOrderStatus, setSelecteOrderStatus] = useState(
    localStorage.adminOrdersTable !== undefined && localStorage.adminOrdersTable !== ''
      ? JSON.parse(localStorage.adminOrdersTable).selecteOrderStatus
      : ''
  );
  const [fromDate, setFromDate] = useState(
    localStorage.adminOrdersTable !== undefined &&
      localStorage.adminOrdersTable !== '' &&
      JSON.parse(localStorage.adminOrdersTable).fromDate !== ''
      ? new Date(JSON.parse(localStorage.adminOrdersTable).fromDate)
      : ''
  );
  const [toDate, setToDate] = useState(
    localStorage.adminOrdersTable !== undefined &&
      localStorage.adminOrdersTable !== '' &&
      JSON.parse(localStorage.adminOrdersTable).toDate !== ''
      ? new Date(JSON.parse(localStorage.adminOrdersTable).toDate)
      : ''
  );
  /**
   * Default Options for Admin Status
   */
  const payoutStatus = [
    { value: '', label: `${t('page.select_payout_status')}` },
    { value: 1, label: `${t('page.orders_paid_status_name')}` },
    { value: 2, label: `${t('page.orders_unpaid_status_name')}` },
    { value: 3, label: `${t('page.orders_rejected_status_name')}` },
  ];
  const transactionType = [
    { value: '', label: `${t('page.select_transaction_type_status')}` },
    { value: 1, label: `${t('page.transaction_type_orders_name')}` },
    { value: 2, label: `${t('page.transaction_type_charge_name')}` },
    // { value: 3, label: `${t('page.transaction_type_refund_name')}` }
  ];
  const orderStatus = [
    { value: '', label: t('page.transaction_order_status_label') },
    // { value: 1, label: t('page.transaction_order_status_draft_name') },
    { value: 2, label: t('page.transaction_order_status_placed_name') },
    { value: 3, label: t('page.transaction_order_status_rx_accepted_name') },
    { value: 4, label: t('page.transaction_order_status_pharmacy_name') },
    { value: 5, label: t('page.transaction_order_status_delivered_name') },
    { value: 6, label: t('page.transaction_order_status_canceled_name') },
  ];

  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminOrdersTable = {
      organization_id: organization_id,
      patient_id: patient_id,
      currentPage: currentPage,
      selectepayoutStatus: selectepayoutStatus,
      selectetransactionType: selectetransactionType,
      selecteOrderStatus: selecteOrderStatus,
      fromDate: fromDate,
      toDate: toDate,
    };
    localStorage.removeItem('adminOrdersTable');
    localStorage.adminOrdersTable = JSON.stringify(adminOrdersTable);
  }, [
    currentPage,
    organization_id,
    patient_id,
    selectepayoutStatus,
    selectetransactionType,
    selecteOrderStatus,
    fromDate,
    toDate,
  ]);
  /**
   * This block will call on click clear Data and it will clear all the data including date
   */
  const handleClearFilter = () => {
    setOrganizationId('');
    setPatientId('');
    setCurrentPage(1);
    setSelectepayoutStatus('');
    setSelectetransactionType('');
    setSelecteOrderStatus('');
    localStorage.removeItem('adminOrdersTable');
  };
  /**
   * This block will call on click clear date
   */
  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };
  /**
   * BreadCum labels and links
   */ const breadcurmArray = [
    {
      label: t('page.orders_list_label'),
      link: '/orders/list',
      active: '',
    },
  ];
  let organisationList = [];
  const { data: Organisation_data, isLoding: isOrganizationData } = useGetOrganisationList();
  if (!isOrganizationData && Organisation_data) {
    organisationList = Organisation_data?.data
      ?.filter((data) => {
        return data.organization_info.company_name !== '';
      })
      .map((val) => {
        return { value: val.organization_id, label: val.organization_info.company_name };
      });
  }
  let patientList = [];
  const { data: patient_data, isLoding: isLoadingPatientData } = userGetPatientsList();
  if (!isLoadingPatientData && patient_data) {
    patientList = patient_data?.data
      ?.filter((data) => {
        return data.users !== '';
      })
      .map((val) => {
        return { value: val.user_id, label: `${val.users.first_name}  ${val.users.last_name}` };
      });
  }
  /**
   * This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doUpdateStatusOrders } = useOrdersStatusChange((response) => {
    toast.success(response.message);
    setTimeout(function () {
      refetch();
    }, 500);
  });
  /**
   * This API will call while Page Load and set data. Once data load we are updating State
   */
  const { refetch } = useListOrders(
    {
      page: currentPage,
      organization_id,
      patient_id,
      payout_status: selectepayoutStatus,
      type: selectetransactionType,
      order_status: selecteOrderStatus,
      from_date: fromDate !== '' ? moment(fromDate).format('YYYY-MM-DD') : '',
      to_date: toDate !== '' ? moment(toDate).format('YYYY-MM-DD') : '',
    },
    (res) => {
      setData(res.data.transaction_list);
      setPaginationData(res.data.pagination);
    }
  );
  /**
   * !This Function will call when user clicks on View Button, and this will redirect user to view page,
   * and that will display payout note
   */
  const handleViewClick = (tdata) => {
    let payout_note = tdata.currentTarget.getAttribute('payout_note');
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="alert-box  text-center mx-auto position-relative">
            <FontAwesomeIcon
              className="alert-close"
              icon={faClose}
              onClick={() => {
                onClose();
              }}
              style={{
                top: 0,
                position: 'absolute',
                right: 0,
                zIndex: 9,
              }}
            />
            <div
              className="alert-popup text-start d-flex"
              style={{
                position: 'relative',
                display: 'flex',
                'flex-direction': 'column',
                'min-width': 0,
                'word-wrap': 'break-word',
                'background-color': '#fff',
                'background-clip': 'border-box',
                'border-radius': '0.25rem',
              }}>
              <Row>
                <Col lg={12} xs={12} className="text-center">
                  <Form.Label className="field-label text-center fw-bold">
                    {t('page.status_alert_view_payout_message')}
                  </Form.Label>
                </Col>
                <Col lg={12} xs={12}>
                  <span className="text-break">{payout_note}</span>
                </Col>
              </Row>
            </div>
          </div>
        );
      },
    });
  };

  /**
   * This Block is making Headers for the column
   * @param Not Required
   */
  // console.log(selectOrderType);
  const columnsjson = [
    {
      id: 'selection',
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox
            {...getToggleAllRowsSelectedProps()}
            label={t('page.orders_payout_status')}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) =>
        row.original.orders.payout_status !== 1 &&
        [6, 5].includes(row.original?.orders.order_status) &&
        row.original.amount >
          (row.original.refunded_amount !== '' ? row.original.refunded_amount : 0) ? (
          <div>
            <IndeterminateCheckbox
              {...row.getToggleRowSelectedProps()}
              label={
                <span
                  className={
                    row.original.orders.payout_status === 1 ? 'status-active' : 'status-inactive'
                  }
                  organization_id={row.original.organization_id}
                  order_id={row.original.order_id}
                  payout_status={row.original.orders.payout_status}>
                  {t(
                    row.original?.orders?.payout_status === 1
                      ? 'page.orders_paid_status_name'
                      : 'page.orders_unpaid_status_name'
                  )}
                </span>
              }
              name={row.original.sourceId}
            />
          </div>
        ) : (
          <div>
            <span
              className={
                row.original?.orders.payout_status === 1 ? 'status-active' : 'status-inactive'
              }
              organization_id={row.original.organization_id}
              order_id={row.original.order_id}
              payout_status={row.original?.orders.payout_status}>
              {t(
                row.original?.orders.payout_status === 1
                  ? 'page.orders_paid_status_name'
                  : 'page.orders_unpaid_status_name'
              )}
            </span>
          </div>
        ),
    },
    {
      Header: `${t('page.orders_created_at')}`,
      accessor: 'created_at',
      disableSortBy: false,
      Cell: ({ value }) => {
        return value !== '' && <div>{setFormatDate(value)}</div>;
      },
    },
    {
      Header: (
        <span>
          {t('page.orders_order_id_label')} /
          <br />
          {t('page.orders_order_item_id_label')}
        </span>
      ),
      accessor: 'order_id',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <>
            <span>
              {row.original.order_id}
              <br />
              <span>
                {row.original.order_items !== '' && '/' + row.original.order_items.formulary.name}
              </span>
            </span>
          </>
        );
      },
    },
    {
      Header: `${t('page.orders_transaction_id_label')}`,
      accessor: 'transaction_id',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{row.original.transaction_id}</span>;
      },
    },
    {
      Header: `${t('page.orders_transaction_type_label')}`,
      accessor: 'type',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div>
            <span>
              {row.original.type === 1 ? (
                <Badge bg="primary">{t('page.transaction_type_orders_name')}</Badge>
              ) : row.original.type === 2 ? (
                <Badge bg="success">{t('page.transaction_type_charge_name')}</Badge>
              ) : (
                ''
              )}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.orders_transaction_order_status_label')}`,
      accessor: 'order_status',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <div>
            <span>
              {row.original?.orders.order_status === 1 ? (
                <Badge bg="primary">{t('page.transaction_order_status_draft_name')}</Badge>
              ) : row.original?.orders.order_status === 2 ? (
                <Badge bg="secondary">{t('page.transaction_order_status_placed_name')}</Badge>
              ) : row.original?.orders.order_status === 3 ? (
                <Badge bg="warning">{t('page.transaction_order_status_rx_accepted_name')}</Badge>
              ) : row.original?.orders.order_status === 4 ? (
                <Badge bg="warning">{t('page.transaction_order_status_pharmacy_name')}</Badge>
              ) : row.original?.orders.order_status === 5 ? (
                <Badge bg="success">{t('page.transaction_order_status_delivered_name')}</Badge>
              ) : row.original?.orders.order_status === 6 ? (
                <Badge bg="danger">{t('page.transaction_order_status_canceled_name')}</Badge>
              ) : (
                ''
              )}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.orders_patient_name_label')}`,
      accessor: 'users',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {row.original.users.first_name} {row.original.users.last_name}
          </span>
        );
      },
    },
    {
      Header: `${t('page.orders_organisaction_name_label')}`,
      accessor: 'company_name',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{row.original.company_name}</span>;
      },
    },
    {
      Header: `${t('page.orders_doctor_visit_fee_label')}`,
      accessor: 'doctor_visit_fee',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{`$${row.original.orders.doctor_visit_fee || 0}`}</span>;
      },
    },
    {
      Header: `${t('page.orders_medication_cost_label')}`,
      accessor: 'medication_cost',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{`$${row.original.orders.medication_cost || 0}`}</span>;
      },
    },
    {
      Header: `${t('page.orders_order_amount_label')}`,
      accessor: 'amount',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {`$${row.original.amount}`}
            <br />
            {row.original.refunded_amount !== '' ? `Refunded $${row.original.refunded_amount}` : ''}
          </span>
        );
      },
    },
    {
      Header: `${t('page.orders_payable_amount_label')}`,
      accessor: 'payable_amount',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {`$${parseFloat(
              parseFloat(row.original.amount) -
                parseFloat(row.original.refunded_amount !== '' ? row.original.refunded_amount : 0) -
                parseFloat(row.original.orders.telemedicine_platform_fee || 0) -
                parseFloat(row.original.orders.packing_shipping_fee || 0)
            ).toFixed(2)}`}
          </span>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'payout_note',
      disableSortBy: true,
      Cell: ({ row }) => {
        return row.original?.orders?.payout_note !== '' ? (
          <div className="action_btn">
            <TNButton
              className="table-primary-button"
              payout_note={row.original?.orders?.payout_note}
              onClick={handleViewClick.bind(this)}>
              {t('page.action_button_text_view')}
            </TNButton>
          </div>
        ) : (
          ''
        );
      },
    },
    {
      Header: `${t('page.orders_telemedicine_platform_fee_label')}`,
      accessor: 'telemedicine_platform_fee',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{`$${row.original.orders.telemedicine_platform_fee || 0}`}</span>;
      },
    },
    {
      Header: `${t('page.orders_packing_shipping_fee_label')}`,
      accessor: 'packing_shipping_fee',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{`$${row.original.orders.packing_shipping_fee || 0}`}</span>;
      },
    },
  ];
  const columns = useMemo(() => columnsjson, []);
  if (paginationData === null) {
    return null;
  }
  /**
   * This function will set current page of table
   */
  const pageIndexHandle = (pageIndex) => {
    setCurrentPage(pageIndex + 1);
  };
  const handleCheckboxSelection = (array) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="alert-box">
            <FontAwesomeIcon
              className="alert-close"
              icon={faClose}
              onClick={() => {
                onClose();
              }}
            />
            <div className="alert-popup">
              {array && array.length > 0 ? (
                <>
                  <h2>{t('page.status_alert_popup_message')}</h2>
                  <Formik
                    initialValues={{ note: '', type: '' }}
                    enableReinitialize
                    onSubmit={(values) => {
                      let note = values.note;
                      // let type = values.type;
                      let params = {
                        type: 'individual',
                        note: note,
                        user_transaction_id: array
                          .filter((val) => {
                            return (
                              val.original.orders.payout_status === 2 &&
                              [6, 5].includes(val.original.orders.order_status) &&
                              val.original.amount >
                                (val.original.refunded_amount !== ''
                                  ? val.original.refunded_amount
                                  : 0)
                            );
                          })
                          .map((data) => {
                            return data.original.user_transaction_id;
                          }),
                      };
                      doUpdateStatusOrders(params);
                      onClose();
                      setCurrentPage(1);
                    }}>
                    {({ handleSubmit, values, touched, errors, handleChange, handleBlur }) => {
                      return (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group>
                            <Form.Control
                              placeholder={t('page.orders_master_paid_message_placeholder')}
                              className={
                                'mt-3 mb-2 ' +
                                (touched.note && errors.note
                                  ? 'form-field-error'
                                  : touched.note && !errors.note
                                  ? 'form-field-success'
                                  : '')
                              }
                              name="note"
                              type="text"
                              as="textarea"
                              row={4}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values?.note}
                            />
                            <div className="form-field-error-text text-start">
                              {touched.note && errors.note ? <div>{t(errors.note)}</div> : null}
                            </div>
                          </Form.Group>
                          <Button type="submit" className="table-delete-button">
                            {t('page.alert_popup_yes_button')}
                          </Button>
                          <Button
                            className="table-primary-button"
                            onClick={() => {
                              onClose();
                              refetch();
                            }}>
                            {t('page.alert_popup_no_button')}
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                </>
              ) : (
                <>
                  <h2 className="text-warning">
                    <FontAwesomeIcon className="mx-2" icon={faTriangleExclamation} />
                    {t('page.status_alert_not_update_popup_message')}
                  </h2>
                  <Button className="table-primary-button" onClick={onClose}>
                    {t('page.alert_popup_cancel_button')}
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      },
    });
  };
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group controlId="search" className="filter-field-space">
              <Select
                className="filter-column"
                options={organisationList}
                placeholder={t('page.orders_organisation_filter_label')}
                value={organisationList.filter((option) => option.value === organization_id)}
                onChange={(selectedOption) => {
                  setOrganizationId(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group controlId="search" className="filter-field-space">
              <Select
                className="filter-column"
                options={patientList}
                placeholder={t('page.orders_patient_filter_label')}
                value={patientList.filter((option) => option.value === patient_id)}
                onChange={(selectedOption) => {
                  setPatientId(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={payoutStatus}
                value={payoutStatus.filter((option) => option.value === selectepayoutStatus)}
                onChange={(selectedOption) => {
                  setSelectepayoutStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={transactionType}
                value={transactionType.filter((option) => option.value === selectetransactionType)}
                onChange={(selectedOption) => {
                  setSelectetransactionType(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={orderStatus}
                value={orderStatus.filter((option) => option.value === selecteOrderStatus)}
                onChange={(selectedOption) => {
                  setSelecteOrderStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Button
              type="button"
              onClick={handleClearFilter}
              className="secondary-remove-button filter-field-space ml-0">
              {t('page.cancel_search_button')}
            </Button>
          </div>
        </Col>
        <Col lg={12}>
          <div className="filter">
            <Form.Label className="field-label date-picker-label">
              {t('page.orders_from_date_label')}
            </Form.Label>
            <Form.Group className="filter-field-space">
              <DatePicker
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                dropdownMode="select"
                showMonthDropdown
                showYearDropdown
                adjustDateOnChange
                className="form-control filter-column"
                placeholderText={dateFormatCommon().toUpperCase()}
                selected={fromDate}
                dateFormat={dateFormatCommon()}
                onChange={(date) => {
                  setFromDate(date);
                  setCurrentPage(1);
                }}
                maxDate={toDate !== '' && toDate !== undefined ? toDate : new Date()}
              />
            </Form.Group>
            <Form.Label className="field-label date-picker-label">
              {t('page.orders_to_date_label')}
            </Form.Label>
            <Form.Group className="filter-field-space">
              <DatePicker
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                dropdownMode="select"
                showMonthDropdown
                showYearDropdown
                adjustDateOnChange
                className="form-control filter-column"
                placeholderText={dateFormatCommon().toUpperCase()}
                minDate={fromDate}
                selected={toDate}
                dateFormat={dateFormatCommon()}
                onChange={(date) => {
                  setToDate(date);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Button
              type="button"
              onClick={clearDateFilter}
              className="secondary-remove-button filter-field-space ml-0">
              {t('page.clear_date_search_button')}
            </Button>
          </div>
        </Col>
        {/* <Col lg={12}>
          <div className="table-add-button filter filter-field-space">
            <TNButton loading={false} type="button">
              {t('page.orders_update_status_button_text')}
            </TNButton>
          </div>
        </Col> */}
      </Row>
      <h1>{t('page.orders_list_label')}</h1>
      <h5>{t('page.orders_list_note')}</h5>
      <ReactTable
        columns={columns}
        data={data}
        paginationData={paginationData}
        onSelectPage={pageIndexHandle}
        t={t}
        pageIndexGet={currentPage - 1}
        key={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
        handleCheckboxSelection={handleCheckboxSelection}
      />
    </>
  );
};
ListOrdersPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
  getToggleAllRowsSelectedProps: PropTypes.any,
};
export default ListOrdersPage;
