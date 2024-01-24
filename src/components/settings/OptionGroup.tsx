// React Import
import React from 'react';
// Styling
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  paddings,
  borderWidth,
  iconSizes,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import Icon from 'react-native-vector-icons/FontAwesome6';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

/**
 * Interface for the OptionGroup Component
 *
 * @interface Option
 *
 * @param {string | number} value - The value of the option
 * @param {string} label - The label for the option
 */
interface Option {
  value: string | number;
  label: string;
}

/**
 * Interface for the OptionGroup Component
 *
 * @interface OptionGroupProps
 *
 * @param {Option[]} options - The options for the option group
 * @param {number | null} selectedOption - The selected option (optional)
 * @param {(index: number) => void} onOptionPress - Function to be called when an option is pressed (optional)
 */
interface OptionGroupProps {
  options: Option[];
  selectedOption?: number | null;
  onOptionPress?: (index: number) => void;
}

/**
 * OptionGroup Component
 *
 * @component OptionGroup
 * @example
 * <OptionGroup
 *     options={[
 *         {value: 'option1', label: 'Option 1'},
 *         {value: 'option2', label: 'Option 2'},
 *         {value: 'option3', label: 'Option 3'},
 *     ]}
 *     selectedOption={0}
 *     onOptionPress={(index) => logger.info(index)}
 * />
 *
 * @param {Object} props - Component OptionGroup Props
 * @returns {React.FC<OptionGroupProps>} - React Component
 */
const OptionGroup: React.FC<OptionGroupProps> = ({
  options,
  selectedOption,
  onOptionPress,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleOptionPress = (index: number) => {
    if (onOptionPress) {
      onOptionPress(index);
    }
  };

  return (
    <View style={styles.optionGroup}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[styles.option]}
          key={index}
          onPress={() => handleOptionPress(index)}>
          <View style={styles.optionLabel}>
            <Text
              style={[
                {
                  color: currentTheme.text,
                  fontSize: fontSizes.medium,
                  fontFamily: fonts.secondary,
                },
              ]}>
              {option.label}
            </Text>
          </View>

          <View style={styles.optionTick}>
            {selectedOption === index && (
              <Icon
                name="check"
                size={iconSizes.medium}
                color={currentTheme.text}
              />
            )}
          </View>

          <View
            style={[
              styles.bottomBorder,
              {backgroundColor: currentTheme.borders},
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionGroup: {
    flex: 1,
    flexDirection: 'column',
  },
  option: {
    flexDirection: 'row',
    padding: paddings.small,
  },
  optionLabel: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  optionTick: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: '3%',
    right: '3%',
    height: borderWidth.xSmall,
  },
});

export default OptionGroup;
