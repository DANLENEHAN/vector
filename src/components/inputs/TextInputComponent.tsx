// React Import
import React, {useState} from 'react';
// Components
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Styling
import {
  paddings,
  margins,
  borderRadius,
  borderWidth,
  darkThemeColors,
  lightThemeColors,
  iconSizes,
  fonts,
} from '@styles/main';
import {useSystem} from '@context/SystemContext';

interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
}

const TextInputComponent: React.FC<TextInputProps> = ({
  placeholder,
  value,
  iconName,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = false,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [isSecureEntry, setIsSecureEntry] = useState<boolean>(secureTextEntry);

  return (
    <View style={[styles.inputContainer, {borderColor: currentTheme.borders}]}>
      <Icon
        name={iconName}
        size={iconSizes.xLarge}
        color={currentTheme.icon}
        solid
      />
      <TextInput
        style={[
          styles.input,
          {
            color: currentTheme.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={currentTheme.lightText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecureEntry}
        autoCapitalize={autoCapitalize === true ? 'sentences' : 'none'}
      />
      {secureTextEntry === true && value.length > 0 && (
        <TouchableOpacity onPress={() => setIsSecureEntry(prev => !prev)}>
          <Text
            style={[styles.showHideButton, {color: currentTheme.lightText}]}>
            {isSecureEntry ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margins.large,
    borderWidth: borderWidth.xSmall,
    borderRadius: borderRadius.medium,
    padding: paddings.small,
  },
  input: {
    flex: 1,
    marginLeft: margins.small,
    fontFamily: fonts.primary,
  },
  showHideButton: {
    paddingRight: paddings.small,
    fontFamily: fonts.primary,
  },
  icon: {
    paddingRight: paddings.small,
    paddingLeft: paddings.small,
  },
});

export default TextInputComponent;
