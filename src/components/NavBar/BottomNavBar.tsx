import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from './NavItem';
import {BottomBarProps} from './types';

// Styling
import {
  lightThemeColors,
  darkThemeColors,
  paddings,
  borderWidth,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

const routeMapping: any = {
  Home: {label: 'Home', icon: 'house'},
  Track: {label: 'Track', icon: 'plus'},
  Discover: {label: 'Discover', icon: 'compass'},
  Social: {label: 'Social', icon: 'users'},
  Progress: {label: 'Progress', icon: 'calendar-check'},
};
const hiddenRoutes = ['Settings', 'Search'];

const BottomNavBar: React.FC<BottomBarProps> = ({navigation, state}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: currentTheme.background,
          shadowColor: currentTheme.shadow,
          borderTopColor: currentTheme.borders,
        },
      ]}>
      {state.routes.map((route: any, index: number) => {
        const {label, icon} = routeMapping[route.name] || {};
        if (hiddenRoutes.includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <NavItem
            key={index}
            icon={icon}
            label={label}
            onPress={onPress}
            isActive={isFocused}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    paddingTop: paddings.small,
    // Added shadow
    borderTopWidth: borderWidth.small,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // for android shadow
  },
});

export default BottomNavBar;
