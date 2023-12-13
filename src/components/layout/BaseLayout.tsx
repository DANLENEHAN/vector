// MainLayout.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import TopNavBar from '../navbar/TopNavBar';
import BottomNavBar from '../navbar/BottomNavBar';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type BaseLayoutProps = {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({children, navigation}) => {
  return (
    <View style={styles.container}>
      <TopNavBar navigation={navigation} />
      <View style={styles.content}>{children}</View>
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseLayout;
