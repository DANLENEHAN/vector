import {HttpClient} from './swagger/http-client';

type ApiConfigMap = {
  development: string;
  production: string;
  staging: string;
};

const API_URLS: ApiConfigMap = {
  development: 'http://localhost:5000',
  production: 'https://api.example.com',
  staging: 'https://api.staging.example.com',
};

const environment = process.env.NODE_ENV || 'development';
const apiBaseUrl = API_URLS[environment as keyof typeof API_URLS];

const api = new HttpClient({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required to handle cookies
});

export default api;
