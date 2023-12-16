import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  paddings,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface Option {
  value: string | number;
  label: string;
}

interface OptionGroupProps {
  options: Option[];
  selectedOption?: number | null;
  onOptionPress?: (index: number) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  options,
  selectedOption,
  onOptionPress,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleOptionPress = (index: number) => {
    // Call the callback function if provided
    if (onOptionPress) {
      onOptionPress(index);
    }
  };

  return (
    <View style={styles.groupContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[styles.optionContainer]}
          key={index}
          onPress={() => handleOptionPress(index)}>
          <View style={styles.labelContainer}>
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

          <View style={styles.tickcontainer}>
            {selectedOption === index && (
              <Icon name="check" solid size={30} color={currentTheme.text} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  labelContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tickcontainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: paddings.small,
  },
});

export default OptionGroup;
