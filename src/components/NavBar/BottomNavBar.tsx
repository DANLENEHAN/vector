import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from './NavItem';

// Styling
import {
  lightThemeColors,
  darkThemeColors,
  borderWidth,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

const BottomNavBar: React.FC<any> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={[styles.navBar, {backgroundColor: currentTheme.background}]}>
      <NavItem
        icon="home"
        label="Home"
        onPress={() => navigation.navigate('Home')}
      />
      <NavItem
        icon="compass"
        label="Discover"
        onPress={() => console.log('Pressed Discover')}
      />
      <NavItem
        icon="plus"
        label="Track"
        onPress={() => console.log('Pressed Track')}
      />
      <NavItem
        icon="users"
        label="Social"
        onPress={() => console.log('Pressed Social')}
      />
      <NavItem
        icon="calendar-check"
        label="Progress"
        onPress={() => console.log('Pressed Progress')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderWidth: borderWidth.xsmall,
  },
});

export default BottomNavBar;
