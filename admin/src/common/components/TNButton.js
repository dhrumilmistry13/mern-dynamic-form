import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
const TNButton = ({ loading, ...props }) => {
  if (props.isdirtyform === 0) {
    return (
      <Button {...props} disabled={true}>
        {props.children}
      </Button>
    );
  } else {
    return (
      <Button {...props} disabled={loading}>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
          className={loading ? 'showLoader' : 'hideLoader'}
        />
        {props.children}
      </Button>
    );
  }
};
TNButton.propTypes = {
  loading: PropTypes.bool,
  isdirtyform: PropTypes.any,
  children: PropTypes.any.isRequired,
};
export { TNButton };
