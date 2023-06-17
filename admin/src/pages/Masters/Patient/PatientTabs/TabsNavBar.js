import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const TabsNavBar = ({ t, user_id }) => {
  /**
   * Patient Routes and pages
   */
  return (
    <>
      <Nav className="tab-navigation">
        <Nav.Item>
          <NavLink to={`/patient/general-details/${user_id}`}>
            {t('page.view_gereral_detail_patient_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/patient/basic-details/${user_id}`}>
            {t('page.view_basic_detail_patient_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/patient/insurance-details/${user_id}`}>
            {t('page.view_insurance_detail_patient_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/patient/chart/${user_id}`}>
            {t('page.view_patient_chart_detail_patient_label')}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={`/patient/booking-list/${user_id}`}>
            {t('page.view_patient_booking_list_label')}
          </NavLink>
        </Nav.Item>
      </Nav>
    </>
  );
};
TabsNavBar.propTypes = {
  t: PropTypes.any,
  user_id: PropTypes.any,
};
export default TabsNavBar;
