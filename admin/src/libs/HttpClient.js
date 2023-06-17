import axios from 'axios';
import { createBrowserHistory } from 'history';

import { API_URL } from 'config';
const myHistory = createBrowserHistory({ window });

/**
 * This function will create api call based on request type,
 */
const client = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!error.response) {
      throw new Error('Error Connection');
    }
    if (error.response.status === 401) {
      window.localStorage.clear();
      myHistory.replace(`/`); // Usage example.
      window.location.reload();
    }

    return Promise.reject(error.response.data);
  }
);

export default client;

export const setAuthToken = (token) => {
  client.defaults.headers.common['Authorization'] = '';
  delete client.defaults.headers.common['Authorization'];
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
