// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import BaseLayout from '../components/layout/HomepageLayout';
// Types
import {ScreenProps} from './types';

const HomeScreen: React.FC<ScreenProps> = ({navigation}) => {
  return (
    <BaseLayout navigation={navigation}>
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </BaseLayout>
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
