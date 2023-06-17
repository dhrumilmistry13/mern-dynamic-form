import { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { TNBreadCurm, TNButton, TNTable } from 'common/components';
import { useListEmailTemplate } from 'hooks';
import { setFormatDate } from 'helpers';

const ListEmailTemplatePage = ({ t }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  /**
   * setting state values to local storage,
   */
  const [currentPage, setCurrentPage] = useState(
    localStorage.adminEmailTemplateTable !== undefined &&
      localStorage.adminEmailTemplateTable !== ''
      ? JSON.parse(localStorage.adminEmailTemplateTable).currentPage
      : 1
  );
  const [searchText, setSearchText] = useState(
    localStorage.adminEmailTemplateTable !== undefined &&
      localStorage.adminEmailTemplateTable !== ''
      ? JSON.parse(localStorage.adminEmailTemplateTable).searchText
      : ''
  );
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminEmailTemplateTable = {
      searchText: searchText,
      currentPage: currentPage,
    };
    localStorage.adminEmailTemplateTable = JSON.stringify(adminEmailTemplateTable);
  }, [currentPage, searchText]);

  /**
   * This will clear all state values, and localstorage as well
   */
  const handleClearFilter = () => {
    setSearchText('');
    setCurrentPage(1);
    localStorage.removeItem('adminEmailTemplateTable');
  };
  /**
   * !This Function will call when user clicks on Edit Button
   * @param {*} tdata which is current element of button
   */
  const handleEditClick = (tdata) => {
    let email_template_id = tdata.currentTarget.getAttribute('email_template_id');
    navigate(`/email-template/edit/${email_template_id}`);
  };

  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.email_template_created_at')}`,
      accessor: 'created_at',
      disableSortBy: true,
      Cell: ({ value: initialValue }) => {
        return setFormatDate(initialValue);
      },
    },
    {
      Header: `${t('page.email_template_title_label')}`,
      accessor: 'title',
      disableSortBy: true,
    },
    {
      Header: `${t('page.action_column')}`,
      accessor: 'email_template_id',
      Cell: ({ value: initialValue }) => {
        return (
          <div>
            <TNButton
              className="table-primary-button"
              email_template_id={initialValue}
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
  useListEmailTemplate([currentPage, searchText], (res) => {
    setData(res.data.email_template_list);
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
   * This function will call on Add Template button and will take user to the add page of Email Templates
   */
  const addEmailTemplate = () => {
    navigate('/email-template/add');
  };
  /**
   * BreadCum labels and links
   */
  const breadcurmArray = [
    {
      label: t('page.email_template_list_label'),
      link: '/email-template/list',
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
              <TNButton loading={false} type="button" onClick={addEmailTemplate}>
                {t('page.email_template_add_button')}
              </TNButton>
            </div>
          </div>
        </Col>
      </Row>
      <h1>{t('page.email_template_list_label')}</h1>
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
ListEmailTemplatePage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
};
export default ListEmailTemplatePage;
