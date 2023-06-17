import React, { useMemo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
// import { loggedUser } from 'store/features/authSlice';
import { Row, Col, Form, Card, Button, Modal, Badge } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'assets/scss/components/_table.scss';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment-timezone';
import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useParams, useNavigate } from 'react-router';
import TabsNavBar from './TabsNavBar';

import {
  dateFormatCommon,
  defaultValue,
  setFormatDate,
  defaultTimeFormate,
  momentTimezoneChange,
  defaultDateTimeFormate,
} from 'helpers/commonHelpers';

import { usePatientBookingList, useGetTimezoneList, useGetPatientTimezoneData } from 'hooks';

const BookingListOrganisationPage = ({ t }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [timezoneState, setTimezoneState] = useState('');
  const [selectedBookingStatus, setSelectedBookingStatus] = useState('');
  const [serach_text, setSearchText] = useState('');
  const [bookData, setBookData] = useState('');
  const [show, setShow] = useState(false);
  const [timezoneIdStateId, setTimezoneStateId] = useState('');
  const [orgTimezone, setOrgTimezone] = useState('');
  const { data: timezone } = useGetPatientTimezoneData(user_id);
  if (timezoneState === '' && timezone) {
    setTimezoneState(timezone.data.utc);
  }
  // /**
  //  * Default Options for Booking Status
  //  */
  const options = [
    { value: 1, label: `${t('page.patient_booking_tab_pending_text')}` },
    { value: 2, label: `${t('page.patient_booking_tab_accepted_text')}` },
    { value: 3, label: `${t('page.patient_booking_tab_rejected_text')}` },
    { value: 4, label: `${t('page.patient_booking_tab_completed_text')}` },
    { value: 5, label: `${t('page.patient_booking_tab_no_show_both_text')}` },
    { value: 6, label: `${t('page.patient_booking_tab_no_show_patient_text')}` },
    { value: 7, label: `${t('page.patient_booking_tab_no_show_organization_text')}` },
    { value: 8, label: `${t('page.patient_booking_tab_reschedule_text')}` },
    { value: 9, label: `${t('page.patient_booking_tab_cancel_by_system_text')}` },
    { value: 10, label: `${t('page.patient_booking_tab_status_Cancel_text')}` },
  ];
  const dateFromRef = useRef();
  const dateToRef = useRef();

  /**
   * This api call will gives List of Timezone
   */
  const { isLoading: timezoneListIsLoad, data: timezoneList } = useGetTimezoneList();
  const optionsTimezone = [];
  if (timezoneList !== undefined) {
    timezoneList.data.map((val) => {
      return optionsTimezone.push({
        value: val.utc,
        label: val.text + ' (' + val.utc + ')',
      });
    });
  }

  /**
   * This block will call on Search and set Search Text and set Page
   */
  const handleSeach = (event) => {
    setSearchText(event.target.value);
    if (serach_text !== '' && serach_text.length > 2) {
      setCurrentPage(1);
    }
    if (event.currentTarget.value === '') {
      setCurrentPage(1);
      setSearchText('');
    }
  };
  /**
   * !This block will call on View Click, and View Open Note Model
   */
  const handleViewBookingClick = (tdata) => {
    let booking_data = tdata.currentTarget.getAttribute('data-book');
    const noteData = JSON.parse(booking_data);
    console.log(noteData);
    setBookData(noteData);
    setShow(true);
  };

  /**
   * This function will Close the close Model
   */
  const handleClose = () => setShow(false);

  // /**
  //  * This will run on page renders, and read data from localstorage,
  //  * and set it to their corresponding states
  //  */
  useEffect(() => {
    let orgBookingListTable = {
      page: currentPage,
      start_date: start_date,
      end_date: end_date,
      booking_status: selectedBookingStatus,
      timezone: timezoneState,
      serach_text: serach_text,
    };
    localStorage.removeItem('orgBookingListTable');
    localStorage.orgBookingListTable = JSON.stringify(orgBookingListTable);
  }, [currentPage, start_date, end_date, selectedBookingStatus, timezoneState, serach_text]);

  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSelectedBookingStatus('');
    setCurrentPage(1);
    setSearchText('');
    localStorage.removeItem('orgBookingListTable');
    refetch();
  };
  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };
  const pageIndexHandle = (pageIndex) => {
    setCurrentPage(pageIndex + 1);
  };
  /**
   * !This Block is making Headers for the column
   * @param Not Required
   */
  const columnsjson = [
    {
      Header: `${t('page.patient_booking_tab_created_at_label')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{setFormatDate(row.original.created_at)}</span>;
      },
    },
    {
      Header: `${t('page.patient_booking_tab_booking_id_label')}`,
      accessor: 'bookings_id',
      disableSortBy: true,
      Cell: ({ row }) => {
        return <span>{row.original.bookings_id}</span>;
      },
    },
    {
      Header: `${t('page.patient_tab_booking_book_date_label')}`,
      accessor: 'book_date',
      disableSortBy: true,
      Cell: ({ row }) => {
        return (
          <span>
            {momentTimezoneChange(
              orgTimezone,
              timezoneState,
              'YYYY-MM-DD HH:mm:ss',
              'MM-DD-YYYY',
              row.original.book_date + ' ' + row.original.start_time
            )}
          </span>
        );
      },
    },
    {
      Header: `${t('page.patient_booking_tab_start_time_label')}`,
      accessor: 'start_time',
      disableSortBy: true,
      Cell: ({ row }) => {
        const startTime = momentTimezoneChange(
          orgTimezone,
          timezoneState,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          row.original.book_date + ' ' + row.original.start_time
        );
        const endTime = momentTimezoneChange(
          orgTimezone,
          timezoneState,
          'YYYY-MM-DD HH:mm:ss',
          'DD-MM-YYYY hh:mm A',
          row.original.book_date + ' ' + row.original.end_time
        );
        if (
          moment(startTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD') <
          moment(endTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD')
        ) {
          return (
            <span>
              {moment(startTime, 'DD-MM-YYYY hh:mm A').format(defaultDateTimeFormate)}
              {' To '}
              {moment(endTime, 'DD-MM-YYYY hh:mm A').format(defaultDateTimeFormate)}
            </span>
          );
        } else {
          return (
            <span>
              {moment(startTime, 'DD-MM-YYYY hh:mm A').format(defaultTimeFormate)}
              {' To '}
              {moment(endTime, 'DD-MM-YYYY hh:mm A').format(defaultTimeFormate)}
            </span>
          );
        }
      },
    },
    {
      Header: `${t('page.patient_booking_tab_booking_status_label')}`,
      accessor: 'user_id',
      disableSortBy: true,
      Cell: ({ row }) => {
        if (row.original.booking_status === 1)
          return <Badge className="warning">{t('page.patient_booking_tab_pending_text')}</Badge>;
        else if (row.original.booking_status === 2)
          return <Badge className="primary">{t('page.patient_booking_tab_accepted_text')}</Badge>;
        else if (row.original.booking_status === 3)
          return <Badge className="rejected">{t('page.patient_booking_tab_rejected_text')}</Badge>;
        else if (row.original.booking_status === 4)
          return (
            <Badge className="completed">{t('page.patient_booking_tab_completed_text')}</Badge>
          );
        else if (row.original.booking_status === 5)
          return (
            <Badge className="no-show-both">
              {t('page.patient_booking_tab_no_show_both_text')}
            </Badge>
          );
        else if (row.original.booking_status === 6)
          return (
            <Badge className="no-show-patient">
              {t('page.patient_booking_tab_no_show_patient_text')}
            </Badge>
          );
        else if (row.original.booking_status === 7)
          return (
            <Badge className="no-show-org">
              {t('page.patient_booking_tab_no_show_organization_text')}
            </Badge>
          );
        else if (row.original.booking_status === 8)
          return (
            <Badge className="rescheduale-org">
              {t('page.patient_booking_tab_reschedule_organization_text')}
            </Badge>
          );
        else if (row.original.booking_status === 9)
          return (
            <Badge className="cancel-by-sys">
              {t('page.patient_booking_tab_cancel_by_system_text')}
            </Badge>
          );
        else if (row.original.booking_status === 10)
          return (
            <Badge className="cancel-status">
              {t('page.patient_booking_tab_cancel_status_text')}
            </Badge>
          );
      },
    },
    {
      Header: `${t('page.patient_booking_tab_booking_action_label')}`,
      accessor: 'booking_status',
      Cell: ({ value: initialValue, row }) => {
        if (initialValue === 10) {
          if (row.original.cancellation_by === 1) {
            return (
              <>
                <div className="action_btn">
                  <TNButton
                    className="table-primary-button btn-view"
                    data-book={JSON.stringify(row.original)}
                    onClick={handleViewBookingClick.bind(this)}>
                    {t('page.patient_booking_list_action_button_view_text')}
                  </TNButton>
                </div>
                <Badge className="cancel-status">
                  {t('page.patient_booking_tab_booking_canceled_by_patient_text')}
                </Badge>
              </>
            );
          }
          if (row.original.cancellation_by === 2) {
            return (
              <>
                <div className="action_btn">
                  <TNButton
                    className="table-primary-button btn-view"
                    data-book={JSON.stringify(row.original)}
                    onClick={handleViewBookingClick.bind(this)}>
                    {t('page.patient_booking_list_action_button_view_text')}
                  </TNButton>
                </div>
                <Badge className="cancel-status">
                  {t('page.patient_booking_tab_canceled_by_organization_text')}
                </Badge>
              </>
            );
          }
          if (row.original.cancellation_by === 3) {
            return (
              <>
                <div className="action_btn">
                  <TNButton
                    className="table-primary-button btn-view"
                    data-book={JSON.stringify(row.original)}
                    onClick={handleViewBookingClick.bind(this)}>
                    {t('page.patient_booking_list_action_button_view_text')}
                  </TNButton>
                </div>
                <Badge className="cancel-status">
                  {t('page.patient_booking_tab_canceled_by_admin_text')}
                </Badge>
              </>
            );
          }
        } else {
          return (
            <div className="action_btn">
              <TNButton
                className="table-primary-button btn-view"
                data-book={JSON.stringify(row.original)}
                onClick={handleViewBookingClick.bind(this)}>
                {t('page.patient_booking_list_action_button_view_text')}
              </TNButton>
            </div>
          );
        }
      },
      disableSortBy: true,
    },
  ];
  const columns = useMemo(() => columnsjson, [timezoneState]);
  /**
   * !This API will call while Page Load and set data. Once data load we are updating State
   */
  const { refetch } = usePatientBookingList(
    {
      page: currentPage,
      user_id,
      start_date: start_date !== '' ? moment(start_date).format('YYYY-MM-DD') : '',
      end_date: end_date !== '' ? moment(end_date).format('YYYY-MM-DD') : '',
      booking_status: selectedBookingStatus,
      serach_text: serach_text,
      timezone_id: timezoneIdStateId,
      timezone: timezoneState,
    },
    (res) => {
      setData(res.data.data_list);
      setOrgTimezone(res.data.orgTimezone);
      setTimezoneState(res.data.default_timezone);
      setTimezoneStateId(res.data.default_timezone_id);
      setPaginationData(res.data.pagination);
    }
  );
  if (paginationData === null) {
    return null;
  }

  /**
   * This function will Redirect to Patient List Page When Call
   */
  const handleCancel = () => {
    navigate(`/patient/list`);
  };

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
      label: t('page.view_booking_list_patient_label'),
      link: '',
      active: 'active',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <TabsNavBar user_id={user_id} t={t} />
      <Card className="inner-box">
        <Card.Body>
          <Row>
            <Col lg={12}>
              <div className="filter">
                <Form.Group className="filter-field-space">
                  <Select
                    className="column"
                    isMulti={true}
                    options={options}
                    placeholder={t('page.patient_booking_tab_filter_status_label')}
                    value={defaultValue(options, selectedBookingStatus.split(','))}
                    onChange={(selectedOption) => {
                      let statusArr = [];
                      selectedOption &&
                        selectedOption?.map((op) => {
                          statusArr.push(op.value);
                          return statusArr;
                        });
                      let strVal = statusArr.join(',');
                      setSelectedBookingStatus(strVal);
                      setCurrentPage(1);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="search" className="filter-field-space">
                  <Form.Control
                    placeholder="Search"
                    className="filter-column form-field"
                    onKeyUp={handleSeach}
                    onChange={handleSeach}
                    value={serach_text}
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
                <Form.Group className="filter-field-space">
                  <Select
                    className="filter-column button-text-color timezone-drpdown custom-icon"
                    options={timezoneListIsLoad ? optionsTimezone : optionsTimezone}
                    placeholder={t('page.patient_booking_tab_timezone_label')}
                    value={optionsTimezone.filter((option) => option.value === timezoneState)}
                    onChange={(selectedOption) => {
                      setTimezoneState(selectedOption.value);
                      setTimezoneStateId(selectedOption.timezone_id);
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
                    className="form-control filter-column date-input ps-3"
                    placeholderText={dateFormatCommon().toUpperCase()}
                    selected={start_date}
                    ref={dateFromRef}
                    dateFormat={dateFormatCommon()}
                    onChange={(date) => {
                      setStartDate(date);
                      setCurrentPage(1);
                    }}
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
                    className="form-control filter-column date-input ps-3"
                    placeholderText={dateFormatCommon().toUpperCase()}
                    minDate={start_date}
                    selected={end_date}
                    ref={dateToRef}
                    dateFormat={dateFormatCommon()}
                    onChange={(date) => {
                      setEndDate(date);
                      setCurrentPage(1);
                    }}
                  />
                </Form.Group>
                <Button
                  type="button"
                  onClick={clearDateFilter}
                  className="secondary-remove-button filter-field-space ml-0">
                  {t('page.clear_date_filter__button_text')}
                </Button>
              </div>
            </Col>
          </Row>
          <TNTable
            columns={columns}
            data={data}
            paginationData={paginationData}
            onSelectPage={pageIndexHandle}
            t={t}
            pageIndexGet={currentPage - 1}
            key={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
          />
          <div className="primary-button">
            <span className="link-center" onClick={handleCancel}>
              {t('page.cancel_button_text')}
            </span>
          </div>
        </Card.Body>
      </Card>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        className="modal-specific modal-note"
        aria-labelledby="contained-modal-title-vcenter">
        <Modal.Body>
          <h2 className="fw-bold mb-3 text-center">
            {t('page.patient_booking_list_tab_note_model_heading_heading')}
          </h2>
          <div className="wrapper-note">
            <h4 className="field-label">{t('page.patient_booking_tab_book_note_label')}</h4>
            <div className="description">{bookData.booking_notes}</div>
          </div>
          {bookData.booking_status === 10 ? (
            <div className="wrapper-note mt-3">
              <h4 className="field-label">{t('page.patient_booking_tab_reason_label')}</h4>
              <div className="description">{bookData.reason}</div>
            </div>
          ) : (
            ''
          )}
          <div className="working-details">
            <Row className="working-text-center ">
              <Col lg={12} className="d-flex justify-content-end mt-3 gap-2">
                <Button type="button" onClick={handleClose} className="button-rounded">
                  {t('page.patient_booking_list_tab_cancel_button_text')}
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
BookingListOrganisationPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default BookingListOrganisationPage;
