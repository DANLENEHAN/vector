// React Import
import React from 'react';
// Components
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
// Styling
import {
  fonts,
  fontSizes,
  paddings,
  margins,
  lightThemeColors,
  darkThemeColors,
  iconSizes,
  fontWeights,
} from '@styles/main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the NavItem Component
 *
 * @interface NavItemProps
 *
 * @param {string} icon - The icon for the nav item
 * @param {string} label - The label for the nav item (optional)
 * @param {() => void} onPress - Function to be called when the nav item is pressed
 * @param {boolean} isActive - Boolean to determine if the nav item is active (optional)
 */
interface NavItemProps {
  icon: string;
  label?: string;
  onPress: () => void;
  isActive?: boolean;
}

/**
 * NavItem Component
 *
 * @component NavItem
 * @example
 * <NavItem
 *     icon={'home'}
 *     label={'Home'}
 *     onPress={() => console.log('NavItem Pressed')}
 *     isActive={true}
 * />
 *
 * @param {Object} props - Component NavItem Props
 * @returns {React.FC<NavItemProps>} - React Component
 */
const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
}) => {
  //Setup theme for the component
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <TouchableOpacity
      style={[styles.navItem, {backgroundColor: currentTheme.background}]}
      onPress={onPress}>
      <Icon
        name={icon}
        solid
        size={iconSizes.small}
        color={currentTheme.text}
        style={isActive && {color: currentTheme.primary}}
      />
      {label && (
        <Text
          style={[
            styles.navLabel,
            {color: isActive ? currentTheme.primary : currentTheme.text},
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: paddings.xSmall,
    paddingBottom: paddings.xSmall,
    marginLeft: margins.xSmall,
    marginRight: margins.xSmall,
  },
  navLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    marginTop: margins.xSmall,
    fontWeight: fontWeights.semiBold,
  },
});

export default NavItem;
