import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Form Routes, and pages
 */
const ListFormPage = React.lazy(() => import('./ListFormPage'));
// const AddQuestionPage = React.lazy(() => import('./AddQuestionPage'));
// const EditQuestionPage = React.lazy(() => import('./EditQuestionPage'));
const ViewFormPage = React.lazy(() => import('./ViewFormPage'));
// const SubmitQuestionPage = React.lazy(() => import('./SubmitQuestionPage'));

const FormRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/" element={<ListFormPage t={t} />} />
      <Route exact path="/view/:form_id" element={<ViewFormPage t={t} />} />
    </Routes>
  );
};
FormRoutes.propTypes = {
  t: PropTypes.func,
};
export default FormRoutes;
