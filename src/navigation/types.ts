import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export type HomeScreenProps = {
  route: HomeScreenRouteProp;
};
