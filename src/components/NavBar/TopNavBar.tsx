import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import NavItem from './NavItem';
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';
import {NavBarProps} from './types';

const TopNavBar: React.FC<NavBarProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.navBar, {backgroundColor: currentTheme.background}]}>
      <View style={styles.sideItem}>
        <NavItem icon="search" onPress={() => console.log('Pressed Search')} />
      </View>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, {color: currentTheme.text}]}>
          SHEIVA
        </Text>
      </View>
      <View style={styles.sideItem}>
        <NavItem
          icon="user-circle"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
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
    marginTop: 30,
  },
  logoText: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.primary,
    marginTop: 4,
    fontWeight: '900',
  },
  sideItem: {
    flex: 1, // Adjust this as necessary to align with BottomNavBar
  },
  logoContainer: {
    flex: 3, // Adjust this as necessary to match the width of the middle three items of BottomNavBar
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopNavBar;
