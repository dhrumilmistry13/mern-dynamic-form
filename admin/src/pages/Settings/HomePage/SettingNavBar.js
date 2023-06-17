import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const SettingNavBar = ({ t }) => {
  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to="/settings/seo">{t('page.settings_home_page_seo')}</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/home-page">{t('page.settings_home_page_banner')}</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/about-us">{t('page.settings_home_page_about_us_label')}</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/how-it-works">
            {t('page.settings_home_page_how_it_works_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/get-in-touch">
            {t('page.settings_home_page_get_in_touch_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/our-team">{t('page.settings_home_page_our_team_label')}</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/settings/subscription-plan">
            {t('page.settings_home_page_subscription_plan_label')}
          </NavLink>
        </Nav.Item>
      </Nav>
    </>
  );
};
SettingNavBar.propTypes = {
  t: PropTypes.func,
};
export default SettingNavBar;
