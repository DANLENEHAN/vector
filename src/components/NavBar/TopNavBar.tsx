import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

// Styling
import {
  fonts,
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  margins,
  borderWidth,
  iconSizes,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Typing
import {NavBarProps} from './types';

const TopNavBar: React.FC<NavBarProps> = ({navigation}) => {
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
          shadowColor: currentTheme.shadow,
        },
      ]}>
      <View style={styles.iconContainer}>
        <Icon
          name={'magnifying-glass'}
          solid
          size={iconSizes.large}
          color={currentTheme.text}
          onPress={() => console.log('Pressed Search')}
        />
      </View>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, {color: currentTheme.text}]}>
          SHEIVA
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon
          name={'user'}
          solid
          size={iconSizes.large}
          color={currentTheme.text}
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
    borderTopWidth: borderWidth.small,
    borderBottomWidth: borderWidth.small,
    marginTop: margins.xxLarge,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.ultraBold,
  },
});

export default TopNavBar;
