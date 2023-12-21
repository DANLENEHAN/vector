import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {BottomBarProps} from './types';
// Styling
import {
  fonts,
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  margins,
  paddings,
  borderWidth,
} from '../../styles/main';

//Services
import {useTheme} from '../../context/ThemeContext';

const TrackNavBar: React.FC<BottomBarProps> = ({
  navigation,
  state,
  descriptors,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={[
        styles.navBarContainer,
        {
          backgroundColor: currentTheme.background,
          shadowColor: currentTheme.shadow,
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
    marginTop: margins.xxLarge,
  },
  label: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    padding: paddings.medium,
    fontWeight: fontWeights.bold,
  },
});

export default TrackNavBar;
