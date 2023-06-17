import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import AuthSlice from './features/authSlice';
import loaderReducer from './features/loaderSlice';
import settingReducer from './features/settingSlice';

/**
 * Creating persist and setting key, and data
 */
const persistConfig = {
  key: 'telepath-admin',
  storage,
  blacklist: [],
};

/**
 * Combinining multiple reducers
 */
const rootReducer = combineReducers({
  user: AuthSlice,
  loader: loaderReducer,
  setting: settingReducer,
});

const middlewares = [thunkMiddleware];
/**
 * Setting data from reducers to persist in local storage
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);
/**
 * Configuring store so we can use it later in our APP
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: middlewares,
  devTools: { trace: true, traceLimit: 1 },
});
// getting persist data from persistStore
let persistor = persistStore(store);
export { persistor, store };
