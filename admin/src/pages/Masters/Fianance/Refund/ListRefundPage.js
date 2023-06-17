import { TNBreadCurm, TNTable } from 'common/components';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { dateFormatCommon, setFormatDate } from 'helpers';
import {
  useGetOrganisationRefundList,
  useListRefundOrders,
  userGetOrderItemRefundList,
  userGetPatientsRefundList,
} from 'hooks';
import moment from 'moment';
const ListRefundPage = ({ t }) => {
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminRefundTable !== undefined && localStorage.adminRefundTable !== ''
      ? JSON.parse(localStorage.adminRefundTable).currentPage
      : 1
  );
  const [organization_id, setOrganizationId] = useState(
    localStorage.adminRefundTable !== undefined && localStorage.adminRefundTable !== ''
      ? JSON.parse(localStorage.adminRefundTable).organization_id
      : ''
  );
  const [order_item_id, setOrderItemId] = useState(
    localStorage.adminRefundTable !== undefined && localStorage.adminRefundTable !== ''
      ? JSON.parse(localStorage.adminRefundTable).order_item_id
      : ''
  );
  const [patient_id, setPatientId] = useState(
    localStorage.adminRefundTable !== undefined && localStorage.adminRefundTable !== ''
      ? JSON.parse(localStorage.adminRefundTable).patient_id
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);

  const [fromDate, setFromDate] = useState(
    localStorage.adminRefundTable !== undefined &&
      localStorage.adminRefundTable !== '' &&
      JSON.parse(localStorage.adminRefundTable).fromDate !== ''
      ? new Date(JSON.parse(localStorage.adminRefundTable).fromDate)
      : ''
  );
  const [toDate, setToDate] = useState(
    localStorage.adminRefundTable !== undefined &&
      localStorage.adminRefundTable !== '' &&
      JSON.parse(localStorage.adminRefundTable).toDate !== ''
      ? new Date(JSON.parse(localStorage.adminRefundTable).toDate)
      : ''
  );
  /**
   * BreadCum labels and links
   */ const breadcurmArray = [
    {
      label: t('page.refund_list_label'),
      link: '/refund/list',
      active: '',
    },
  ];
  let organisationList = [];
  const { data: Organisation_data, isLoding: isOrganizationData } = useGetOrganisationRefundList();
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
  const { data: patient_data, isLoding: isLoadingPatientData } = userGetPatientsRefundList();
  if (!isLoadingPatientData && patient_data) {
    patientList = patient_data?.data
      ?.filter((data) => {
        return data.users !== '';
      })
      .map((val) => {
        return { value: val.user_id, label: `${val.users.first_name}  ${val.users.last_name}` };
      });
  }
  let orderItemList = [];
  const { data: order_item_data, isLoding: isLoadingOrderItemData } = userGetOrderItemRefundList();
  if (!isLoadingOrderItemData && order_item_data) {
    orderItemList = order_item_data?.data
      ?.filter((data) => {
        return data.order_items !== '';
      })
      .map((val) => {
        return {
          value: val.order_items.order_item_id,
          label: val.order_items.formulary.name,
        };
      });
  }

  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminRefundTable = {
      organization_id: organization_id,
      patient_id: patient_id,
      currentPage: currentPage,
      fromDate: fromDate,
      toDate: toDate,
      order_item_id: order_item_id,
    };
    localStorage.adminRefundTable = JSON.stringify(adminRefundTable);
  }, [currentPage, organization_id, patient_id, fromDate, toDate, order_item_id]);
  /**
   * This block will call on click clear Data and it will clear all the data including date
   */
  const handleClearFilter = () => {
    setOrganizationId('');
    setOrderItemId('');
    setPatientId('');
    setCurrentPage(1);
    localStorage.removeItem('adminRefundTable');
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
   * This API will call while Page Load and set data. Once data load we are updating State
   */
  useListRefundOrders(
    {
      page: currentPage,
      organization_id,
      order_item_id,
      patient_id,
      from_date: fromDate !== '' ? moment(fromDate).format('YYYY-MM-DD') : '',
      to_date: toDate !== '' ? moment(toDate).format('YYYY-MM-DD') : '',
    },
    (res) => {
      setData(res.data.transaction_list);
      setPaginationData(res.data.pagination);
    }
  );
  /**
   * This Block is making Headers for the column
   * @param Not Required
   */
  const columnsjson = [
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
              {row.original.order_items !== '' && '/' + row.original.order_items.formulary.name}
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
      Header: `${t('page.orders_amount_label')}`,
      accessor: 'amount',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{`$${row.original.amount}`}</span>;
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
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={orderItemList}
                placeholder={t('page.orders_order_item_filter_label')}
                value={orderItemList.filter((option) => option.value === order_item_id)}
                onChange={(selectedOption) => {
                  setOrderItemId(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
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
            <Form.Group className="filter-field-space">
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
      </Row>
      <h1>{t('page.refund_list_label')}</h1>
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
ListRefundPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
  getToggleAllRowsSelectedProps: PropTypes.any,
};
export default ListRefundPage;
