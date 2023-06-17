import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const initialState = {
  queryPageIndex: 0,
};

const PAGE_CHANGED = 'PAGE_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function TNTable({
  columns,
  data,
  paginationData,
  t,
  onSelectPage,
  idName = '',
  pageIndexGet = 0,
}) {
  initialState.queryPageIndex = pageIndexGet;
  const [{ queryPageIndex }, dispatch] = React.useReducer(reducer, initialState);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
    rows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: queryPageIndex,
      },
      autoResetFilters: false,
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: paginationData.last_page,
    },
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    onSelectPage(pageIndex);
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  const firstPageRows = rows.slice(0, 20);
  return (
    <>
      <Table
        {...getTableProps()}
        responsive
        className="text-center table-sortable booking-list"
        id={idName}>
        <thead className="align-middle">
          {headerGroups.map((headerGroup, key) => (
            <tr key={key}>
              {headerGroup.headers.map((column, key) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={key}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className={firstPageRows.length === 0 ? 'd-none' : ''}>
          {firstPageRows.map((row, key) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={key}>
                {row.cells.map((cell, key) => {
                  return (
                    <td {...cell.getCellProps()} key={key}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tbody {...getTableBodyProps()} className={firstPageRows.length === 0 ? '' : 'd-none'}>
          <tr>
            <td colSpan={columns.length}>{t('page.no_data_found_table')}</td>
          </tr>
        </tbody>
      </Table>
      <br />
      <div className="paginationtable">
        <Row className={firstPageRows.length === 0 ? 'd-none' : ''}>
          <Col lg={12} xs={12}>
            <div className="tablepagination">
              <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
              </Button>
              <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
              </Button>
              <span>
                Page
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </span>
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </Button>
              <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
TNTable.propTypes = {
  columns: PropTypes.any,
  column: PropTypes.any,
  paginationData: PropTypes.any,
  data: PropTypes.any,
  pageIndexGet: PropTypes.any,
  t: PropTypes.func,
  idName: PropTypes.string,
  onSelectPage: PropTypes.func,
  handleCheckboxSelection: PropTypes.any,
};

export default TNTable;
