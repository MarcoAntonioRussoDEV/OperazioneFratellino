import axios from 'axios';
import axiosRetry from 'axios-retry';

let retryAttempt = 0;
let baseURL = import.meta.env.VITE_API_URL || 'https://localhost:8080/api/';

if (location.hostname === 'localhost') {
  baseURL = 'https://localhost:8443/api/';
}

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,

  (error) => {
    // console.log('error: ', error);
    if (error.response.status === 401) {
      const unauthorizedEvent = new CustomEvent('unauthorized', {
        detail: { error: error.response },
      });
      window.dispatchEvent(unauthorizedEvent);
    } else if (error.response.status === 403) {
      const forbiddenEvent = new CustomEvent('forbidden', {
        detail: { error: error.response },
      });
      window.dispatchEvent(forbiddenEvent);
    }
    return Promise.reject(error);
  },
);

axiosRetry(instance, {
  retries: 0,
  retryDelay: (retryCount) => {
    return retryCount * 2000;
  },
  retryCondition: (error) => {
    return !error.response || error.response.status >= 500;
  },
  onRetry: (retryCount, error, requestConfig) => {
    retryAttempt = retryCount;
    console.log(
      `Retry attempt #${retryCount} for request to ${requestConfig.url} due to error:`,
      error.message,
    );
  },
  onMaxRetryTimesExceeded: (error) => {
    // console.log('Errore nel caricamento dei dati: ', error);
    retryAttempt = 0;
  },
});

export { instance as axios, retryAttempt };
