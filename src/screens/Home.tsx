// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import HomepageLayout from '../components/layout/HomepageLayout';
// Types
import {HomeScreenProps} from './types';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <HomepageLayout navigation={navigation}>
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </HomepageLayout>
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

export default HomeScreen;
