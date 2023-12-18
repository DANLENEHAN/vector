// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, HomeParamList} from '../navigation/types';

export type ScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeParamList>;
};
