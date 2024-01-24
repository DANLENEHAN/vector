// React Import
import React from 'react';
// Components
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// Styling
import {
  fontSizes,
  fontWeights,
  borderRadius,
  darkThemeColors,
  lightThemeColors,
  fonts,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the Unit Selector Component
 *
 * @interface UnitSelectorProps
 *
 * @param {string[]} units - The units to be displayed in the selector
 * @param {string} activeUnit - The currently active unit
 * @param {React.Dispatch<React.SetStateAction<string>>} setActiveUnit - Function to set the active unit
 * @param {object} style - Additional styles for the unit selector (optional)
 */
interface UnitSelectorProps {
  units: string[];
  activeUnit: string;
  setActiveUnit: React.Dispatch<React.SetStateAction<string>>;
  style?: object;
}

/**
 * Unit Selector Component
 *
 * @component UnitSelector
 * @example
 * <UnitSelector
 *     units={['lbs', 'kg']}
 *     activeUnit={'lbs'}
 *     setActiveUnit={(unit) => logger.info(unit)}
 *     style={{backgroundColor: 'red'}}
 * />
 *
 * @param {Object} props - Component Unit Selector Props
 * @returns {React.FC<UnitSelectorProps>} - React Component
 */
const UnitSelector: React.FC<UnitSelectorProps> = ({
  units,
  activeUnit,
  setActiveUnit,
  style,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.unitSelector,
        style,
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
          <Text style={[styles.unitText, {color: currentTheme.lightText}]}>
            {unit}
          </Text>
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
    fontWeight: fontWeights.bold,
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
