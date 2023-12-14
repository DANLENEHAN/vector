import axios, {AxiosInstance} from 'axios';

interface ApiConfigMap {
  development: string;
  production: string;
  staging: string;
}

const API_URLS: ApiConfigMap = {
  development: 'http://192.168.0.91:5000',
  production: 'https://api.example.com',
  staging: 'https://api.staging.example.com',
};

const environment = process.env.NODE_ENV || 'development';
const apiBaseUrl = API_URLS[environment as keyof typeof API_URLS];

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required to handle cookies
});

export default api;
