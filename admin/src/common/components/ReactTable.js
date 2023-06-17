import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useTable, useRowSelect, usePagination, useSortBy } from 'react-table';
import { TNButton } from './TNButton';
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
const IndeterminateCheckbox = forwardRef(({ indeterminate, checked, name, ...rest }, ref) => {
  const defaultRef = useRef(checked);
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
    resolvedRef.current.checked = checked;
  }, [resolvedRef, indeterminate, checked]);

  return (
    <>
      <Form.Check
        type="checkbox"
        ref={resolvedRef}
        checked={checked}
        name={name}
        id={name}
        {...rest}
      />
    </>
  );
});
IndeterminateCheckbox.displayName = 'CheckBox';

const ReactTable = ({
  columns,
  data,
  paginationData,
  t,
  onSelectPage,
  idName = '',
  pageIndexGet = 0,
  handleCheckboxSelection,
}) => {
  // Use the state and functions returned from useTable to build your UI
  initialState.queryPageIndex = pageIndexGet;
  const [{ queryPageIndex }, dispatch] = React.useReducer(reducer, initialState);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { pageIndex },
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
    usePagination,
    useRowSelect
    // (hooks) => {
    //   hooks.visibleColumns.push(columns);
    // }
  );
  React.useEffect(() => {
    onSelectPage(pageIndex);
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);
  const firstPageRows = rows.slice(0, 20);
  // Render the UI for your table
  return (
    <>
      <div className="table-add-button filter filter-field-space">
        <TNButton
          loading={false}
          type="button"
          onClick={() => handleCheckboxSelection(selectedFlatRows)}>
          {t('page.orders_update_status_button_text')}
        </TNButton>
      </div>
      <Table {...getTableProps()} responsive className="text-center table-sortable" id={idName}>
        <thead className="align-middle">
          {headerGroups.map((headerGroup, key) => (
            <tr key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, key) => (
                <th key={key} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, key) => {
                  return (
                    <td key={key} {...cell.getCellProps()}>
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
};
ReactTable.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  handleCheckboxSelection: PropTypes.any,
  handleCheckboxStateChange: PropTypes.any,
  row: PropTypes.any,
  getToggleAllRowsSelectedProps: PropTypes.any,
  column: PropTypes.any,
  paginationData: PropTypes.any,
  pageIndexGet: PropTypes.any,
  t: PropTypes.func,
  idName: PropTypes.string,
  onSelectPage: PropTypes.func,
  selectedRows: PropTypes.any,
  setSelectedRows: PropTypes.any,
  setSelectOrderType: PropTypes.any,
  orderType: PropTypes.any,
};
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any,
  checked: PropTypes.any,
  name: PropTypes.any,
};
export { ReactTable, IndeterminateCheckbox };
