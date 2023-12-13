import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from './NavItem';
import {lightTheme, darkTheme} from '../../theme';

type BottomNavBarProps = {
  theme: 'light' | 'dark';
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({theme}) => {
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.navBar, {backgroundColor: currentTheme.background}]}>
      <NavItem
        icon="home"
        label="Home"
        onPress={() => console.log('Pressed Home')}
        theme={theme}
      />
      <NavItem
        icon="compass"
        label="Discover"
        onPress={() => console.log('Pressed Discover')}
        theme={theme}
      />
      <NavItem
        icon="plus"
        label="Track"
        onPress={() => console.log('Pressed Track')}
        theme={theme}
      />
      <NavItem
        icon="users"
        label="Social"
        onPress={() => console.log('Pressed Social')}
        theme={theme}
      />
      <NavItem
        icon="calendar-check"
        label="Progress"
        onPress={() => console.log('Pressed Progress')}
        theme={theme}
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
