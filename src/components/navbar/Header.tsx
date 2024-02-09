// React Import
import React from 'react';
// Theme
import {
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  layoutStyles,
  headingTextStyles,
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
 */
interface HeaderProps {
  navigation: ScreenNavigationProp;
  label?: string;
  includeBackArrow: boolean;
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
 * />
 *
 * @param {Object} props - Component Header Props
 * @returns {React.FC<HeaderProps>} - React Component
 */
const Header: React.FC<HeaderProps> = ({
  navigation,
  label = '',
  includeBackArrow,
}: HeaderProps): React.ReactElement<HeaderProps> => {
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
      <View style={styles.caretContainer}>
        {includeBackArrow && <HeaderBackButton navigation={navigation} />}
      </View>
      <Text style={[styles.logoText, {color: currentTheme.darkText}]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    ...layoutStyles.centerHorizontally,
  },
  caretContainer: {
    flex: 2,
    marginRight: marginSizes.large,
  },
  logoText: {
    ...headingTextStyles.small,
    flex: 8,
  },
});

export default Header;
