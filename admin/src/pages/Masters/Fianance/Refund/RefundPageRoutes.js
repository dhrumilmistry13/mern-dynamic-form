import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Transaction Orders Routes and pages
 */
const ListRefundPage = React.lazy(() => import('./ListRefundPage'));

const RefundPageRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListRefundPage t={t} />} />
    </Routes>
  );
};
RefundPageRoutes.propTypes = {
  t: PropTypes.func,
};
export default RefundPageRoutes;
