import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Questions Routes, and pages
 */
const ListQuestionPage = React.lazy(() => import('./ListQuestionPage'));
const AddQuestionPage = React.lazy(() => import('./AddQuestionPage'));
const EditQuestionPage = React.lazy(() => import('./EditQuestionPage'));
const ViewQuestionPage = React.lazy(() => import('./ViewQuestionPage'));
const SubmitQuestionPage = React.lazy(() => import('./SubmitQuestionPage'));

const QuestionRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/" element={<ListQuestionPage t={t} />} />
      <Route exact path="/add" element={<AddQuestionPage t={t} />} />
      <Route exact path="/edit/:question_id" element={<EditQuestionPage t={t} />} />
      <Route exact path="/view/:question_id" element={<ViewQuestionPage t={t} />} />
      <Route exact path="/submit" element={<SubmitQuestionPage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
QuestionRoutes.propTypes = {
  t: PropTypes.func,
};
export default QuestionRoutes;
