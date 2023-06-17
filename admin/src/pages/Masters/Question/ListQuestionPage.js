import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useListQuestion, useQuestionDelete, useQuestionStatusChange } from 'hooks';
import { dateFormatCommon, setFormatDate } from 'helpers';

const ListQuestionPage = ({ t }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminQuestionTable !== undefined && localStorage.adminQuestionTable !== ''
      ? JSON.parse(localStorage.adminQuestionTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminQuestionTable !== undefined && localStorage.adminQuestionTable !== ''
      ? JSON.parse(localStorage.adminQuestionTable).searchText
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.adminQuestionTable !== undefined && localStorage.adminQuestionTable !== ''
      ? JSON.parse(localStorage.adminQuestionTable).selectedStatus
      : ''
  );
  const [selectedType, setSelectedType] = useState(
    localStorage.adminQuestionTable !== undefined && localStorage.adminQuestionTable !== ''
      ? JSON.parse(localStorage.adminQuestionTable).selectedType
      : ''
  );
  const [selectedQuestionType, setSelectedQuestionType] = useState(
    localStorage.adminQuestionTable !== undefined && localStorage.adminQuestionTable !== ''
      ? JSON.parse(localStorage.adminQuestionTable).selectedQuestionType
      : ''
  );
  const [fromDate, setFromDate] = useState(
    localStorage.adminOrganisationTable !== undefined &&
      localStorage.adminOrganisationTable !== '' &&
      JSON.parse(localStorage.adminOrganisationTable).fromDate !== ''
      ? new Date(JSON.parse(localStorage.adminOrganisationTable).fromDate)
      : ''
  );
  const [toDate, setToDate] = useState(
    localStorage.adminOrganisationTable !== undefined &&
      localStorage.adminOrganisationTable !== '' &&
      JSON.parse(localStorage.adminOrganisationTable).toDate !== ''
      ? new Date(JSON.parse(localStorage.adminOrganisationTable).toDate)
      : ''
  );
  /**
   * Default options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
  ];
  /**
   * Default Options for Question types
   */
  const optionType = [
    { value: '', label: `${t('page.question_type_select_label')}` },
    { value: 1, label: `${t('page.question_type_intake')}` },
    { value: 2, label: `${t('page.question_type_business')}` },
    { value: 5, label: `${t('page.question_type_patient_register')}` },
    { value: 6, label: `${t('page.question_type_patient_insurance')}` },
  ];
  /**
   * Default Options for Options Questions types
   */
  const optionQuestionType = [
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.question_question_type_text')}` },
    { value: 2, label: `${t('page.question_question_type_textarea')}` },
    { value: 3, label: `${t('page.question_question_type_dropdown')}` },
    { value: 4, label: `${t('page.question_question_type_radio')}` },
    { value: 5, label: `${t('page.question_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.question_question_type_upload')}` },
  ];
  const optionQuestionType2 = [
    { value: '', label: `${t('page.question_question_type_select_label')}` },
    { value: 1, label: `${t('page.question_question_type_text')}` },
    { value: 2, label: `${t('page.question_question_type_textarea')}` },
    { value: 3, label: `${t('page.question_question_type_dropdown')}` },
    { value: 4, label: `${t('page.question_question_type_radio')}` },
    { value: 5, label: `${t('page.question_question_type_multiple_choice')}` },
    { value: 6, label: `${t('page.question_question_type_upload')}` },
    { value: 7, label: `${t('page.question_question_type_date')}` },
    { value: 8, disabled: true, label: t('page.question_question_type_state_drop_down') },
  ];
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminQuestionTable = {
      searchText: searchText,
      currentPage: currentPage,
      selectedStatus: selectedStatus,
      selectedType: selectedType,
      selectedQuestionType: selectedQuestionType,
      fromDate: fromDate,
      toDate: toDate,
    };
    localStorage.adminQuestionTable = JSON.stringify(adminQuestionTable);
  }, [
    currentPage,
    searchText,
    selectedStatus,
    selectedType,
    selectedQuestionType,
    fromDate,
    toDate,
  ]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    setSelectedStatus('');
    setSelectedType('');
    setSelectedQuestionType('');
    localStorage.removeItem('adminQuestionTable');
  };
  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('question_id');
    navigate(`/question/edit/${question_id}`);
  };
  /**
   * !This Function will call when user clicks on View Button
   */
  const handleViewClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('question_id');
    navigate(`/question/view/${question_id}`);
  };
  /**
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */ const handleStatusClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('data-question_id');
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
                  doQuestionStatus({ question_id });
                  setCurrentPage(1);
                  onClose();
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
   * This function will call on click of delete button, and will display alert,
   * and will call status update API after confirmation
   */
  const handleDeleteClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('question_id');
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
              <h2>{t('page.delete_question_alert_popup_message')}</h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  doDeleteQuestion({ question_id });
                  onClose();
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
   * Changing Data on Status change / or delete row, and refetching data
   */
  const { mutate: doDeleteQuestion } = useQuestionDelete((response) => {
    toast.success(response.message);
    refetch();
  });
  const { mutate: doQuestionStatus } = useQuestionStatusChange((res) => {
    refetch();
    toast.success(res.message);
  });
  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.question_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.question_label_label')}`,
      accessor: 'label',
      disableSortBy: true,
    },
    {
      Header: `${t('page.question_type_label')}`,
      accessor: 'type',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        if (initialValue === 1) return <Badge bg="primary">{t('page.question_type_intake')}</Badge>;
        else if (initialValue === 2)
          return <Badge bg="success">{t('page.question_type_business')}</Badge>;
        else if (initialValue === 3)
          return (
            <Badge bg="warning" text="dark">
              {t('page.question_type_formulary')}
            </Badge>
          );
        else if (initialValue === 4)
          return <Badge bg="info">{t('page.question_type_checkout')}</Badge>;
        else if (initialValue === 5)
          return <Badge bg="info">{t('page.question_type_patient_register')}</Badge>;
        else if (initialValue === 6)
          return (
            <Badge bg="warning" text="dark">
              {t('page.question_type_patient_insurance')}
            </Badge>
          );
      },
    },
    {
      Header: `${t('page.question_question_type_label')}`,
      accessor: 'question_type',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        if (initialValue === 1)
          return <Badge bg="primary">{t('page.question_question_type_text')}</Badge>;
        else if (initialValue === 2)
          return <Badge bg="success">{t('page.question_question_type_textarea')}</Badge>;
        else if (initialValue === 3)
          return (
            <Badge bg="warning" text="dark">
              {t('page.question_question_type_dropdown')}
            </Badge>
          );
        else if (initialValue === 4)
          return <Badge bg="info">{t('page.question_question_type_radio')}</Badge>;
        else if (initialValue === 5)
          return <Badge bg="danger">{t('page.question_question_type_multiple_choice')}</Badge>;
        else if (initialValue === 6)
          return <Badge bg="dark">{t('page.question_question_type_upload')}</Badge>;
        else if (initialValue === 7)
          return <Badge bg="dark">{t('page.question_question_type_date')}</Badge>;
        else if (initialValue === 8)
          return (
            <Badge bg="warning" text="dark">
              {t('page.question_question_type_state_drop_down')}
            </Badge>
          );
      },
    },
    {
      Header: `${t('page.question_status_label')}`,
      accessor: 'status',
      disableSortBy: true,
      Cell: ({ value: initialValue, row }) => {
        return (
          <div>
            <span
              className={row.original.status === 1 ? 'status-active' : 'status-inactive'}
              data-question_id={row.original.question_id}
              onClick={handleStatusClick.bind(this)}>
              {t(initialValue === 1 ? 'page.active_status_name' : 'page.in_active_status_name')}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'question_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div className="action_btn">
            <TNButton
              className="table-primary-button"
              question_id={initialValue}
              onClick={handleViewClick.bind(this)}>
              {t('page.action_button_text_view')}
            </TNButton>
            <TNButton
              className="table-primary-button"
              question_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
            <TNButton
              className="table-delete-button"
              question_id={initialValue}
              onClick={handleDeleteClick.bind(this)}>
              {t('page.action_button_text_delete')}
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
  const { refetch } = useListQuestion(
    [
      currentPage,
      searchText,
      selectedStatus,
      selectedType,
      selectedQuestionType,
      fromDate !== '' ? moment(fromDate).format('YYYY-MM-DD') : '',
      toDate !== '' ? moment(toDate).format('YYYY-MM-DD') : '',
    ],
    (res) => {
      setData(res.data.question_list);
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
   * This function will call on Add Question button and will take user to the add page of Formulary
   */
  const addQuestion = () => {
    navigate('/question/add');
  };
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.question_list_label'),
      link: '/question/list',
      active: '',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group controlId="search" className="filter-field-space">
              <Form.Control
                placeholder="Search"
                onKeyUp={handleSeach}
                onChange={handleSeach}
                value={searchText}
                className="filter-column form-field"
              />
            </Form.Group>
            <Button
              type="button"
              onClick={handleClearFilter}
              className="secondary-remove-button filter-field-space ml-0">
              {t('page.cancel_search_button')}
            </Button>
            <div className="table-add-button filter-field-space">
              <TNButton loading={false} type="button" onClick={addQuestion}>
                {t('page.question_add_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <div className="filter">
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={optionType}
                value={optionType.filter((option) => option.value === selectedType)}
                onChange={(selectedOption) => {
                  setSelectedType(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={selectedType === 5 ? optionQuestionType2 : optionQuestionType}
                value={
                  selectedType === 5
                    ? optionQuestionType2.filter((option) => option.value === selectedQuestionType)
                    : optionQuestionType.filter((option) => option.value === selectedQuestionType)
                }
                onChange={(selectedOption) => {
                  setSelectedQuestionType(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
            <Form.Group className="filter-field-space">
              <Select
                className="filter-column"
                options={options}
                value={options.filter((option) => option.value === selectedStatus)}
                onChange={(selectedOption) => {
                  setSelectedStatus(selectedOption.value);
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
            <Button
              type="button"
              onClick={clearDateFilter}
              className="secondary-remove-button filter-field-space ml-0">
              {t('page.clear_date_search_button')}
            </Button>
          </div>
        </Col>
      </Row>
      <h1>{t('page.question_list_label')}</h1>
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
ListQuestionPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListQuestionPage;
