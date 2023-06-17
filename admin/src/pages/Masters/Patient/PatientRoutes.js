import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Patient Routes, and Pages
 */
const ListPatient = React.lazy(() => import('./ListPatient'));
const ViewPatientDetailsPage = React.lazy(() => import('./ViewPatientDetailsPage'));
const EditPatientPage = React.lazy(() => import('./EditPatientPage'));
const ViewBasicDetails = React.lazy(() => import('./PatientTabs/ViewBasicDetails'));
const ViewInsuranceDetails = React.lazy(() => import('./PatientTabs/ViewInsuranceDetails'));
const PatientChartPage = React.lazy(() => import('./PatientTabs/PatientChartPage'));
const OrderDetailsPage = React.lazy(() => import('./PatientTabs/OrderDetailsPage'));
const ViewIntakeQuestions = React.lazy(() => import('./PatientTabs/ViewIntakeQuestions'));
const ViewMedicalQuestions = React.lazy(() => import('./PatientTabs/ViewMedicalQuestions'));
const ViewBookingList = React.lazy(() => import('./PatientTabs/BookingTabPage'));

const PatientRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/list" element={<ListPatient t={t} />} />
      <Route exact path="/edit/:user_id" element={<EditPatientPage t={t} />} />
      <Route exact path="/general-details/:user_id" element={<ViewPatientDetailsPage t={t} />} />
      <Route exact path="/basic-details/:user_id" element={<ViewBasicDetails t={t} />} />
      <Route exact path="/insurance-details/:user_id" element={<ViewInsuranceDetails t={t} />} />
      <Route exact path="/chart/:user_id" element={<PatientChartPage t={t} />} />
      <Route exact path="/booking-list/:user_id" element={<ViewBookingList t={t} />} />
      <Route
        exact
        path="/chart/:user_id/order-details/:order_id"
        element={<OrderDetailsPage t={t} />}
      />
      <Route
        exact
        path="/chart/:user_id/general-intake/:order_id"
        element={<ViewIntakeQuestions t={t} />}
      />
      <Route
        exact
        path="/chart/:user_id/medical-intake/:order_id/formulary/:formulary_id"
        element={<ViewMedicalQuestions t={t} />}
      />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};

PatientRoutes.propTypes = {
  t: PropTypes.func,
};
export default PatientRoutes;
