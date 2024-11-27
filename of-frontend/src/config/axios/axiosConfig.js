import axios from 'axios';
import axiosRetry from 'axios-retry';

let retryAttempt = 0;
let baseURL = 'https://localhost:8443';
const currentURL = window.location.hostname;
if (currentURL != 'localhost') {
  console.log(currentURL);
  baseURL = 'https://192.168.0.212:8443/';
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

axiosRetry(instance, {
  retries: 0,
  retryDelay: (retryCount) => {
    return retryCount * 2000; // Ritardo esponenziale (2s, 4s, 6s, ...)
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
