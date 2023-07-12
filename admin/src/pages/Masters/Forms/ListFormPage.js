import { useEffect, useMemo, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { TNButton, TNTable } from 'common/components';
import { useGetFormListData } from 'hooks/useRQQuestion';

const ListFormPage = ({ t }) => {
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
  const [paginationData, setPaginationData] = useState(null);
  /**
   * This will run on page renders, and read data from localstorage,
   * and set it to their corresponding states
   */
  useEffect(() => {
    let adminQuestionTable = {
      currentPage: currentPage,
    };
    localStorage.adminQuestionTable = JSON.stringify(adminQuestionTable);
  }, [currentPage]);

  /**
   * !This Function will call when user clicks on View Button
   */
  const handleViewClick = (tdata) => {
    let form_id = tdata.currentTarget.getAttribute('form_id');
    navigate(`/form/view/${form_id}`);
  };

  /**
   * !This Block is making Headers for the column, and setting data to respective columns
   * @param Not Required
   */

  const columnsjson = [
    {
      Header: `${t('page.question_label_label')}`,
      accessor: '_id',
      disableSortBy: true,
    },
    {
      Header: `${t('page.action_column')}`,
      Cell: ({ row }) => {
        return (
          <div className="action_btn">
            <TNButton
              className="table-primary-button"
              form_id={row.original._id}
              onClick={handleViewClick.bind(this)}>
              {t('page.action_button_text_view')}
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
  useGetFormListData([currentPage], (res) => {
    setData(res.data.question_list);
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
  const handleCancel = () => {
    navigate(`/`);
  };
  return (
    <Container>
      <Row>
        <Col lg={12} style={{ marginTop: '1rem' }}>
          <button className="btn btn-success" onClick={handleCancel}>
            Back to Question List
          </button>
          <h1 style={{ textAlign: 'center' }}>Forms List</h1>
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
    </Container>
  );
};
ListFormPage.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  paginationData: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  row: PropTypes.any,
};
export default ListFormPage;
