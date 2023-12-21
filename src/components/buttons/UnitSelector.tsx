// React Native imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// Styling
import {
  fontSizes,
  fontWeights,
  borderRadius,
  darkThemeColors,
  lightThemeColors,
  fonts,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type UnitSelectorProps = {
  units: string[];
  activeUnit: string;
  setActiveUnit: React.Dispatch<React.SetStateAction<string>>;
  style?: object;
};

const UnitSelector: React.FC<UnitSelectorProps> = ({
  units,
  activeUnit,
  setActiveUnit,
  style,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        style,
        styles.unitSelector,
        {
          backgroundColor: currentTheme.disabledButton,
          shadowColor: currentTheme.shadow,
        },
      ]}>
      {units.map((unit, index) => (
        <TouchableOpacity
          key={unit}
          style={[
            styles.unitOption,
            {width: `${100 / units.length}%`},
            activeUnit === unit && {backgroundColor: currentTheme.primary},
            index === 0 && styles.firstUnit,
            index === units.length - 1 && styles.lastUnit,
          ]}
          onPress={() => setActiveUnit(unit)}>
          <Text style={styles.unitText}>{unit}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  unitSelector: {
    height: 50,
    width: '60%',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    shadowRadius: 3,
    elevation: 3,
    shadowOpacity: 1.0,
  },
  unitOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  unitText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.normal,
    fontFamily: fonts.primary,
  },
  firstUnit: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastUnit: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default UnitSelector;
