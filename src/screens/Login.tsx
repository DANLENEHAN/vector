// React import
import React, {useState} from 'react';
// Functions
import {
  handleLogin,
  handleCreateAccount,
} from '@services/api/blueprints/user/Functions';
import NetInfo from '@react-native-community/netinfo';
import TextValidation from '@validation/TextValidation';
//Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';
import TextInputComponent from '@components/inputs/TextInputComponent';
import ClickableLink from '@components/buttons/ClickableLink';
import {View, Text, StyleSheet} from 'react-native';
import NoNetworkPopup from '@components/popups/NoNetworkPopup';
// Styling
import {
  fontSizes,
  fontWeights,
  darkThemeColors,
  lightThemeColors,
  paddings,
  margins,
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
 *
 * @returns {React.FC} - Returns the login screen component
 *
 * @example
 * <LoginScreen navigation={navigation}/>
 */
const LoginScreen: React.FC<ScreenProps> = ({navigation}) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);
  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  const {theme, isConnected} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const viewLinkText = isLogin
    ? 'New here? Create Account'
    : 'Got an Account? Login';

  const handleLoginSubmit = async () => {
    await NetInfo.refresh();
    setIsSubmitPressed(true);
    handleLogin({
      email: email,
      password: password,
      navigation: navigation,
      isConnected: isConnected,
    });
  };

  const handleCreateAccountSubmit = async () => {
    await NetInfo.refresh();
    setIsSubmitPressed(true);
    handleCreateAccount({
      email: email,
      password: password,
      navigation: navigation,
      isConnected: isConnected,
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container} testID="login-screen">
        <Text style={[styles.title, {color: currentTheme.text}]}>
          {isLogin ? 'Login' : 'Create Account'}
        </Text>
        <TextInputComponent
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setUsername(text)}
          iconName="envelope"
          style={{...styles.inputContainers}}
          validation={
            new TextValidation('Email', LoginValidationSchema.email, {
              pattern: 'Please enter a valid email address',
            })
          }
          enableErrors={isSubmitPressed}
        />
        <TextInputComponent
          placeholder="Enter your password"
          value={password}
          onChangeText={text => setPassword(text)}
          iconName="lock"
          secureTextEntry={true}
          style={{...styles.inputContainers}}
          validation={
            new TextValidation('Password', LoginValidationSchema.password)
          }
          enableErrors={isSubmitPressed}
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
                onPress={handleLoginSubmit}
                disabled={!isEmailFilled || !isPasswordFilled}
                text="Login"
              />
            </>
          ) : (
            <ButtonComponent
              style={styles.createAccButton}
              onPress={handleCreateAccountSubmit}
              disabled={!isEmailFilled || !isPasswordFilled}
              text="Create Account"
            />
          )}
        </View>
        <ClickableLink
          textStyle={{color: currentTheme.text}}
          onPress={() => setIsLogin(prev => !prev)}
          text={viewLinkText}
        />
      </View>
      {!isConnected && <NoNetworkPopup />}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: paddings.large,
    paddingRight: paddings.large,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: margins.xxxLarge,
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    marginBottom: margins.xxxLarge,
  },
  createAccButton: {
    // Override default button width
    minWidth: 225,
  },
  inputContainers: {
    marginBottom: margins.xxxLarge,
  },
});

export default LoginScreen;
