// React Import
import React, {useState, useEffect} from 'react';
// Components
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextStyle,
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
 * Props for a TextInput component, providing configuration for text entry within forms.
 *
 * @interface TextInputProps
 * @property {string} placeholder - The placeholder text displayed in the input when it's empty.
 * @property {string} value - The current text value of the input field.
 * @property {(textInput: string, inputValid: boolean) => void} onChangeText - Function called when the input text changes, along with a validity flag.
 * @property {boolean} [secureTextEntry] - If true, hides the input text, making it suitable for password entry.
 * @property {boolean} [autoCapitalize] - If true, automatically capitalizes the first letter of each sentence.
 * @property {string} [iconName] - Optional name of the icon to display alongside the input.
 * @property {TextValidation} [validation] - Optional validation logic to apply to the input text.
 * @property {boolean} [enableErrors] - If true, displays error messages based on the validation.
 * @property {keyof TextInputComponentSizeOptions} size - Defines the size of the input component, affecting its appearance and layout.
 */
interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (textInput: string, inputValid: boolean) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName?: string;
  validation?: TextValidation;
  enableErrors?: boolean;
  size?: keyof TextInputComponentSizeOptions;
}

interface TextInputComponentSizeOption {
  iconSize: number;
  inputTextSize: TextStyle;
  errorTextSize: TextStyle;
  height: number;
  width: number;
}

interface TextInputComponentSizeOptions {
  large: TextInputComponentSizeOption;
  medium: TextInputComponentSizeOption;
  small: TextInputComponentSizeOption;
}

const TextInputComponentSizeOptions: TextInputComponentSizeOptions = {
  large: {
    iconSize: iconSizes.xLarge,
    inputTextSize: bodyTextStyles.small,
    errorTextSize: bodyTextStyles.xSmall,
    height: 60,
    width: 375,
  },
  medium: {
    iconSize: iconSizes.large,
    inputTextSize: bodyTextStyles.xSmall,
    errorTextSize: bodyTextStyles.xxSmall,
    height: 55,
    width: 350,
  },
  small: {
    iconSize: iconSizes.medium,
    inputTextSize: bodyTextStyles.xxSmall,
    errorTextSize: bodyTextStyles.xxxSmall,
    height: 50,
    width: 325,
  },
};

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
  onChangeText,
  validation,
  enableErrors = false,
  secureTextEntry = false,
  autoCapitalize = false,
  size = 'large',
}: TextInputProps): React.ReactElement<TextInputProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [isSecureEntry, setIsSecureEntry] = useState<boolean>(secureTextEntry);
  const [error, setError] = useState<string | null>(null);

  const componentSizeStlying = TextInputComponentSizeOptions[size];

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

  // Defining margin is for the Error Messages to show nicely
  const defaultMarginBottom = validation === undefined ? 0 : marginSizes.xLarge;

  const errorContainerMarginTop = marginSizes.xSmall;
  const errorContainerHeight = defaultMarginBottom - errorContainerMarginTop;
  const errorContainerMarginBottom = defaultMarginBottom
    ? defaultMarginBottom - errorContainerHeight - errorContainerMarginTop
    : defaultMarginBottom;

  return (
    <View
      style={[
        styles.mainContainer,
        error
          ? {marginBottom: errorContainerMarginBottom}
          : {marginBottom: defaultMarginBottom},
      ]}>
      <View
        style={[
          styles.inputContainer,
          {
            width: componentSizeStlying.width,
            height: componentSizeStlying.height,
            borderColor: error ? currentTheme.error : currentTheme.borders,
          },
        ]}>
        {iconName && (
          <Icon
            style={styles.icon}
            name={iconName}
            size={componentSizeStlying.iconSize}
            color={currentTheme.icon}
            solid
          />
        )}

        <TextInput
          style={[
            styles.input,
            componentSizeStlying.inputTextSize,
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
          <Text
            style={[
              componentSizeStlying.errorTextSize,
              {color: currentTheme.error},
            ]}>
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
    ...layoutStyles.flexStartHorizontal,
    borderWidth: borderWidth.xSmall,
    borderRadius: borderRadius.medium,
    paddingHorizontal: paddingSizes.small,
  },
  input: {
    flex: 8,
  },
  showHideButton: {
    ...ctaTextStyles.small,
  },
  icon: {
    flex: 1,
    paddingRight: paddingSizes.small,
  },
});

export default TextInputComponent;
