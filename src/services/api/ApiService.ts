// Classes
import {HttpClient} from '@services/api/swagger/http-client';

// Api Classes
import {UserDeviceLink} from './swagger/UserDeviceLink';
import {BodyStat} from '@services/api/swagger/BodyStat';
import {Device} from './swagger/Device';
import {User} from './swagger/User';
import {SyncErrorDump} from './swagger/SyncErrorDump';
import {Mood} from '@services/api/swagger/Mood';
import {MoodTag} from '@services/api/swagger/MoodTag';
import {MoodTagLink} from '@services/api/swagger/MoodTagLink';
import {Nutrition} from '@services/api/swagger/Nutrition';
import {ClientSessionEvent} from '@services/api/swagger/ClientSessionEvent';

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
export const apiBaseUrl = API_URLS[environment as keyof typeof API_URLS];

const api = new HttpClient({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required to handle cookies
});

// Apis
export const UserApi = new User(api);
export const UserDeviceLinkApi = new UserDeviceLink(api);
export const BodyStatApi = new BodyStat(api);
export const DeviceApi = new Device(api);
export const SyncErrorDumpApi = new SyncErrorDump(api);
export const MoodApi = new Mood(api);
export const MoodTagApi = new MoodTag(api);
export const MoodTagLinkApi = new MoodTagLink(api);
export const NutritionApi = new Nutrition(api);
export const ClientSessionEventApi = new ClientSessionEvent(api);

// Probaly remove
export default api;
