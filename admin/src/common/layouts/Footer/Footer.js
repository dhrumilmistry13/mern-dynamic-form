import React from 'react';
import PropTypes from 'prop-types';

const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="navbar-desktop">{props.children}</div>
    </footer>
  );
};
Footer.propTypes = {
  children: PropTypes.any,
};

export { Footer };
