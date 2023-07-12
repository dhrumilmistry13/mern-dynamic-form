import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { TNButton, TNTable } from 'common/components';
import { useListQuestion, useQuestionDelete, useQuestionStatusChange } from 'hooks';
import { setFormatDate } from 'helpers';

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

  /**
   * Default options for status
   */
  const options = [
    { value: '', label: `${t('page.select_status')}` },
    { value: 1, label: `${t('page.active_status_name')}` },
    { value: 2, label: `${t('page.in_active_status_name')}` },
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
    };
    localStorage.adminQuestionTable = JSON.stringify(adminQuestionTable);
  }, [currentPage, searchText, selectedStatus, selectedType, selectedQuestionType]);
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

  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('question_id');
    navigate(`/edit/${question_id}`);
  };
  /**
   * !This Function will call when user clicks on View Button
   */
  const handleViewClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('question_id');
    navigate(`/view/${question_id}`);
  };
  /**
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */ const handleStatusClick = (tdata) => {
    let question_id = tdata.currentTarget.getAttribute('data-question_id');
    let status = tdata.currentTarget.getAttribute('data-status');
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
                  doQuestionStatus({ question_id, status });
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
      accessor: 'createdAt',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.question_label_label')}`,
      accessor: 'question',
      disableSortBy: true,
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
              className={row.original.status ? 'status-active' : 'status-inactive'}
              data-question_id={row.original.id}
              data-status={row.original.status ? 2 : 1}
              onClick={handleStatusClick.bind(this)}>
              {t(initialValue ? 'page.active_status_name' : 'page.in_active_status_name')}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'id',
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
    [currentPage, searchText, selectedStatus, selectedType, selectedQuestionType],
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
    navigate('/add');
  };
  const submitQuestion = () => {
    navigate('/submit');
  };
  const formList = () => {
    navigate('/form');
  };

  return (
    <div className="container-fluid">
      <Row>
        <Col lg={12}>
          <h1>{t('page.question_list_label')}</h1>
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
            <div className="table-add-button filter-field-space">
              <TNButton loading={false} type="button" onClick={submitQuestion}>
                Submit Question Form
              </TNButton>
            </div>
            <div className="table-add-button filter-field-space">
              <TNButton loading={false} type="button" onClick={formList}>
                Form List
              </TNButton>
            </div>
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
    </div>
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
