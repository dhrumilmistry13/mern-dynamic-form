import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PublicLayout } from 'common/layouts';
import { loader } from 'store/features/loaderSlice';
import { loggedUser } from 'store/features/authSlice';
import Loader from 'common/components/Loader';

const PublicRoute = () => {
  // Calling selector hook from redux, to get data from stores, like loader, login info
  const checkLoading = useSelector(loader);
  const checkLoggenInUser = useSelector(loggedUser);

  /**
   * Checking if user is registered user or not
   */
  const isAdminLoggedIn = checkLoggenInUser.isAdminLoggedIn;

  return !isAdminLoggedIn ? (
    <PublicLayout>
      {checkLoading ? <Loader /> : ''}
      <Outlet />
    </PublicLayout>
  ) : (
    <Navigate
      to={{
        pathname: '/dashboard',
      }}
      replace
    />
  );
};

export default PublicRoute;
