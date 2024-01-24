// React Imports
import React from 'react';
// Components
import NavItem from '@components/navbar/NavItem';
import {View, StyleSheet} from 'react-native';
import {BottomBarProps} from '@components/navbar/Types';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  paddings,
  borderWidth,
} from '@styles/Main';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSystem} from '@context/SystemContext';

// Mapping of routes to icons and labels
const routeMapping: any = {
  Home: {label: 'Home', icon: 'house'},
  Track: {label: 'Track', icon: 'plus'},
  Discover: {label: 'Discover', icon: 'compass'},
  Social: {label: 'Social', icon: 'users'},
  Progress: {label: 'Progress', icon: 'calendar-check'},
};
// Routes that should not be displayed in the bottom nav bar
const hiddenRoutes = ['Settings', 'Search'];

/**
 *  BottomNavBar
 *
 * @component BottomNavBar
 * @example
 *  <BottomNavBar
 *   navigation={navigation}
 *   state={state}
 * />
 *
 * @param {Object} props - Component Props
 * @returns {React.FC<BottomBarProps>} - React Component
 */
const BottomNavBar: React.FC<BottomBarProps> = ({navigation, state}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: currentTheme.background,
          shadowColor: currentTheme.shadow,
          borderTopColor: currentTheme.borders,
          paddingBottom: insets.bottom,
          paddingLeft: paddings.xSmall,
          paddingRight: paddings.xSmall,
          height: 55 + insets.bottom,
        },
      ]}>
      {state.routes.map((route: any, index: number) => {
        const {label, icon} = routeMapping[route.name] || {};
        if (hiddenRoutes.includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;
        // On press function
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
    // Added shadow
    borderTopWidth: borderWidth.small,
    shadowOffset: {width: 0, height: -2},
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 5, // for android shadow
  },
});

export default BottomNavBar;