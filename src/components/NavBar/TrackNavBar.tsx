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

const TrackNavBar: React.FC<BottomBarProps> = ({navigation, state}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={[{backgroundColor: currentTheme.background}]}>
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: currentTheme.background,
            borderTopColor: currentTheme.borders,
            borderBottomColor: currentTheme.borders,
            shadowColor: currentTheme.shadow,
          },
        ]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

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
                ]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    //borderTopWidth: borderWidth.small,
    borderBottomWidth: borderWidth.small,
    marginTop: margins.xxLarge,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    padding: paddings.medium,
    fontWeight: fontWeights.bold,
  },
});

export default TrackNavBar;
