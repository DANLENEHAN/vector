import {HttpClient} from './swagger/http-client';
import NetInfo from '@react-native-community/netinfo';

type ApiConfigMap = {
  development: string;
  production: string;
  staging: string;
};

const API_URLS: ApiConfigMap = {
  development: 'http://192.168.0.61:5000',
  production: 'https://api.example.com',
  staging: 'https://api.staging.example.com',
};

const environment = process.env.NODE_ENV || 'development';
const apiBaseUrl = API_URLS[environment as keyof typeof API_URLS];

const api = new HttpClient({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required to handle cookies
});

// Initialize NetInfo
NetInfo.configure({
  reachabilityUrl: apiBaseUrl,
  reachabilityTest: async response => response.status === 200,
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
});

export default api;
