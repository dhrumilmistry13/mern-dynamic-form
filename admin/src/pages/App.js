import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import PagesRoutes from 'routes';
import { persistor, store } from 'store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'assets/scss/style.scss';
import { setAuthToken } from 'libs/HttpClient';
import Loader from 'common/components/Loader';
import { NoInternetPage } from 'common/components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      //retryOnMount:
      // retry: false
    },
  },
});

function App() {
  const { t } = useTranslation();

  // Checking if navigator is online or not
  if (!navigator.onLine) {
    return <NoInternetPage />;
  }

  // Checking if browser is offline or not
  window.onoffline = () => {
    return <NoInternetPage />;
  };

  // Checking if browser is online or not
  window.ononline = () => {
    window.location.reload(true);
  };

  /**
   * This function will call and page load, and will check, if user is registered or not, and setting authentication token
   */
  const handleOnBeforeLift = () => {
    if (
      store.getState().user.accessToken !== undefined &&
      store.getState().user.accessToken !== null
    ) {
      setAuthToken(store.getState().user.accessToken);
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} onBeforeLift={handleOnBeforeLift}>
          <QueryClientProvider client={queryClient}>
            <PagesRoutes t={t} />
            <ToastContainer />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
}
export default App;
