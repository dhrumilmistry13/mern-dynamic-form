import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { settingData } from 'store/features/settingSlice';
import { Header } from 'common/layouts/Header/Header';
import { Sidebar } from 'common/layouts/Sidebar/Sidebar';

const LogoUrlFront = () => {
  /**
   * This will provide  general information from redux store, like logos, and titles
   */
  const getSettingData = useSelector(settingData);
  return (
    <img
      src={getSettingData.home_page_general_header_logo}
      alt="telepathlogo"
      width={'100%'}
      className="nav-brand"
    />
  );
};

const PrivateLayout = (props) => {
  const { t } = useTranslation();
  const [isActive, setActive] = useState(false);
  /**
   * This function will set active to InActive and vice versa
   */
  const toggleClass = () => {
    setActive(!isActive);
  };
  let bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.className = isActive ? 'overly bg-white' : 'bg-white';

  return (
    <div {...props}>
      <Header toggleClass={toggleClass} t={t} />
      <div id="wrapper" className={isActive ? 'toggled' : ''}>
        <Sidebar toggleClass={toggleClass} active={props.active} t={t} />
        <section id="content-wrapper" onClick={isActive ? toggleClass : null}>
          <Row>
            <Col lg={12}>{props.children}</Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

PrivateLayout.propTypes = {
  children: PropTypes.any.isRequired,
  active: PropTypes.string,
};

export { PrivateLayout, LogoUrlFront };
