import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomNavBar from '../components/NavBar/BottomNavBar';
import TopNavBar from '../components/NavBar/TopNavBar';
import ScreenWrapper from '../components/ScreenWrapper';
import {RouteProp} from '@react-navigation/native';

type HomeScreenRouteProp = RouteProp<
  {
    Home: {
      theme: 'light' | 'dark';
      setTheme?: (theme: 'light' | 'dark') => void;
    };
  },
  'Home'
>;

type HomeScreenProps = {
  route: HomeScreenRouteProp;
};
const HomeScreen: React.FC<HomeScreenProps> = ({route}) => {
  const {theme} = route.params;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TopNavBar theme={theme} />
        <View style={styles.content}>{/* Place your main content here */}</View>
        <BottomNavBar theme={theme} />
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
