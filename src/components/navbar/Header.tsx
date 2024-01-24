// React Import
import React from 'react';
// Theme
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
  fontWeights,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import HeaderBackButton from '@components/buttons/HeaderBackButton';
import {View, StyleSheet, Text} from 'react-native';
// Navigation
import {ScreenNavigationProp} from '@navigation/Types';

/**
 * Interface for the Header component
 *
 * @interface HeaderProps
 *
 * @param {ScreenNavigationProp} navigation - Navigation prop for the screen
 * @param {string} label - Label for the header
 * @param {boolean} includeBackArrow - Whether or not to include the back arrow
 * @param {boolean} includeTopMargin - Whether or not to include top margin (If the header is the first item on the screen)
 */
interface HeaderProps {
  navigation: ScreenNavigationProp;
  label: string;
  includeBackArrow: boolean;
  includeTopMargin: boolean;
}

/**
 * Header Component
 *
 * @component Header
 * @example
 * <Header
 *    label={'Preferences'}
 *    navigation={navigation}
 *    includeBackArrow={true}
 *    includeTopMargin={true}
 * />
 *
 * @param {Object} props - Component Header Props
 * @returns {React.FC<HeaderProps>} - React Component
 */
const Header: React.FC<HeaderProps> = ({
  navigation,
  label,
  includeBackArrow,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: currentTheme.background,
        },
      ]}>
      {
        // Include the HeaderBackButton component if targetScreen is defined
      }
      <View style={styles.sideItem}>
        {includeBackArrow && <HeaderBackButton navigation={navigation} />}
      </View>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, {color: currentTheme.darkText}]}>
          {label}
        </Text>
      </View>
      <View style={styles.sideItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  logoText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    marginTop: margins.xSmall,
    fontWeight: fontWeights.bold,
    alignContent: 'center',
    justifyContent: 'center',
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

export default Header;
