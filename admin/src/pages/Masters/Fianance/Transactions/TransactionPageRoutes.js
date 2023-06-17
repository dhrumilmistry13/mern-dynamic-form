import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Transaction Routes and pages
 */
const ListTransactions = React.lazy(() => import('./ListTransactions'));

const TransactionPageRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListTransactions t={t} />} />
    </Routes>
  );
};
TransactionPageRoutes.propTypes = {
  t: PropTypes.func,
};
export default TransactionPageRoutes;
