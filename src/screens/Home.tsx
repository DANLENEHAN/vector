import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomNavBar from '../components/NavBar/BottomNavBar';
import TopNavBar from '../components/NavBar/TopNavBar';
import ScreenWrapper from '../components/ScreenWrapper';

const HomeScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TopNavBar />
        <View style={styles.content}>{/* Place your main content here */}</View>
        <BottomNavBar />
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
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
