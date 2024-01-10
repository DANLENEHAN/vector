import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

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
} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';

interface NavItemProps {
  icon: string;
  label?: string;
  onPress: () => void;
  isActive?: boolean;
}

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
