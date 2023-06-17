import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Our Teams Routes and pages
 */
const ListOurTeamPage = React.lazy(() => import('./ListOurTeamPage'));
const AddOurTeamPage = React.lazy(() => import('./AddOurTeamPage'));
const EditOurTeamPage = React.lazy(() => import('./EditOurTeamPage'));

const OurTeamRoutes = ({ t }) => {
  /**
   * Oue Team Routes and pages
   */
  return (
    <Routes>
      <Route index exact path="/list" element={<ListOurTeamPage t={t} />} />
      <Route exact path="/add" element={<AddOurTeamPage t={t} />} />
      <Route exact path="/edit/:our_team_id" element={<EditOurTeamPage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
OurTeamRoutes.propTypes = {
  t: PropTypes.func,
};
export default OurTeamRoutes;
