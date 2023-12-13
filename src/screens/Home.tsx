// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
// Layouts
import ScreenWrapper from '../components/layout/ScreenWrapper';
import BaseLayout from '../components/layout/BaseLayout';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <ScreenWrapper>
      <BaseLayout navigation={navigation}>
        <View style={styles.content}>
          <Text>Home</Text>
        </View>
      </BaseLayout>
    </ScreenWrapper>
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
