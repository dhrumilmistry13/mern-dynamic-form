import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; // Import

import { TNBreadCurm, TNButton, TNTable } from 'common/components';

import { useListTranslation, useSyncTranslation, useTranslationDelete } from 'hooks';
import { setFormatDate } from 'helpers';

const ListTranslationPage = ({ t }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [syncB, setSyncB] = useState(1);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminTranslationTable !== undefined && localStorage.adminTranslationTable !== ''
      ? JSON.parse(localStorage.adminTranslationTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminTranslationTable !== undefined && localStorage.adminTranslationTable !== ''
      ? JSON.parse(localStorage.adminTranslationTable).searchText
      : ''
  );
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminTranslationTable = {
      searchText: searchText,
      currentPage: currentPage,
    };
    localStorage.adminTranslationTable = JSON.stringify(adminTranslationTable);
  }, [currentPage, searchText]);
  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    localStorage.removeItem('adminTranslationTable');
  };
  const [paginationData, setPaginationData] = useState(null);
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let translation_id = tdata.currentTarget.getAttribute('translation_id');
    navigate(`/translations/edit/${translation_id}`);
  };
  /**
   * This will call an API to delete translation
   */
  const { mutate: doDeleteTranslation } = useTranslationDelete((response) => {
    toast.success(response.message);
    refetch();
  });
  /**
   * This function will call on click of delete button, and will display alert,
   * and will call status update API after confirmation
   */
  const handleDeleteClick = (tdata) => {
    let translation_id = tdata.currentTarget.getAttribute('translation_id');
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
                  doDeleteTranslation({ translation_id });
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
   * !This Block is making Headers for the column
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.translation_created_at')}`,
      accessor: 'created_at',
      disableSortBy: false,
      Cell: ({ value }) => {
        return <div>{setFormatDate(value)}</div>;
      },
    },
    {
      Header: `${t('page.translation_key_label')}`,
      accessor: 'key',
      disableSortBy: false,
      Cell: ({ value: initialValue, row }) => {
        return <div>{`${row.original.group}.${initialValue}`}</div>;
      },
    },
    {
      Header: `${t('page.translation_text_label')}`,
      accessor: 'text',
      disableSortBy: false,
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'translation_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div className="d-flex">
            <TNButton
              className="table-primary-button"
              translation_id={initialValue}
              onClick={handleEditClick.bind(this)}>
              {t('page.action_button_text_edit')}
            </TNButton>
            <TNButton
              className="table-delete-button"
              translation_id={initialValue}
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
  const { refetch } = useListTranslation([currentPage, searchText], (res) => {
    setData(res.data.translations_list);
    setPaginationData(res.data.pagination);
    setSyncB(res.data.setting.text_value);
  });
  /**
   * !This API will call when user click on Sync Button, and it will sync bewly added data
   */
  const { mutate: doSyncTranslation } = useSyncTranslation((response) => {
    toast.success(response.message);
    refetch();
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
   * This function will call on Add Translation button Click and will take user to the add page of Translations
   */
  const addTranslationHandle = () => {
    navigate('/translations/add');
  };
  /**
   * This function will call on sync button Click and will call a function to call api
   */
  const syncTranslationHandle = () => {
    doSyncTranslation();
  };
  /**
   * Breadcum Lebel and Link
   */
  const breadcurmArray = [
    {
      label: t('page.translation_list_label'),
      link: '/translations/list',
      active: '',
    },
  ];
  return (
    <>
      <TNBreadCurm breadcurmArray={breadcurmArray} />
      <Row>
        <Col>
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
            <div className="table-add-button">
              <TNButton
                loading={false}
                type="button"
                onClick={addTranslationHandle}
                className="filter-field-space">
                {t('page.translation_add_button')}
              </TNButton>
              <TNButton
                loading={false}
                isdirtyform={syncB === 2 || syncB === '2' ? 0 : 1}
                type="button"
                className="filter-field-space"
                onClick={syncTranslationHandle}>
                {t('page.translation_sync_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <h1>{t('page.translation_list_label')}</h1>
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
ListTranslationPage.propTypes = {
  columns: PropTypes.any,
  row: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
};
export default ListTranslationPage;
