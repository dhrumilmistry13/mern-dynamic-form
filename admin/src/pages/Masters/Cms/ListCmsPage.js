import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; // Import

import { TNButton, TNTable } from 'common/components';

import { useListCms, useCmsStatusChange, useCmsDelete } from 'hooks';
import { TNBreadCurm } from 'common/components';
import { setFormatDate } from 'helpers';

const ListCmsPage = ({ t }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminCmsTable !== undefined && localStorage.adminCmsTable !== ''
      ? JSON.parse(localStorage.adminCmsTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminCmsTable !== undefined && localStorage.adminCmsTable !== ''
      ? JSON.parse(localStorage.adminCmsTable).searchText
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.adminCmsTable !== undefined && localStorage.adminCmsTable !== ''
      ? JSON.parse(localStorage.adminCmsTable).selectedStatus
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
    let adminCmsTable = {
      searchText: searchText,
      currentPage: currentPage,
      selectedStatus: selectedStatus,
    };
    localStorage.adminCmsTable = JSON.stringify(adminCmsTable);
  }, [currentPage, searchText, selectedStatus]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    setSelectedStatus('');
    localStorage.removeItem('adminCmsTable');
  };
  /**
   * !This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doUpdateStatusCms } = useCmsStatusChange((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * !This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doDeleteStatusCms } = useCmsDelete((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let cms_id = tdata.currentTarget.getAttribute('cms_id');
    navigate(`/cms/edit/${cms_id}`);
  };
  const handleDeleteClick = (tdata) => {
    let cms_id = tdata.currentTarget.getAttribute('cms_id');
    doDeleteStatusCms({ cms_id });
  };
  /**
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */
  const handleStatusClick = (tdata) => {
    let cms_id = tdata.currentTarget.getAttribute('data-cms_id');
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
                  doUpdateStatusCms({ cms_id });
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
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.cms_created_at')}`,
      accessor: 'created_at',
      disableSortBy: false,
      Cell: ({ value }) => {
        return <div>{setFormatDate(value)}</div>;
      },
    },
    {
      Header: `${t('page.cms_title_label')}`,
      accessor: 'title',
      disableSortBy: false,
    },
    {
      Header: `${t('page.cms_is_active_label')}`,
      accessor: 'is_active',
      disableSortBy: true,
      Cell: ({ value: initialValue, row }) => {
        return (
          <div>
            <span
              className={row.original.is_active === 1 ? 'status-active' : 'status-inactive'}
              data-cms_id={row.original.cms_id}
              onClick={handleStatusClick.bind(this)}>
              {t(initialValue === 1 ? 'page.active_status_name' : 'page.in_active_status_name')}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'cms_id',
      Cell: ({ value: initialValue, row }) => {
        return (
          <div>
            <TNButton
              className="table-primary-button"
              cms_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
            <TNButton
              onClick={() => {
                var textField = document.createElement('textarea');
                textField.innerText = `https://${window.location.host.replace('admin.', '')}/page/${
                  row.original.slug
                }`;
                document.body.appendChild(textField);
                textField.select();
                document.execCommand('copy');
                textField.remove();
                toast.success(t('page.cms_page_copy_url_success'));
              }}>
              Copy
            </TNButton>
            <TNButton
              className="table-delete-button"
              cms_id={initialValue}
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
  const { refetch } = useListCms([currentPage, searchText, selectedStatus], (res) => {
    setData(res.data.cms_list);
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
   * This function will call on Search input's onChange event
   */
  const handleSeach = (search_text) => {
    setSearchText(search_text.target.value);
    setCurrentPage(1);
  };
  /**
   * This function will call on Add CMS button and will take user to the add page of CMS
   */
  const addCmsHandle = () => {
    navigate('/cms/add');
  };
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.cms_list_label'),
      link: '/cms/list',
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
            <div className="table-add-button filter-field-space">
              <TNButton loading={false} type="button" onClick={addCmsHandle}>
                {t('page.cms_add_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <h1>{t('page.cms_list_label')}</h1>
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
ListCmsPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListCmsPage;
