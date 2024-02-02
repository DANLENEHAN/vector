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
  layoutStyles,
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
}: UnitSelectorProps): React.ReactElement<UnitSelectorProps> => {
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
    height: 60,
    width: '80%',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
  },
  unitOption: {
    flex: 3,
    ...layoutStyles.centerVertically,
  },
  unitText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.primary,
  },
  firstUnit: {
    borderTopLeftRadius: borderRadius.medium,
    borderBottomLeftRadius: borderRadius.medium,
  },
  lastUnit: {
    borderTopRightRadius: borderRadius.medium,
    borderBottomRightRadius: borderRadius.medium,
  },
});

export default UnitSelector;
