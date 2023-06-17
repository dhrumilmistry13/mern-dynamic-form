import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Home Page data Routes and pages
 */
const HomePageBannerPage = React.lazy(() => import('./HomePageBannerPage'));
const AboutUSPage = React.lazy(() => import('./AboutUSPage'));
const HowItWorksPage = React.lazy(() => import('./HowItWorksPage'));
const GetInTouchPage = React.lazy(() => import('./GetInTouchPage'));
const GeneralSettingPage = React.lazy(() => import('../GeneralSettingPage'));
const OurTeamSectionPage = React.lazy(() => import('./OurTeamSectionPage'));
const SubscriptionPlanPage = React.lazy(() => import('./SubscriptionPlanPage'));
const SeoSettingPage = React.lazy(() => import('./SeoSettingPage'));
const HomePageRoutes = ({ t }) => {
  return (
    <Routes>
      <Route index exact path="/home-page" element={<HomePageBannerPage t={t} />} />
      <Route exact path="/about-us" element={<AboutUSPage t={t} />} />
      <Route exact path="/how-it-works" element={<HowItWorksPage t={t} />} />
      <Route exact path="/get-in-touch" element={<GetInTouchPage t={t} />} />
      <Route exact path="/general" element={<GeneralSettingPage t={t} />} />
      <Route exact path="/our-team" element={<OurTeamSectionPage t={t} />} />
      <Route exact path="/seo" element={<SeoSettingPage t={t} />} />
      <Route exact path="/subscription-plan" element={<SubscriptionPlanPage t={t} />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
HomePageRoutes.propTypes = {
  t: PropTypes.func,
};
export default HomePageRoutes;
