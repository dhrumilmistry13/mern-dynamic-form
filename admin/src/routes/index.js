// import libs
import { React } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ForgetPasswordPage, LoginPage, OtpVerificationPage, ResetPasswordPage } from 'pages/Auth';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

import { DashboardPage } from 'pages/Dashboard/DashboardPage';
import CmsRoutes from 'pages/Masters/Cms/CmsRoutes';
import EmailTemplateRoutes from 'pages/Masters/EmailTemplate/EmailTemplateRoutes';
import TranslationRoutes from 'pages/Masters/Translations/TranslationRoutes';
import { EditProfilePage, ChangePasswordPage } from 'pages/Accounts/';
import HomePageRoutes from 'pages/Settings/HomePage/HomePageRoutes';
import { useGetSettingData } from 'hooks';
import { addSetting, settingData } from 'store/features/settingSlice';
import OurTeamRoutes from 'pages/Masters/OurTeam/OurTeamRoutes';
import SpecialitiesRoutes from 'pages/Masters/Specialities/SpecialitiesRoutes';
import { PageNotFound } from 'common/components';
import StatesRoutes from 'pages/Masters/States/StatesRoutes';
import QuestionRoutes from 'pages/Masters/Question/QuestionRoute';
import FormularyRoutes from 'pages/Masters/Formulary/FormularyRoutes';
import OrganisationRoutes from 'pages/Masters/Organisation/OrganisationRoutes';
import OrganisationHowItWorks from 'pages/Settings/OrganisationHomePage/OrganisationHowItWorks';
import TransactionPageRoutes from 'pages/Masters/Fianance/Transactions/TransactionPageRoutes';
import OrdersPageRoutes from 'pages/Masters/Fianance/Orders/OrdersPageRoutes';
import PatientRoutes from 'pages/Masters/Patient/PatientRoutes';
import RefundPageRoutes from 'pages/Masters/Fianance/Refund/RefundPageRoutes';

const PagesRoutes = ({ t }) => {
  // Calling useDispatch hook
  const dispatch = useDispatch();
  /**
   * This function will cal on page load, and will set data to redux store
   */
  useGetSettingData(({ data: general_data }) => {
    if (general_data) {
      const dataStore = {
        home_page_general_header_logo: general_data.home_page_general_header_logo,
        home_page_general_header_sub_logo: general_data.home_page_general_header_sub_logo,
        home_page_general_email_logo: general_data?.home_page_general_email_logo,
        home_page_general_favicon_logo: general_data?.home_page_general_favicon_logo,
        home_page_general_seo_title: general_data.home_page_general_seo_title,
        home_page_general_seo_description: general_data.home_page_general_seo_description,
        setting_get: false,
      };
      dispatch(addSetting(dataStore));
    }
  });

  /**
   * Getting data from redux store if already exist
   */
  const getSettingData = useSelector(settingData);
  return (
    <Router basename={'/'}>
      <Helmet>
        <title>Telepath Admin</title>
        <meta name="og:title" content={getSettingData.home_page_general_seo_title} />
        <meta name="title" content={getSettingData.home_page_general_seo_title} />
        <meta name="description" content={getSettingData.home_page_general_seo_description} />
        <meta name="og:description" content={getSettingData.home_page_general_seo_description} />
        <link rel="icon" href={`${getSettingData.home_page_general_favicon_logo}`} />
      </Helmet>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route exact path="/" element={<LoginPage t={t} />} />
          <Route exact path="/login" element={<LoginPage t={t} />} />
          <Route exact path="/forget-password" element={<ForgetPasswordPage t={t} />} />
          <Route exact path="/otp-verification" element={<OtpVerificationPage t={t} />} />
          <Route exact path="/reset-password" element={<ResetPasswordPage t={t} />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route exact path="/dashboard" element={<DashboardPage t={t} />} />
          <Route exact path="/edit-profile" element={<EditProfilePage t={t} />} />
          <Route exact path="/change-password" element={<ChangePasswordPage t={t} />} />
          {/* Cms Routes */}
          <Route path="/cms/*" element={<CmsRoutes t={t} />} />
          {/* Master Email Template Routes */}
          <Route path="/email-template/*" element={<EmailTemplateRoutes t={t} />} />
          {/* Translations Routes */}
          <Route path="/translations/*" element={<TranslationRoutes t={t} />} />
          {/* OUR Team Master Routes */}
          <Route path="/our-team/*" element={<OurTeamRoutes t={t} />} />
          {/* Specialities Master Routes */}
          <Route path="/specialities/*" element={<SpecialitiesRoutes t={t} />} />
          {/* States Master Routes  */}
          <Route path="/states/*" element={<StatesRoutes t={t} />} />
          {/* Question Master Routes  */}
          <Route path="/question/*" element={<QuestionRoutes t={t} />} />
          {/* Formulary Master Routes  */}
          <Route path="/formulary/*" element={<FormularyRoutes t={t} />} />
          {/* Organisation Master Routes  */}
          <Route path="/organisation/*" element={<OrganisationRoutes t={t} />} />
          {/* Fianance Masters Routes */}
          <Route path="/transactions/*" element={<TransactionPageRoutes t={t} />} />
          <Route path="/orders/*" element={<OrdersPageRoutes t={t} />} />
          <Route path="/refund/*" element={<RefundPageRoutes t={t} />} />
          {/* Patient Master Page Routes */}
          <Route path="patient/*" element={<PatientRoutes t={t} />} />
          {/* Settings -> Home Page */}
          <Route path="/settings/*" element={<HomePageRoutes t={t} />} />
          {/* Settings -> Organisation Home Page -> How IT Works Section */}
          <Route
            path="/settings/organisation-how-it-works"
            element={<OrganisationHowItWorks t={t} />}
          />
        </Route>
        <Route>
          <Route path="*" element={<PageNotFound t={t} />} from="admin" />
        </Route>
      </Routes>
    </Router>
  );
};
PagesRoutes.propTypes = {
  t: PropTypes.func,
};
export default PagesRoutes;
