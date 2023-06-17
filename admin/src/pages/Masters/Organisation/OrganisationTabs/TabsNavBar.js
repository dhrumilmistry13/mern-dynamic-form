import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const TabsNavBar = ({ t, user_id }) => {
  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to={`/organisation/general-details/${user_id}`}>
            {t('page.view_gereral_detail_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/business-details/${user_id}`}>
            {t('page.view_business_details_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/brand-color/${user_id}`}>
            {t('page.view_brand_color_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/intake-details/${user_id}`}>
            {t('page.vew_intake_questions_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/formulary-details/${user_id}`}>
            {t('page.view_formulary_details_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/subscription-details/${user_id}`}>
            {t('page.view_subscription_details_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/availability/${user_id}`}>
            {t('page.view_availability_organisation_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/organisation/booking-list/${user_id}`}>
            {t('page.view_booking_list_organisation_label')}
          </NavLink>
        </Nav.Item>
      </Nav>
    </>
  );
};
TabsNavBar.propTypes = {
  t: PropTypes.func,
  user_id: PropTypes.number,
};
export default TabsNavBar;
