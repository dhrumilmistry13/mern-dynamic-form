import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Footer } from 'common/layouts/Footer/Footer';
import 'assets/scss/_custom.scss';
import { settingData } from 'store/features/settingSlice';
import userIcon from 'assets/images/admin-telepath-logo.png';
const LogoUrl = () => {
  /**
   * This will provide  general information from redux store, like logos, and titles
   */
  const getSettingData = useSelector(settingData);
  return (
    <LazyLoadImage
      key={
        getSettingData.home_page_general_header_logo
          ? getSettingData.home_page_general_header_logo
          : userIcon
      }
      placeholderSrc={userIcon}
      src={
        getSettingData.home_page_general_header_logo
          ? getSettingData.home_page_general_header_logo
          : userIcon
      }
      alt="telepathlogo"
      // width={'100%'}
      className="nav-brand"
    />
  );
};
const PublicLayout = (props) => {
  // Adding class in body
  useEffect(() => {
    document.body.classList.add('bg-box');
  }, []);
  return (
    <div {...props} className="auth-pages">
      {props.children}
      <Footer />
    </div>
  );
};

PublicLayout.propTypes = {
  children: PropTypes.any.isRequired,
};

export { PublicLayout, LogoUrl };
