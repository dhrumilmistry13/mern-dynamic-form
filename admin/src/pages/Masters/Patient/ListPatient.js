/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik } from 'formik';

import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useListPatients, usePatienStatusChange, useGetOrganisationList } from 'hooks';
import { dateFormatCommon, setFormatDate } from 'helpers';
import validationSchema from './StatusUpdateValidations';

const ListPatient = ({ t }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).currentPage
      : 1
  );
  const [organation_id, setOrganizationId] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).organation_id
      : ''
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).searchText
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectedAdminStatus, setSelectedAdminStatus] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).selectedAdminStatus
      : ''
  );
  const [selectedUserStatus, setSelectedUserStatus] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).selectedUserStatus
      : ''
  );
  const [selectedProfileStatus, setSelectedProfileStatus] = useState(
    localStorage.adminPatientTable !== undefined && localStorage.adminPatientTable !== ''
      ? JSON.parse(localStorage.adminPatientTable).selectedProfileStatus
      : ''
  );
  const [fromDate, setFromDate] = useState(
    localStorage.adminPatientTable !== undefined &&
      localStorage.adminPatientTable !== '' &&
      JSON.parse(localStorage.adminPatientTable).fromDate !== ''
      ? new Date(JSON.parse(localStorage.adminPatientTable).fromDate)
      : ''
  );
  const [toDate, setToDate] = useState(
    localStorage.adminPatientTable !== undefined &&
      localStorage.adminPatientTable !== '' &&
      JSON.parse(localStorage.adminPatientTable).toDate !== ''
      ? new Date(JSON.parse(localStorage.adminPatientTable).toDate)
      : ''
  );
  /**
   * Default Options for user Status
   */
  const userOptions = [
    { value: '', label: `${t('page.select_user_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
    { value: 3, label: `${t('page.lock_active_status_name')}` },
  ];
  /**
   * Default Options for Admin Status
   */
  const adminOptions = [
    { value: '', label: `${t('page.select_admin_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * Default Options for Profile setup Status
   */
  const profileOptions = [
    { value: '', label: `${t('page.select_profile_status')}` },
    { value: 1, label: `${t('page.completed_status_name')}` },
    { value: 2, label: `${t('page.pending_status_name')}` },
  ];
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminPatientTable = {
      searchText: searchText,
      currentPage: currentPage,
      organation_id: organation_id,
      selectedAdminStatus: selectedAdminStatus,
      selectedUserStatus: selectedUserStatus,
      selectedProfileStatus: selectedProfileStatus,
      fromDate: fromDate,
      toDate: toDate,
    };
    localStorage.adminPatientTable = JSON.stringify(adminPatientTable);
  }, [
    currentPage,
    searchText,
    organation_id,
    selectedUserStatus,
    selectedAdminStatus,
    selectedProfileStatus,
    fromDate,
    toDate,
  ]);
  /**
   * !This block will call on click clear Data and it will clear all the data including date
   */
  const handleClearFilter = () => {
    setSearchText('');
    setOrganizationId('');
    setCurrentPage(1);
    setSelectedAdminStatus('');
    setSelectedUserStatus('');
    setSelectedProfileStatus('');
    localStorage.removeItem('adminPatientTable');
  };
  /**
   * !This block will call on click clear date
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
      label: t('page.patient_list_label'),
      link: '/patient/list',
      active: '',
    },
  ];
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let user_id = tdata.currentTarget.getAttribute('user_id');
    navigate(`/patient/edit/${user_id}`);
  };
  /**
   * !This Function will call when user clicks on View Button, and this will redirect user to view page,
   * and that will display that particular Patient
   */
  const handleViewClick = (tdata) => {
    let user_id = tdata.currentTarget.getAttribute('user_id');
    navigate(`/patient/general-details/${user_id}`);
  };
  /**
   * !This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doUpdateStatusPatient } = usePatienStatusChange((response) => {
    toast.success(response.message);
    // refetch();
    setTimeout(function () {
      refetch();
    }, 500);
  });

  /***
   * List Organisation Data
   */
  let organisationList = [];
  const { data: Organisation_data, isLoding: isOrganizationData } = useGetOrganisationList();
  if (!isOrganizationData && Organisation_data) {
    organisationList = Organisation_data?.data
      ?.filter((data) => {
        return data.organization_info !== '' || data.organation_id !== '';
      })
      .map((val) => {
        return { value: val.organation_id, label: val.organization_info.company_name };
      });
  }
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */

  /**
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */
  const handleStatusClick = (tdata) => {
    let user_id = tdata.currentTarget.getAttribute('user_id');
    let type = tdata.currentTarget.getAttribute('type');
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
              <h2>{t('page.status_alert_popup_message')}</h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  doUpdateStatusPatient({ user_id, type });
                  onClose();
                  setCurrentPage(1);
                }}>
                {t('page.alert_popup_yes_button')}
              </Button>
              <Button className="table-primary-button" onClick={onClose}>
                {t('page.alert_popup_no_button')}
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  /**
   * This function will call on Admin status click, and will display alert,
   * If admin status is active, admin must have to mention reason to inactive status
   * and will call status update API after confirmation
   */
  const handleStatusAdminClick = (tdata) => {
    let user_id = tdata.currentTarget.getAttribute('user_id');
    let type = tdata.currentTarget.getAttribute('type');
    let admin_status = tdata.currentTarget.getAttribute('admin_status');
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
              <h2>{t('page.status_alert_popup_message')}</h2>
              {type === 'admin' && admin_status == 1 ? (
                <Formik
                  initialValues={{ reason: '' }}
                  enableReinitialize
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    let reason = values.reason;
                    doUpdateStatusPatient({ user_id, type, reason });
                    onClose();
                    setCurrentPage(1);
                  }}>
                  {({ handleSubmit, values, touched, errors, handleChange, handleBlur }) => {
                    return (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group>
                          <Form.Control
                            placeholder="Mension reason"
                            className={
                              'mt-3 mb-2 ' +
                              (touched.reason && errors.reason
                                ? 'form-field-error'
                                : touched.reason && !errors.reason
                                ? 'form-field-success'
                                : '')
                            }
                            name="reason"
                            type="text"
                            as="textarea"
                            row={4}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.reason}
                          />
                          <div className="form-field-error-text text-start">
                            {touched.reason && errors.reason ? <div>{t(errors.reason)}</div> : null}
                          </div>
                        </Form.Group>
                        <Button type="submit" className="table-delete-button">
                          {t('page.alert_popup_yes_button')}
                        </Button>
                        <Button className="table-primary-button" onClick={onClose}>
                          {t('page.alert_popup_no_button')}
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              ) : (
                <>
                  <Button
                    type="submit"
                    className="table-delete-button"
                    onClick={() => {
                      doUpdateStatusPatient({ user_id, type });
                      onClose();
                      setCurrentPage(1);
                    }}>
                    {t('page.alert_popup_yes_button')}
                  </Button>
                  <Button className="table-primary-button" onClick={onClose}>
                    {t('page.alert_popup_no_button')}
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      },
    });
  };

  /**
   * !This Block is making Headers for the column
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.patient_created_at')}`,
      accessor: 'created_at',
      disableSortBy: false,
      Cell: ({ value }) => {
        return <div>{setFormatDate(value)}</div>;
      },
    },
    {
      Header: `${t('page.patient_full_name_label')}`,
      accessor: 'first_name',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {row.original.first_name} {row.original.last_name}
          </span>
        );
      },
    },
    {
      Header: `${t('page.patient_email_label')}`,
      accessor: 'email',
      disableSortBy: true,
    },
    {
      Header: `${t('page.patient_phone_label')}`,
      accessor: 'phone',
      disableSortBy: true,
      Cell: ({ row }) =>
        row.original.phone && (
          <span>{`+${row.original.countries.phone_code} - ${row.original.phone}`}</span>
        ),
    },
    {
      Header: `${t('page.patient_company_name_label')}`,
      accessor: 'company_name',
      disableSortBy: true,
    },
    {
      Header: `${t('page.patient_profile_setup_label')}`,
      accessor: 'profile_setup',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        if (initialValue === 1)
          return <Badge bg="primary">{t('page.patient_profile_setup_completed')}</Badge>;
        else initialValue === 2;
        return <Badge bg="warning">{t('page.patient_profile_setup_pending')}</Badge>;
      },
    },
    {
      Header: (
        <span>
          {t('page.patient_user_status_label')}
          <br />
          {t('page.patient_admin_status_label')}
        </span>
      ),
      accessor: 'admin_status',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <>
            <div>
              <span
                className={row.original.user_status === 1 ? 'status-active' : 'status-inactive'}
                type="user"
                user_id={row.original.user_id}
                onClick={handleStatusClick.bind(this)}>
                {t(
                  row.original.user_status === 1
                    ? 'page.active_status_name'
                    : row.original.user_status === 3
                    ? 'page.lock_active_status_name'
                    : 'page.in_active_status_name'
                )}
              </span>
            </div>
            <div>
              <span
                className={row.original.admin_status === 1 ? 'status-active' : 'status-inactive'}
                user_id={row.original.user_id}
                admin_status={row.original.admin_status}
                type="admin"
                onClick={handleStatusAdminClick.bind(this)}>
                {t(
                  row.original.admin_status === 1
                    ? 'page.active_status_name'
                    : 'page.in_active_status_name'
                )}
              </span>
            </div>
          </>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'user_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div className="action_btn">
            <TNButton
              className="table-primary-button"
              user_id={initialValue}
              onClick={handleViewClick.bind(this)}>
              {t('page.action_button_text_view')}
            </TNButton>
            <TNButton
              className="table-primary-button"
              user_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
          </div>
        );
      },
      disableSortBy: true,
    },
  ];
  /**
   * !This API will call while Page Load and set data. Once data load we are updating State
   */
  const { refetch } = useListPatients(
    {
      page: currentPage,
      organation_id: organation_id,
      serach_text: searchText,
      user_status: selectedUserStatus,
      admin_status: selectedAdminStatus,
      profile_status: selectedProfileStatus,
      from_date: fromDate !== '' ? moment(fromDate).format('YYYY-MM-DD') : '',
      to_date: toDate !== '' ? moment(toDate).format('YYYY-MM-DD') : '',
    },
    (res) => {
      setData(res.data.patient_list);
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

  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group controlId="search" className="filter-field-space">
              <Form.Control
                placeholder={t('page.patient_search_placeholder')}
                className="filter-column form-field"
                onKeyUp={handleSeach}
                onChange={handleSeach}
                value={searchText}
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
            <Form.Group controlId="search" className="filter-field-space">
              <Select
                className="filter-column select-design"
                options={organisationList}
                placeholder={t('page.patient_organisation_filter_label')}
                value={organisationList.filter((option) => option.value === organation_id)}
                onChange={(selectedOption) => {
                  setOrganizationId(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column select-design"
                options={userOptions}
                value={userOptions.filter((userOption) => userOption.value === selectedUserStatus)}
                onChange={(selectedOption) => {
                  setSelectedUserStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column select-design"
                options={adminOptions}
                value={adminOptions.filter((option) => option.value === selectedAdminStatus)}
                onChange={(selectedOption) => {
                  setSelectedAdminStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column select-design"
                options={profileOptions}
                value={profileOptions.filter(
                  (userOption) => userOption.value === selectedProfileStatus
                )}
                onChange={(selectedOption) => {
                  setSelectedProfileStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
          </div>
          <div className="filter">
            <Form.Label className="field-label date-picker-label">
              {t('page.patient_from_date_label')}
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
              {t('page.patient_to_date_label')}
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
      <h1>{t('page.patient_list_label')}</h1>
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
ListPatient.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListPatient;
