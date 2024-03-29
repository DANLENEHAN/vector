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
  paddingSizes,
  marginSizes,
  borderRadius,
  borderWidth,
  darkThemeColors,
  lightThemeColors,
  iconSizes,
  layoutStyles,
  bodyTextStyles,
  ctaTextStyles,
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
 * @property {(textInput: string, inputValid: boolean) => void} onChangeText - Callback function triggered when the text changes.
 * @property {boolean} [secureTextEntry] - Determines whether the input is a secure text entry (e.g., for passwords).
 * @property {boolean} [autoCapitalize] - Determines whether the input automatically capitalizes certain characters.
 * @property {string} iconName - The name of the icon associated with the input.
 * @property {number} iconSize - The szie of the icon associated with the input.
 * @property {object} [style] - Additional styles to be applied to the TextInput component.
 * @property {TextValidation} validation - An instance of TextValidation for validating the input.
 * @property {boolean} [enableErrors] - Indicates whether error messages from validation should be displayed.
 *
 */
interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (textInput: string, inputValid: boolean) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
  iconSize?: number;
  style?: {
    [key: string]: any;
    marginBottom?: number;
  };
  validation?: TextValidation;
  enableErrors?: boolean;
}

/**
 * TextInput Component
 *
 * @component TextInputComponent
 * @param {Object} props - Component TextInput Props
 * @returns {React.FC<TextInputProps>} - React Component
 */
const TextInputComponent: React.FC<TextInputProps> = ({
  placeholder,
  value,
  iconName,
  iconSize,
  onChangeText,
  validation,
  style,
  enableErrors = false,
  secureTextEntry = false,
  autoCapitalize = false,
}: TextInputProps): React.ReactElement<TextInputProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [isSecureEntry, setIsSecureEntry] = useState<boolean>(secureTextEntry);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    if (validation) {
      const validationError: string | null = validation.validate(text)
        ? null
        : validation.error;
      if (enableErrors) {
        setError(validationError);
      }
    }
    onChangeText(text, error ? false : true);
  };

  useEffect(() => {
    if (enableErrors && validation) {
      setError(validation.validate(value) ? null : validation.error);
    }
  }, [enableErrors, value, validation]);

  // Fixing the Height of the Error Container and adjusting marginSizes
  // to prevent movement on error popup
  const errorContainerHeight = 16;
  const defaultMarginBottom =
    style?.marginBottom !== undefined ? style.marginBottom : marginSizes.xLarge;
  const errorContainerMarginTop = marginSizes.xSmall;
  const errorContainerMarginBottom = defaultMarginBottom
    ? defaultMarginBottom - errorContainerHeight - errorContainerMarginTop
    : defaultMarginBottom;

  return (
    <View
      style={[
        styles.mainContainer,
        style,
        error
          ? {marginBottom: errorContainerMarginBottom}
          : {marginBottom: defaultMarginBottom},
      ]}>
      <View
        style={[
          styles.inputContainer,
          {borderColor: error ? currentTheme.error : currentTheme.borders},
        ]}>
        <Icon
          name={iconName}
          size={iconSize || iconSizes.xLarge}
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
      {error ? (
        <View
          style={{
            marginTop: errorContainerMarginTop,
            height: errorContainerHeight,
          }}
          testID="text-input-error">
          <Text style={[bodyTextStyles.xSmall, {color: currentTheme.error}]}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...layoutStyles.centerVertically,
  },
  inputContainer: {
    ...layoutStyles.centerHorizontally,
    borderWidth: borderWidth.xSmall,
    borderRadius: borderRadius.medium,
    padding: paddingSizes.small,
  },
  input: {
    ...bodyTextStyles.small,
    flex: 1,
    marginLeft: marginSizes.small,
  },
  showHideButton: {
    paddingRight: paddingSizes.small,
    ...ctaTextStyles.small,
  },
  icon: {
    paddingRight: paddingSizes.small,
    paddingLeft: paddingSizes.small,
  },
});

export default TextInputComponent;
