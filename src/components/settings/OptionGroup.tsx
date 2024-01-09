import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

// Styling
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  paddings,
  borderWidth,
  iconSizes,
} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';
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
