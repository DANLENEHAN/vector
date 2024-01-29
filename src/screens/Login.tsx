// React import
import React, {useState} from 'react';
// Functions
import {
  handleLogin,
  handleCreateAccount,
} from '@services/api/blueprints/user/Functions';
import NetInfo from '@react-native-community/netinfo';
import TextValidation from '../validation/TextValidation';
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
  // State
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  // Theme
  const {theme, isConnected} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // View Link Text
  const viewLinkText = isLogin
    ? 'New here? Create Account'
    : 'Got an Account? Login';

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
          validation={new TextValidation(LoginValidationSchema.email)}
        />
        <TextInputComponent
          placeholder="Enter your password"
          value={password}
          onChangeText={text => setPassword(text)}
          iconName="lock"
          secureTextEntry={true}
          validation={new TextValidation(LoginValidationSchema.password)}
        />
        <View style={styles.buttonContainer}>
          {isLogin ? (
            <View style={styles.buttonContainer}>
              <ButtonComponent
                text="Forgot Password"
                disabled={false}
                onPress={() => null}
              />
              <ButtonComponent
                onPress={async () => {
                  await NetInfo.refresh();
                  handleLogin({
                    email: email,
                    password: password,
                    navigation: navigation,
                    isConnected: isConnected,
                  });
                }}
                disabled={!isEmailFilled || !isPasswordFilled}
                text="Login"
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <ButtonComponent
                style={styles.createAccButton}
                onPress={async () => {
                  await NetInfo.refresh();
                  handleCreateAccount({
                    email: email,
                    password: password,
                    navigation: navigation,
                    isConnected: isConnected,
                  });
                }}
                disabled={!isEmailFilled || !isPasswordFilled}
                text="Create Account"
              />
            </View>
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
    padding: paddings.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: margins.medium,
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
    marginBottom: margins.medium,
  },
  createAccButton: {
    // Override default button width
    minWidth: 225,
  },
});

export default LoginScreen;
