import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * CMS Pages and routes
 */
const ListCmsPage = React.lazy(() => import('./ListCmsPage'));
const AddCmsPage = React.lazy(() => import('./AddCmsPage'));
const EditCmsPage = React.lazy(() => import('./EditCmsPage'));

const CmsRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListCmsPage t={t} />} />
      <Route exact path="/add" element={<AddCmsPage t={t} />} />
      <Route exact path="/edit/:cms_id" element={<EditCmsPage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
CmsRoutes.propTypes = {
  t: PropTypes.func,
};
export default CmsRoutes;
