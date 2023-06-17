import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Formulary Pages and routes
 */
const ListFormularyPage = React.lazy(() => import('./ListFormularyPage'));
const AddFormularyPage = React.lazy(() => import('./AddFormularyPage'));
const ViewFormularyPage = React.lazy(() => import('./ViewFormularyPage'));
const EditFormularyPage = React.lazy(() => import('./EditFormularyPage'));
const MedicalQuestions = React.lazy(() => import('../MedicalQuestions/MedicalQuestions'));

const FormularyRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListFormularyPage t={t} />} />
      <Route exact path="/add" element={<AddFormularyPage t={t} />} />
      <Route exact path="/view/:formulary_id" element={<ViewFormularyPage t={t} />} />
      <Route exact path="/edit/:formulary_id" element={<EditFormularyPage t={t} />} />
      <Route exact path="/medical-question/:formulary_id" element={<MedicalQuestions t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
FormularyRoutes.propTypes = {
  t: PropTypes.func,
};
export default FormularyRoutes;
