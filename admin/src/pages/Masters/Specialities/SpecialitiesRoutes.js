import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Specialities Routes and pages
 */
const ListSpecialitiesPage = React.lazy(() => import('./ListSpecialitiesPage'));
const AddSpecialitiesPage = React.lazy(() => import('./AddSpecialitiesPage'));
const EditSpecialitiesPage = React.lazy(() => import('./EditSpecialitiesPage'));

const SpecialitiesRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListSpecialitiesPage t={t} />} />
      <Route exact path="/add" element={<AddSpecialitiesPage t={t} />} />
      <Route exact path="/edit/:specialities_id" element={<EditSpecialitiesPage t={t} />} />
    </Routes>
  );
};
SpecialitiesRoutes.propTypes = {
  t: PropTypes.func,
};
export default SpecialitiesRoutes;
