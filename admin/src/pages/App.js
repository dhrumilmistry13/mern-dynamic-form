import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import PagesRoutes from 'routes';
import { store } from 'store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'assets/scss/style.scss';
import Loader from 'common/components/Loader';

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

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PagesRoutes t={t} />
          <ToastContainer />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  );
}
export default App;
