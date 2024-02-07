// React Import
import React from 'react';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  iconSizes,
  layoutStyles,
  textStyles,
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
}: OptionGroupProps): React.ReactElement<OptionGroupProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleOptionPress = (index: number) => {
    if (onOptionPress) {
      onOptionPress(index);
    }
  };

  return (
    <View style={styles.componentWrapper}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[{borderColor: currentTheme.borders}, styles.option]}
          key={index}
          onPress={() => handleOptionPress(index)}>
          <Text
            style={[
              styles.optionText,
              {
                color: currentTheme.text,
              },
            ]}>
            {option.label}
          </Text>
          {selectedOption === index && (
            <Icon
              style={styles.optionTick}
              name="check"
              size={iconSizes.medium}
              color={currentTheme.text}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    ...layoutStyles.flexStartVertical,
    width: '100%',
    height: '20%',
  },
  option: {
    borderBottomWidth: 1,
    flex: 1,
    width: '90%',
    ...layoutStyles.spaceBetweenHorizontal,
  },
  optionText: {
    ...textStyles.bodyPrimaryMedium,
    flex: 9,
  },
  optionTick: {
    flex: 1,
  },
});

export default OptionGroup;
