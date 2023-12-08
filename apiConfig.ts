// apiService.ts

import axios, {AxiosInstance} from 'axios';

interface ApiConfig {
  apiUrl: string;
}

interface ApiConfigMap {
  development: ApiConfig;
  production: ApiConfig;
  staging: ApiConfig;
}

const API_CONFIG: ApiConfigMap = {
  development: {
    apiUrl: 'http://192.168.0.61:5000',
  },
  production: {
    apiUrl: 'https://api.example.com',
  },
  staging: {
    apiUrl: 'https://api.staging.example.com',
  },
};

const environment = process.env.NODE_ENV || 'development';
const apiBaseUrl = API_CONFIG[environment as keyof typeof API_CONFIG].apiUrl;

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

export default api;
