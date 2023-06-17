/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import { TNBreadCurm, TNTable } from 'common/components';
import { useListTransactions } from 'hooks';
import { dateFormatCommon, setFormatDate } from 'helpers';

const ListTransactions = ({ t }) => {
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminTransactionsTable !== undefined && localStorage.adminTransactionsTable !== ''
      ? JSON.parse(localStorage.adminTransactionsTable).currentPage
      : 1
  );
  const [fromDate, setFromDate] = useState(
    localStorage.adminTransactionsTable !== undefined &&
      localStorage.adminTransactionsTable !== '' &&
      JSON.parse(localStorage.adminTransactionsTable).fromDate !== ''
      ? new Date(JSON.parse(localStorage.adminTransactionsTable).fromDate)
      : ''
  );
  const [toDate, setToDate] = useState(
    localStorage.adminTransactionsTable !== undefined &&
      localStorage.adminTransactionsTable !== '' &&
      JSON.parse(localStorage.adminTransactionsTable).toDate !== ''
      ? new Date(JSON.parse(localStorage.adminTransactionsTable).toDate)
      : ''
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminTransactionsTable !== undefined && localStorage.adminTransactionsTable !== ''
      ? JSON.parse(localStorage.adminTransactionsTable).searchText
      : ''
  );
  const [PaymentStatus, setPaymentStatus] = useState(
    localStorage.adminTransactionsTable !== undefined && localStorage.adminTransactionsTable !== ''
      ? JSON.parse(localStorage.adminTransactionsTable).PaymentStatus
      : ''
  );
  const [SubscriptionStatus, setSubscriptionStatus] = useState(
    localStorage.adminTransactionsTable !== undefined && localStorage.adminTransactionsTable !== ''
      ? JSON.parse(localStorage.adminTransactionsTable).SubscriptionStatus
      : ''
  );

  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminTransactionsTable = {
      searchText: searchText,
      fromDate: fromDate,
      toDate: toDate,
      PaymentStatus: PaymentStatus,
      SubscriptionStatus: SubscriptionStatus,
      currentPage: currentPage,
    };
    localStorage.removeItem('adminTransactionsTable');
    localStorage.adminTransactionsTable = JSON.stringify(adminTransactionsTable);
  }, [currentPage, searchText, fromDate, toDate, PaymentStatus, SubscriptionStatus]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setFromDate('');
    setToDate('');
    setPaymentStatus('');
    setSubscriptionStatus('');
    setCurrentPage(1);
    localStorage.removeItem('adminTransactionsTable');
  };

  const paymentStatusOption = [
    { value: '', label: `${t('page.select_payment_status')}` },
    { value: 1, label: `${t('page.payment_status_success')}` },
    { value: 2, label: `${t('page.payment_status_faild')}` },
    { value: 3, label: `${t('page.payment_status_retry')}` },
  ];
  const SubscriptionStatusOption = [
    { value: '', label: `${t('page.select_subscription_status')}` },
    { value: 1, label: `${t('page.subscription_status_expire')}` },
    { value: 2, label: `${t('page.subscription_status_active')}` },
    { value: 3, label: `${t('page.subscription_status_cancel')}` },
    { value: 3, label: `${t('page.subscription_status_renewed')}` },
  ];
  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.transactions_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.transactions_id_label')}`,
      accessor: 'transaction_id',
      disableSortBy: true,
    },
    {
      Header: `${t('page.transactions_organisaction_label')}`,
      accessor: 'first_name',
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
      Header: `${t('page.transactions_price_label')}`,
      accessor: 'plan_amount',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{parseFloat(row.original.plan_amount).toFixed(2)}</span>;
      },
    },
    {
      Header: `${t('page.transactions_start_date_label')}`,
      accessor: 'start_date',
      disableSortBy: true,
      Cell: ({ value: initialValue, row }) => {
        return `${setFormatDate(initialValue)} To ${setFormatDate(row.original.renewed_date)} `;
      },
    },
    {
      Header: `${t('page.transactions_payment_status_label')}`,
      accessor: 'payment_status',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        if (initialValue === 1)
          return <Badge bg="success">{t('page.payment_status_success')}</Badge>;
        else if (initialValue === 2)
          return <Badge bg="danger">{t('page.payment_status_faild')}</Badge>;
        else if (initialValue === 3)
          return (
            <Badge bg="warning" text="dark">
              {t('page.payment_status_retry')}
            </Badge>
          );
      },
    },
    {
      Header: `${t('page.transactions_subscription_status_label')}`,
      accessor: 'subscription_status',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        if (initialValue === 1)
          return <Badge bg="danger">{t('page.subscription_status_expire')}</Badge>;
        else if (initialValue === 2)
          return <Badge bg="success">{t('page.subscription_status_active')}</Badge>;
        else if (initialValue === 3)
          return (
            <Badge bg="warning" text="dark">
              {t('page.subscription_status_cancel')}
            </Badge>
          );
        else if (initialValue === 4)
          return (
            <Badge bg="warning" text="dark">
              {t('page.subscription_status_renewed')}
            </Badge>
          );
      },
    },
  ];
  /**
   * !This API will call while Page Load and set data. Once data load we are updating State
   */
  useListTransactions(
    {
      page: currentPage,
      serach_text: searchText,
      from_date: fromDate !== '' ? moment(fromDate).format('YYYY-MM-DD') : '',
      to_date: toDate !== '' ? moment(toDate).format('YYYY-MM-DD') : '',
      subscription_status: SubscriptionStatus,
      payment_status: PaymentStatus,
    },
    (res) => {
      setData(res.data.transaction_list);
      setPaginationData(res.data.pagination);
    }
  );
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
  /**
   * This function will run when user enter something in search input
   */
  const handleSeach = (search_text) => {
    setSearchText(search_text.target.value);
    setCurrentPage(1);
  };

  /**
   * Default options for status
   */
  const breadcurmArray = [
    {
      label: t('page.transaction_list_label'),
      link: '/trasanctions/list',
      active: '',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={paymentStatusOption}
                value={paymentStatusOption.filter((option) => option.value === PaymentStatus)}
                onChange={(selectedOption) => {
                  setPaymentStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={SubscriptionStatusOption}
                value={SubscriptionStatusOption.filter(
                  (option) => option.value === SubscriptionStatus
                )}
                onChange={(selectedOption) => {
                  setSubscriptionStatus(selectedOption.value);
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
            <Form.Label className="field-label date-picker-label">
              {t('page.organisation_from_date_label')}
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
              {t('page.organisation_to_date_label')}
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
            <Form.Group controlId="search" className="filter-field-space">
              <Form.Control
                placeholder="Search"
                onKeyUp={handleSeach}
                className="filter-column form-field"
                value={searchText}
                onChange={handleSeach}
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
      </Row>
      <h1>{t('page.transaction_list_label')}</h1>
      <TNTable
        columns={columns}
        data={data}
        paginationData={paginationData}
        onSelectPage={pageIndexHandle}
        t={t}
        pageIndexGet={currentPage - 1}
        key={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
      />
    </>
  );
};
ListTransactions.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
};
export default ListTransactions;
