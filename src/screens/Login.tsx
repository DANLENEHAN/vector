import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {loginUser, createUser} from '../services/api/user/functions';
//Layouts
import ScreenWrapper from '../components/layout/ScreenWrapper';
// Components
import ButtonComponent from '../components/buttons/ButtonComponent';
import TextInputComponent from '../components/inputs/TextInputComponent';
import ClickableLink from '../components/buttons/ClickableLink';
// Styling
import {
  fontSizes,
  fontWeights,
  darkThemeColors,
  lightThemeColors,
  paddings,
  margins,
} from '../styles/main';
import {useTheme} from '../context/ThemeContext';
// Types
import {ScreenProps} from './types';

// Note fix typing of props
const LoginScreen: React.FC<ScreenProps> = ({navigation}) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleLogin = async () => {
    try {
      await loginUser({email: email, password: password});
      navigation.navigate('App', {screen: 'Home'});
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await createUser({
        // NOTE: Remove these hard-coded values when the UI is implemented fully
        email: email,
        password: password,
        age: 125,
        birthday: '1997-05-18',
        date_format_pref: '%Y-%m-%d',
        first_name: `${email.split('@')[0]}`,
        gender: 'male',
        goal: 'build_muscle',
        height_unit_pref: 'cm',
        language: 'en',
        last_name: 'Lenehan',
        phone_number: '+447308821533',
        premium: false,
        status: 'active',
        username: 'danlen97',
        weight_unit_pref: 'kg',
      });
      await loginUser({email: email, password: password});
      navigation.navigate('App');
    } catch (error) {
      console.error('Account creation failed:', error);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  const viewLinkText = isLogin
    ? 'New here? Create Account'
    : 'Got an Account? Login';

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={[styles.title, {color: currentTheme.text}]}>
          {isLogin ? 'Login' : 'Create Account'}
        </Text>
        <TextInputComponent
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setUsername(text)}
          iconName="person"
        />
        <TextInputComponent
          placeholder="Enter your password"
          value={password}
          onChangeText={text => setPassword(text)}
          iconName="lock"
          secureTextEntry={true}
        />
        <View>
          {isLogin ? (
            <View style={styles.buttonContainer}>
              <ButtonComponent
                text="Forgot Password"
                disabled={false}
                onPress={() => null}
              />
              <ButtonComponent
                onPress={handleLogin}
                disabled={!isEmailFilled || !isPasswordFilled}
                text="Login"
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <ButtonComponent
                onPress={handleCreateAccount}
                disabled={!isEmailFilled || !isPasswordFilled}
                text="Create Account"
              />
            </View>
          )}
        </View>
        <ClickableLink
          textStyle={{color: currentTheme.text}}
          onPress={toggleView}
          text={viewLinkText}
        />
      </View>
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
    width: '100%',
    marginBottom: margins.medium,
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
    marginBottom: margins.medium,
  },
});

export default LoginScreen;
