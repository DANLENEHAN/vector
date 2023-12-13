import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';

type NavItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

const NavItem: React.FC<NavItemProps> = ({icon, label, onPress}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      style={[styles.navItem, {backgroundColor: currentTheme.background}]}
      onPress={onPress}>
      <Icon name={icon} solid size={28} color={currentTheme.text} />
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
    padding: 10,
  },
  navLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    marginTop: 4,
  },
});

export default NavItem;
