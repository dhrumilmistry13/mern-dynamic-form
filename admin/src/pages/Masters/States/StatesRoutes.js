import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * State Routes and Pages
 */
const ListStatesPage = React.lazy(() => import('./ListStatesPage'));
const AddStatesPage = React.lazy(() => import('./AddStatesPage'));
const EditStatesPage = React.lazy(() => import('./EditStatesPage'));

const StatesRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListStatesPage t={t} />} />
      <Route exact path="/add" element={<AddStatesPage t={t} />} />
      <Route exact path="/edit/:state_id" element={<EditStatesPage t={t} />} />
    </Routes>
  );
};
StatesRoutes.propTypes = {
  t: PropTypes.func,
};
export default StatesRoutes;
