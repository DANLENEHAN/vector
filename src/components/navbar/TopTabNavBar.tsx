// React Import
import React from 'react';
// Components
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
// Types
import {TopBarProps} from '@components/navbar/Types';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  borderWidth,
  layoutStyles,
  headingTextStyles,
} from '@styles/Main';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Services
import {useSystem} from '@context/SystemContext';

/**
 * TopTabNavBar Component
 *
 * @component TopTabNavBar
 * @param {Object} props - Component TopTabNavBar Props
 * @returns {React.FC<TopBarProps>} - React Component
 */
const TopTabNavBar: React.FC<TopBarProps> = ({
  navigation,
  state,
  descriptors,
}: TopBarProps): React.ReactElement<TopBarProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.navBarContainer,
        {
          backgroundColor: currentTheme.background,
          shadowColor: currentTheme.shadow,
          paddingTop: insets.top,
        },
      ]}>
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: currentTheme.background,
            borderBottomColor: currentTheme.borders,
            shadowColor: currentTheme.shadow,
          },
        ]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabLabel =
            (descriptors[route.key].options.tabBarLabel as string) ||
            route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity onPress={onPress} key={route.key}>
              <Text
                style={[
                  styles.label,
                  {color: isFocused ? currentTheme.primary : currentTheme.text},
                ]}
                testID={`tab-label-${route.name.toLowerCase()}`}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 1.0,
    elevation: 5,
  },
  navBar: {
    ...layoutStyles.spaceAroundHorizontal,
    height: 60,
    borderBottomWidth: borderWidth.small,
  },
  label: {
    ...headingTextStyles.xSmall,
  },
});

export default TopTabNavBar;
