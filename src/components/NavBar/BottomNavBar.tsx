import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from './NavItem';

// Styling
import {lightThemeColors, darkThemeColors, paddings} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

const routeMapping: any = {
  Home: {label: 'Home', icon: 'home'},
  Track: {label: 'Track', icon: 'plus'},
  Discover: {label: 'Discover', icon: 'compass'},
  Social: {label: 'Social', icon: 'users'},
  Progress: {label: 'Progress', icon: 'calendar-check'},
};
const hiddenRoutes = ['Settings', 'Search'];

const BottomNavBar: React.FC<any> = ({navigation, state}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.navBar, {backgroundColor: currentTheme.background}]}>
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // for android shadow
  },
});

export default BottomNavBar;
