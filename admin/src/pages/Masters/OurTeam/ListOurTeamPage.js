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
import { useListOurTeam, useOurTeamStatusChange, useOurTeamDelete } from 'hooks';
import { setFormatDate } from 'helpers';

const ListOurTeamPage = ({ t }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminOurTeamTable !== undefined && localStorage.adminOurTeamTable !== ''
      ? JSON.parse(localStorage.adminOurTeamTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminOurTeamTable !== undefined && localStorage.adminOurTeamTable !== ''
      ? JSON.parse(localStorage.adminOurTeamTable).searchText
      : ''
  );
  const [paginationData, setPaginationData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.adminOurTeamTable !== undefined && localStorage.adminOurTeamTable !== ''
      ? JSON.parse(localStorage.adminOurTeamTable).selectedStatus
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
    let adminOurTeamTable = {
      searchText: searchText,
      currentPage: currentPage,
      selectedStatus: selectedStatus,
    };
    localStorage.adminOurTeamTable = JSON.stringify(adminOurTeamTable);
  }, [currentPage, searchText, selectedStatus]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    setSelectedStatus('');
    localStorage.removeItem('adminOurTeamTable');
  };
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let our_team_id = tdata.currentTarget.getAttribute('our_team_id');
    navigate(`/our-team/edit/${our_team_id}`);
  };
  /**
   * This function will call on click of delete button, and will display alert,
   * and will call status update API after confirmation
   */
  const handleDeleteClick = (tdata) => {
    let our_team_id = tdata.currentTarget.getAttribute('our_team_id');
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
              <h2>{t('page.delete_alert_popup_message')}</h2>
              <Button
                className="table-delete-button"
                onClick={() => {
                  doDeleteOurTeam({ our_team_id });
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
   * This function will call on status click, and will display alert,
   * and will call status update API after confirmation
   */
  const handleStatusClick = (tdata) => {
    let our_team_id = tdata.currentTarget.getAttribute('data-our_team_id');
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
                  doUpdateStatusOurTeam({ our_team_id });
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
   * Changing Data on Status change / or delete row, and refetching data
   */
  const { mutate: doDeleteOurTeam } = useOurTeamDelete((response) => {
    toast.success(response.message);
    refetch();
  });

  /**
   * !This API will call when user clicks on Status Button, and will update the state after suceess API call
   */
  const { mutate: doUpdateStatusOurTeam } = useOurTeamStatusChange((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.our_team_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.our_team_name_label')}`,
      accessor: 'name',
      disableSortBy: true,
    },
    {
      Header: `${t('page.our_team_designmation_label')}`,
      accessor: 'designation',
      disableSortBy: true,
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
              data-our_team_id={row.original.our_team_id}
              onClick={handleStatusClick.bind(this)}>
              {t(initialValue === 1 ? 'page.active_status_name' : 'page.in_active_status_name')}
            </span>
          </div>
        );
      },
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'our_team_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div>
            <TNButton
              className="table-primary-button"
              our_team_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
            <TNButton
              className="table-delete-button"
              our_team_id={initialValue}
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
  const { refetch } = useListOurTeam([currentPage, searchText, selectedStatus], (res) => {
    setData(res.data.our_team_list);
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
   * This function will call on Add Member button and will take user to the add page of Our Team
   */
  const addMember = () => {
    navigate('/our-team/add');
  };
  /**
   * Default options for status
   */
  const breadcurmArray = [
    {
      label: t('page.our_team_list_label'),
      link: '/our-team/list',
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
              <TNButton loading={false} type="button" onClick={addMember}>
                {t('page.our_team_add_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <h1>{t('page.our_team_list_label')}</h1>
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
ListOurTeamPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListOurTeamPage;
