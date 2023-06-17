import React from 'react';
import 'assets/scss/loader/spinner.scss';
export default function LoadingSpinner() {
  return (
    // <div className="spinner-container">
    //   <div className="loading-spinner"></div>
    // </div>
    <div id="preloader">
      <div id="status">
        <div className="spinner"></div>
      </div>
    </div>
  );
}
