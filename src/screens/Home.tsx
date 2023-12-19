// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import HomepageLayout from '../components/layout/HomepageLayout';
// Types
import {ScreenProps} from './types';

const HomeScreen: React.FC<ScreenProps> = ({navigation}) => {
  return (
    <HomepageLayout navigation={navigation}>
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </HomepageLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
