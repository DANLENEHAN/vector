// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

export type ScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};
