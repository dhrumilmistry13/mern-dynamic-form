import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Translations Routes, and pages
 */
const ListTranslationPage = React.lazy(() => import('./ListTranslationPage'));
const AddTranslationPage = React.lazy(() => import('./AddTranslationPage'));
const EditTranslationPage = React.lazy(() => import('./EditTranslationPage'));

const TranslationRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListTranslationPage t={t} />} />
      <Route exact path="/add" element={<AddTranslationPage t={t} />} />
      <Route exact path="/edit/:translation_id" element={<EditTranslationPage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
TranslationRoutes.propTypes = {
  t: PropTypes.func,
};
export default TranslationRoutes;
