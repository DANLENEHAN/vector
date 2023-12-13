import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: {
    // NOTE: Remove props when useContext is implemented
    theme: 'light' | 'dark';
    setTheme?: (theme: 'light' | 'dark') => void;
  };
  Login: undefined;
};

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export type HomeScreenProps = {
  route: HomeScreenRouteProp;
};
