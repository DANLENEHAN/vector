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
 * Interface for the TextInput Component
 *
 * @interface TextInputProps
 *
 * @param {string} placeholder - The placeholder text for the input
 * @param {string} value - The value of the input
 * @param {(text: string) => void} onChangeText - Function to be called when the text changes
 * @param {boolean} secureTextEntry - Boolean to hide the text (optional)
 * @param {boolean} autoCapitalize - Boolean to capitalize the text (optional)
 * @param {string} iconName - The name of the icon to be displayed
 */
interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
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
    <View style={styles.mainContainer}>
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
      <View style={styles.errorContainer}>
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
    marginBottom: margins.small,
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
  errorContainer: {
    marginBottom: margins.large,
  },
});

export default TextInputComponent;
