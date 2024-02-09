// React import
import React, {useState} from 'react';
// Functions
import {
  handleLogin,
  handleCreateAccount,
} from '@services/api/blueprints/user/Functions';
import TextValidation from '@validation/TextValidation';
import NetInfo from '@react-native-community/netinfo';
//Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';
import TextInputComponent from '@components/inputs/TextInputComponent';
import ClickableLink from '@components/buttons/ClickableLink';
import {View, Text, StyleSheet} from 'react-native';
import NoNetworkPopup from '@components/popups/NoNetworkPopup';
import ErrorPopup from '@components/popups/ErrorPopup';

// Styling
import {
  darkThemeColors,
  lightThemeColors,
  paddingSizes,
  layoutStyles,
  headingTextStyles,
  buttonStyles,
  ctaTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Types
import {ScreenProps} from '@screens/Types';
// Objects
import {LoginValidationSchema} from '@validation/Schemas';

/**
 *  Login screen
 *
 * @component LoginScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 * @returns {React.FC} - Returns the login screen component
 */
const LoginScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const [email, setEmailState] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPasswordState] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [isLogin, setIsLogin] = useState(true);
  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  const {theme, isConnected} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const viewLinkText = isLogin
    ? 'New here? Create Account'
    : 'Got an Account? Login';

  const setEmail = (textInput: string, inputValid: boolean) => {
    setEmailState(textInput);
    setEmailValid(inputValid);
  };

  const setPassword = (textInput: string, inputValid: boolean) => {
    setPasswordState(textInput);
    setPasswordValid(inputValid);
  };

  const handleLoginResponse = async () => {
    NetInfo.refresh();
    const response = await handleLogin({
      email: email,
      password: password,
      navigation: navigation,
      isConnected: isConnected,
    });
    setFormError(response ? response : '');
  };

  const handleCreateAccountResponse = async () => {
    NetInfo.refresh();
    const response = await handleCreateAccount({
      email: email,
      password: password,
      navigation: navigation,
      isConnected: isConnected,
    });
    setFormError(response ? response : '');
  };

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper} testID="login-screen">
        <View style={styles.content}>
          <Text style={[styles.title, {color: currentTheme.text}]}>
            {isLogin ? 'Login' : 'Create Account'}
          </Text>
          <TextInputComponent
            placeholder="Enter your email"
            value={email}
            onChangeText={(textInput: string, inputValid: boolean) =>
              setEmail(textInput, inputValid)
            }
            iconName="envelope"
            validation={
              new TextValidation('Email', LoginValidationSchema.email, {
                pattern: 'Please enter a valid email address',
              })
            }
            enableErrors={isEmailFilled}
          />
          <TextInputComponent
            placeholder="Enter your password"
            value={password}
            onChangeText={(textInput: string, inputValid: boolean) =>
              setPassword(textInput, inputValid)
            }
            iconName="lock"
            secureTextEntry={true}
            validation={
              new TextValidation('Password', LoginValidationSchema.password)
            }
            enableErrors={isPasswordFilled}
          />
          <View style={styles.buttonContainer}>
            {isLogin ? (
              <>
                <ButtonComponent
                  text="Forgot Password"
                  disabled={false}
                  onPress={() => null}
                />
                <ButtonComponent
                  onPress={() => {
                    handleLoginResponse();
                  }}
                  disabled={
                    !isEmailFilled ||
                    !isPasswordFilled ||
                    !emailValid ||
                    !passwordValid
                  }
                  text="Login"
                />
              </>
            ) : (
              <ButtonComponent
                style={styles.createAccButton}
                onPress={() => {
                  handleCreateAccountResponse();
                }}
                disabled={
                  !isEmailFilled ||
                  !isPasswordFilled ||
                  !emailValid ||
                  !passwordValid
                }
                text="Create Account"
              />
            )}
          </View>
          <ClickableLink
            textStyle={[styles.clickableLink, {color: currentTheme.text}]}
            onPress={() => setIsLogin(prev => !prev)}
            text={viewLinkText}
          />
        </View>
      </View>
      <ErrorPopup
        visible={!!formError}
        message={formError}
        onClose={() => setFormError('')}
      />
      {!isConnected && <NoNetworkPopup />}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  content: {
    height: '45%',
    ...layoutStyles.spaceBetweenVertical,
    paddingLeft: paddingSizes.large,
    paddingRight: paddingSizes.large,
  },
  buttonContainer: {
    ...layoutStyles.spaceBetweenHorizontal,
  },
  title: {
    ...headingTextStyles.medium,
  },
  createAccButton: {
    ...buttonStyles.medium,
  },
  clickableLink: {
    ...ctaTextStyles.xSmall,
  },
});

export default LoginScreen;
