import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from './NavItem';
import {lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';

const BottomNavBar: React.FC = () => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.navBar, {backgroundColor: currentTheme.background}]}>
      <NavItem
        icon="home"
        label="Home"
        onPress={() => console.log('Pressed Home')}
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
    borderTopWidth: 1,
  },
});

export default BottomNavBar;
