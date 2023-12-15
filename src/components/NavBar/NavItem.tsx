import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Styling
import {
  fonts,
  fontSizes,
  paddings,
  margins,
  lightThemeColors,
  darkThemeColors,
  iconSizes,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type NavItemProps = {
  icon: string;
  label?: string;
  onPress: () => void;
};

const NavItem: React.FC<NavItemProps> = ({icon, label, onPress}) => {
  //Setup theme for the component
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <TouchableOpacity
      style={[styles.navItem, {backgroundColor: currentTheme.background}]}
      onPress={onPress}>
      <Icon
        name={icon}
        solid
        size={iconSizes.large}
        color={currentTheme.text}
      />
      {label && (
        <Text style={[styles.navLabel, {color: currentTheme.text}]}>
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
    padding: paddings.small,
  },
  navLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    marginTop: margins.small,
  },
});

export default NavItem;
