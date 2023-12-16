import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import NavItem from './NavItem';

// Styling
import {
  fonts,
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  margins,
  borderWidth,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

const TopNavBar: React.FC<any> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: currentTheme.background,
          borderTopColor: currentTheme.borders,
          borderBottomColor: currentTheme.borders,
        },
      ]}>
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
          onPress={() =>
            navigation.navigate('Settings', {screen: 'SettingsHome'})
          }
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
    borderWidth: borderWidth.xSmall,
    marginTop: margins.xxLarge,
  },
  logoText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    marginTop: margins.small,
    fontWeight: fontWeights.ultraBold,
  },
  sideItem: {
    flex: 1,
  },
  logoContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopNavBar;
