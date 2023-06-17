import React from 'react';
import PropTypes from 'prop-types';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

import 'assets/scss/components/_pagination.scss';

const Pagination = ({ paginationData, page, setPage }) => {
  return (
    <div className="pagination-tabs">
      <button className="pagination-button" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {paginationData.last_page > 1 ? (
        <>
          {page > 1 && (
            <Button
              onClick={() => {
                setPage(page - 1);
              }}
              className="pagination-button custom-icon">{`${page - 1}`}</Button>
          )}
          <Button className="active-page pagination-active-button">{page}</Button>
          {paginationData.last_page > 2 && paginationData.last_page !== page ? '...' : ''}
        </>
      ) : (
        <Button className="active-page pagination-active-button">{page}</Button>
      )}
      {paginationData && paginationData.hasMorePages ? (
        <Button
          className="pagination-button custom-icon"
          onClick={() => {
            setPage(paginationData.last_page);
          }}>
          {paginationData.last_page}
        </Button>
      ) : (
        ''
      )}
      <button
        className="pagination-button"
        disabled={page === paginationData.last_page || paginationData.last_page <= 1}
        onClick={() => setPage(page + 1)}>
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};
Pagination.propTypes = {
  paginationData: PropTypes.object,
  page: PropTypes.any,
  setPage: PropTypes.func,
};
export default Pagination;
