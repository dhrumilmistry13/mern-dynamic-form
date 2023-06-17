import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Organisatio Routes, and Pages
 */
const ListOrganisationPage = React.lazy(() => import('./ListOrganisationPage'));
const AddOrganisationPage = React.lazy(() => import('./AddOrganisationPage'));
const EditOrganisationPage = React.lazy(() => import('./EditOrganisationPage'));
const ViewOrganisationPage = React.lazy(() => import('./ViewOrganisationPage'));
const BusinessDetailsTab = React.lazy(() => import('./OrganisationTabs/BusinessDetailsTab'));
const SubscriptionTab = React.lazy(() => import('./OrganisationTabs/SubscriptionTab'));
const BrandColorDetailsTab = React.lazy(() => import('./OrganisationTabs/BrandColorDetailsTab'));
const ViewIntakeQuestionTab = React.lazy(() => import('./OrganisationTabs/ViewIntakeQuestionTab'));
const ViewOrganisationFormularyPage = React.lazy(() =>
  import('./OrganisationTabs/ViewOrganisationFormularyPage')
);
const MedicalQuestions = React.lazy(() => import('../MedicalQuestions/MedicalQuestions'));
const AvailabilityTab = React.lazy(() => import('./OrganisationTabs/AvailabilityTab'));
const BookingTab = React.lazy(() => import('./OrganisationTabs/BookingTab'));

const OrganisationRoutes = ({ t }) => {
  /**
   * Organization Tab Routes and pages
   */
  return (
    <Routes>
      <Route index exact path="/list" element={<ListOrganisationPage t={t} />} />
      <Route exact path="/add" element={<AddOrganisationPage t={t} />} />
      <Route exact path="/edit/:user_id" element={<EditOrganisationPage t={t} />} />
      <Route exact path="/general-details/:user_id" element={<ViewOrganisationPage t={t} />} />
      <Route exact path="/subscription-details/:user_id" element={<SubscriptionTab t={t} />} />
      <Route exact path="/business-details/:user_id" element={<BusinessDetailsTab t={t} />} />
      <Route exact path="/brand-color/:user_id" element={<BrandColorDetailsTab t={t} />} />
      <Route exact path="/intake-details/:user_id" element={<ViewIntakeQuestionTab t={t} />} />
      <Route exact path="/intake-details/:user_id" element={<ViewOrganisationPage t={t} />} />
      <Route
        exact
        path="/formulary-details/:user_id"
        element={<ViewOrganisationFormularyPage t={t} />}
      />
      <Route
        exact
        path="/formulary-details/:user_id/medical-question/:formulary_id"
        element={<MedicalQuestions t={t} />}
      />
      <Route exact path="/availability/:user_id" element={<AvailabilityTab t={t} />} />
      <Route exact path="/booking-list/:user_id" element={<BookingTab t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
OrganisationRoutes.propTypes = {
  t: PropTypes.func,
};
export default OrganisationRoutes;
