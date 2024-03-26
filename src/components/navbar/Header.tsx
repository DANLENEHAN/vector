// React Import
import React from 'react';
// Theme
import {
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  layoutStyles,
  headingTextStyles,
  topNavBarHeight,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import HeaderBackButton from '@components/buttons/HeaderBackButton';
import {View, StyleSheet, Text} from 'react-native';

/**
 * Interface for the Header component
 *
 * @interface HeaderProps
 *
 * @param {CallableFunction} onClick - Function to be called when back is selected
 * @param {string} label - Label for the header
 * @param {boolean} includeBackArrow - Whether or not to include the back arrow
 */
interface HeaderProps {
  onClick: () => void;
  label?: string;
  includeBackArrow?: boolean;
}

/**
 * Header Component
 *
 * @component Header
 * @param {Object} props - Component Header Props
 * @returns {React.FC<HeaderProps>} - React Component
 */
const Header: React.FC<HeaderProps> = ({
  onClick,
  label = '',
  includeBackArrow = true,
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
        {includeBackArrow && <HeaderBackButton onClick={onClick} />}
      </View>
      <Text style={[styles.logoText, {color: currentTheme.darkText}]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...layoutStyles.centerHorizontally,
    height: topNavBarHeight,
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
