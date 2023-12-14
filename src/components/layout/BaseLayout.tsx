// MainLayout.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import TopNavBar from '../navbar/TopNavBar';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
// Layouts
import ScreenWrapper from './ScreenWrapper';

type BaseLayoutProps = {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({children, navigation}) => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TopNavBar navigation={navigation} />
        {children}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseLayout;
