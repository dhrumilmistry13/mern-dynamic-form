import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useListFormulary, useFormularyStatusChange, useFormularyDelete } from 'hooks';
import { setFormatDate } from 'helpers';

const ListFormularyPage = ({ t }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminFormularyTable !== undefined && localStorage.adminFormularyTable !== ''
      ? JSON.parse(localStorage.adminFormularyTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminFormularyTable !== undefined && localStorage.adminFormularyTable !== ''
      ? JSON.parse(localStorage.adminFormularyTable).searchText
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.adminFormularyTable !== undefined && localStorage.adminFormularyTable !== ''
      ? JSON.parse(localStorage.adminFormularyTable).selectedStatus
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
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminFormularyTable = {
      searchText: searchText,
      currentPage: currentPage,
      selectedStatus: selectedStatus,
    };
    localStorage.adminFormularyTable = JSON.stringify(adminFormularyTable);
  }, [currentPage, searchText, selectedStatus]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    setSelectedStatus('');
    localStorage.removeItem('adminFormularyTable');
  };
  /**
   * !This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doUpdateFormularyStatus } = useFormularyStatusChange((response) => {
    toast.success(response.message);
    refetch();
  });

  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/formulary/edit/${formulary_id}`);
  };
  /**
   * !This Function will call when user clicks on View Button, and this will redirect user to view page,
   * and that will display that particular formulary
   */
  const handleViewClick = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/formulary/view/${formulary_id}`);
  };
  /**
   * This function will call on questions button, and will take user to the formulary related questions page
   */
  const handleViewQuestion = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
    navigate(`/formulary/medical-question/${formulary_id}`);
  };
  /**
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */
  const handleStatusClick = (tdata) => {
    let formulary_id = tdata.currentTarget.getAttribute('data-formulary_id');
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
                  doUpdateFormularyStatus({ formulary_id });
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
    let formulary_id = tdata.currentTarget.getAttribute('formulary_id');
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
              <h2>{t('page.delete_formulary_alert_popup_message')}</h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  doDeleteFormulary({ formulary_id });
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
  const { mutate: doDeleteFormulary } = useFormularyDelete((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.formulary_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.formulary_name_label')}`,
      accessor: 'name',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        let formula_name;
        if (initialValue && initialValue?.length > 50) {
          formula_name = initialValue?.slice(0, 50);
        } else {
          formula_name = initialValue;
        }
        return <div>{formula_name && formula_name}</div>;
      },
    },
    {
      Header: `${t('page.formulary_price_label')}`,
      accessor: 'price',
      disableSortBy: true,
    },
    {
      Header: `${t('page.formulary_packing_shipping_fee_label')}`,
      accessor: 'packing_shipping_fee',
      disableSortBy: true,
    },
    {
      Header: `${t('page.featured_image_label')}`,
      accessor: 'featured_image',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return (
          <div>
            <img className="table-image" src={initialValue} alt="featured-image" />
          </div>
        );
      },
    },
    {
      Header: `${t('page.formulary_status_label')}`,
      accessor: 'status',
      disableSortBy: true,
      Cell: ({ value: initialValue, row }) => {
        return (
          <div>
            <span
              className={row.original.status === 1 ? 'status-active' : 'status-inactive'}
              data-formulary_id={row.original.formulary_id}
              onClick={handleStatusClick.bind(this)}>
              {t(initialValue === 1 ? 'page.active_status_name' : 'page.in_active_status_name')}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'formulary_id',
      Cell: ({ value: initialValue }) => {
        return (
          <>
            <div className="action_btn">
              <TNButton
                className="table-primary-button"
                formulary_id={initialValue}
                onClick={handleViewClick.bind(this)}>
                {t('page.action_button_text_view')}
              </TNButton>
              <TNButton
                className="table-primary-button"
                formulary_id={initialValue}
                onClick={handleEditClick.bind(this)}>
                {t('page.action_button_text_edit')}
              </TNButton>
              <TNButton
                className="table-primary-button"
                formulary_id={initialValue}
                onClick={handleViewQuestion.bind(this)}>
                {t('page.action_button_text_view_questions')}
              </TNButton>
              <TNButton
                className="table-delete-button"
                formulary_id={initialValue}
                onClick={handleDeleteClick.bind(this)}>
                {t('page.action_button_text_delete')}
              </TNButton>
            </div>
          </>
        );
      },
      disableSortBy: true,
    },
  ];

  /**
   * !This API will call while Page Load and set data. Once data load we are updating State
   */
  const { refetch } = useListFormulary([currentPage, searchText, selectedStatus], (res) => {
    setData(res.data.formulary_list);
    setPaginationData(res.data.pagination);
  });

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
   * This function will call on Add Formulary button and will take user to the add page of Formulary
   */
  const addFormulary = () => {
    navigate('/formulary/add');
  };
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.formulary_list_label'),
      link: '/formulary/list',
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
                options={options}
                value={options.filter((option) => option.value === selectedStatus)}
                onChange={(selectedOption) => {
                  setSelectedStatus(selectedOption.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
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
              <TNButton loading={false} type="button" onClick={addFormulary}>
                {t('page.formulary_add_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <h1>{t('page.formulary_list_label')}</h1>
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
ListFormularyPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListFormularyPage;
