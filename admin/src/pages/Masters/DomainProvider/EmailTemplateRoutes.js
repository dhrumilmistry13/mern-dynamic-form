import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Email Templates Pages and routes
 */
const ListEmailTemplatePage = React.lazy(() => import('./ListEmailTemplatePage'));
const AddEmailTemplatePage = React.lazy(() => import('./AddEmailTemplatePage'));
const EditEmailTemplatePage = React.lazy(() => import('./EditEmailTemplatePage'));

const EmailTemplateRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListEmailTemplatePage t={t} />} />
      <Route exact path="/add" element={<AddEmailTemplatePage t={t} />} />
      <Route exact path="/edit/:email_template_id" element={<EditEmailTemplatePage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
EmailTemplateRoutes.propTypes = {
  t: PropTypes.func,
};
export default EmailTemplateRoutes;
