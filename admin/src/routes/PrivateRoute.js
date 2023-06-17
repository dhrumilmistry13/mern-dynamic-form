import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PrivateLayout } from 'common/layouts';
import Loader from 'common/components/Loader';
import { loader } from 'store/features/loaderSlice';
import { loggedUser } from 'store/features/authSlice';

const PrivateRoute = () => {
  // Calling selector hook from redux, to get data from stores, like loader, login info
  const checkLoading = useSelector(loader);
  const checkLoggenInUser = useSelector(loggedUser);
  const location = useLocation();

  /**
   * Checking if user is registered user or not
   */
  const isAdminLoggedIn = checkLoggenInUser.isAdminLoggedIn;
  return isAdminLoggedIn ? (
    <PrivateLayout>
      {checkLoading ? <Loader /> : ''}
      <Outlet />
    </PrivateLayout>
  ) : (
    <Navigate
      to={{
        pathname: '/login',
        state: { from: location },
      }}
    />
  );
};

export default PrivateRoute;
