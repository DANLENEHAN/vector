// React Import
import React from 'react';
// Components
import {View, StyleSheet, Text} from 'react-native';
// Styling
import {
  fonts,
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  borderWidth,
  iconSizes,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Typing
import {NavBarProps} from '@components/navbar/Types';
// Logging
import logger from '@utils/Logger';

/**
 * TopNavBar Component
 *
 * @component TopNavBar
 * @example
 * <TopNavBar navigation={navigation} />
 *
 * @param {Object} props - Component TopNavBar Props
 * @returns {React.FC<NavBarProps>} - React Component
 */
const TopNavBar: React.FC<NavBarProps> = ({
  navigation,
}: NavBarProps): React.ReactElement<NavBarProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: currentTheme.background,
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
          onPress={() => logger.info('Pressed Search')}
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
    borderBottomWidth: borderWidth.small,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 1.0,
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
