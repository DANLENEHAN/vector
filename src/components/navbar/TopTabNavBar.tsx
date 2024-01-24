// React Import
import React from 'react';
// Components
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
// Types
import {TopBarProps} from '@components/navbar/Types';
// Styling
import {
  fonts,
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  paddings,
  borderWidth,
} from '@styles/Main';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Services
import {useSystem} from '@context/SystemContext';

/**
 * TopTabNavBar Component
 *
 * @component TopTabNavBar
 * @example
 * <TopTabNavBar navigation={navigation} />
 *
 * @param {Object} props - Component TopTabNavBar Props
 * @returns {React.FC<TopBarProps>} - React Component
 */
const TopTabNavBar: React.FC<TopBarProps> = ({
  navigation,
  state,
  descriptors,
}) => {
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: borderWidth.small,
  },
  label: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    padding: paddings.medium,
    fontWeight: fontWeights.bold,
  },
});

export default TopTabNavBar;
