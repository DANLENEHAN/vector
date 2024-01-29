// React Import
import React, {useState, useEffect} from 'react';
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
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

// Types
import TextValidation from '@validation/TextValidation';

/**
 * Props for a TextInput component used in forms.
 *
 * @interface TextInputProps
 * @property {string} placeholder - The placeholder text for the input.
 * @property {string} value - The current value of the input.
 * @property {(text: string) => void} onChangeText - Callback function triggered when the text changes.
 * @property {boolean} [secureTextEntry] - Determines whether the input is a secure text entry (e.g., for passwords).
 * @property {boolean} [autoCapitalize] - Determines whether the input automatically capitalizes certain characters.
 * @property {string} iconName - The name of the icon associated with the input.
 * @property {object} [style] - Additional styles to be applied to the TextInput component.
 * @property {TextValidation} validation - An instance of TextValidation for validating the input.
 * @property {boolean} [enableErrors] - Indicates whether error messages from validation should be displayed.
 *
 */
interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
  style?: object;
  validation: TextValidation;
  enableErrors?: boolean;
}

/**
 * TextInput Component
 *
 * @component TextInputComponent
 * @example
 * <TextInputComponent
 *     placeholder={'Placeholder Text'}
 *     value={inputValue}
 *     onChangeText={setInputValue}
 *     secureTextEntry={true}
 *     autoCapitalize={true}
 *     iconName={'lock'}
 *     validation={textValidationInstance}
 *     enableErrors={true}
 * />
 *
 * @param {Object} props - Component TextInput Props
 * @returns {React.FC<TextInputProps>} - React Component
 */
const TextInputComponent: React.FC<TextInputProps> = ({
  placeholder,
  value,
  iconName,
  onChangeText,
  validation,
  style,
  enableErrors = false,
  secureTextEntry = false,
  autoCapitalize = false,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [isSecureEntry, setIsSecureEntry] = useState<boolean>(secureTextEntry);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    if (enableErrors) {
      setError(validation.validate(text) ? null : validation.error);
    }
    onChangeText(text);
  };

  useEffect(() => {
    if (enableErrors) {
      setError(validation.validate(value) ? null : validation.error);
    }
  }, [enableErrors, value, validation]);

  return (
    <View style={{...styles.mainContainer, ...style}}>
      <View
        style={[styles.inputContainer, {borderColor: currentTheme.borders}]}>
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
          onChangeText={handleTextChange}
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
      <View>
        {error && <Text style={{color: currentTheme.error}}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
