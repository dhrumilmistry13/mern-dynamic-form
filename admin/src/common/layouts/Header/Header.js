import React from 'react';
import PropTypes from 'prop-types';
import { Container, NavDropdown, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutSuccess, loggedUser } from 'store/features/authSlice';
import { LogoUrlFront } from '../';

const Header = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * This function will call on edit profile link and take user to the edit profilr page
   */
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  /**
   * This function will call on log out button, after that user will be logged out from system
   */
  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/login');
  };
  /**
   * This will provide data from redux store, weather user is Logged in or not
   */
  const checkLoggenInUser = useSelector(loggedUser);

  const { t } = props;
  /**
   * This is Icon which works as dropdown, and will displays sub links on click of Icon
   */
  const UserMenu = (
    <svg width="9" height="21" viewBox="0 0 9 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="4.44691" cy="4.49619" rx="1.44691" ry="1.49619" fill="#9592A6" />
      <ellipse cx="4.44691" cy="10.4886" rx="1.44691" ry="1.49619" fill="#9592A6" />
      <ellipse cx="4.44691" cy="16.4809" rx="1.44691" ry="1.49619" fill="#9592A6" />
    </svg>
  );

  return (
    <>
      <Navbar className="sticky-top navbar-section">
        <Container fluid className="container-section">
          <Navbar.Brand className="dashboard-logo">
            <LogoUrlFront />
          </Navbar.Brand>

          <div className="header-setting-menu">
            <div className="dashboard-toggle-btn">
              <FontAwesomeIcon icon={faBars} onClick={props.toggleClass} />
            </div>
            <div className="desktop-login-name">
              <span>
                {checkLoggenInUser.user.first_name + ' ' + checkLoggenInUser.user.last_name}
              </span>
            </div>
            <div className="profile-img">
              <img
                src={checkLoggenInUser.user.profile_image}
                width="40px"
                height="40px"
                alt="profile_img"
              />
            </div>
            <NavDropdown title={UserMenu}>
              <div className="mobile-login-name">
                <span>
                  {checkLoggenInUser.user.first_name + ' ' + checkLoggenInUser.user.last_name}
                </span>
                <NavDropdown.Divider className="separator" />
              </div>
              <NavDropdown.Item className="setting-items" onClick={handleEditProfile}>
                {t('page.header_editprofile')}
              </NavDropdown.Item>
              <NavDropdown.Item className="setting-items" onClick={handleLogout}>
                {t('page.header_logout')}
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

Header.propTypes = {
  toggleClass: PropTypes.any.isRequired,
  t: PropTypes.func,
};

export { Header };
