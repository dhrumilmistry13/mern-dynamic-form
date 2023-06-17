import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Transaction Orders Routes and pages
 */
const ListOrdersPage = React.lazy(() => import('./ListOrdersPage'));

const OrdersPageRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListOrdersPage t={t} />} />
    </Routes>
  );
};
OrdersPageRoutes.propTypes = {
  t: PropTypes.func,
};
export default OrdersPageRoutes;
