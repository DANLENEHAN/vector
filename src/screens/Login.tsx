import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {loginUser, createUser} from '../services/api/user/functions';
import ScreenWrapper from '../components/ScreenWrapper';
import {RootStackParamList} from '../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const isEmailFilled = email.trim() !== '';
  const isPasswordFilled = password.trim() !== '';

  const handleLogin = async () => {
    try {
      await loginUser({email: email, password: password});
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await createUser({
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
      navigation.navigate('Home');
    } catch (error) {
      console.error('Account creation failed:', error);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {isLogin ? (
          <Text style={styles.title}>Login</Text>
        ) : (
          <Text style={styles.title}>Create Account</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={text => setUsername(text)}
          />
          <Icon name="person" size={30} color="black" />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Icon name="lock" size={30} color="black" />
        </View>
        <View>
          {isLogin ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.buttonText}>Forgot Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createAccountButton,
                  isEmailFilled && isPasswordFilled
                    ? styles.createAccountButtonBlack
                    : styles.createAccountButtonGray,
                ]}
                onPress={handleLogin}
                disabled={!isEmailFilled || !isPasswordFilled}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.createAccountButton,
                  isEmailFilled && isPasswordFilled
                    ? styles.createAccountButtonBlack
                    : styles.createAccountButtonGray,
                ]}
                onPress={handleCreateAccount}
                disabled={!isEmailFilled || !isPasswordFilled}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={toggleView}>
          <Text>
            {isLogin ? 'New here? Create Account' : 'Got an Account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  loginButton: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  createAccountButton: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  createAccountButtonBlack: {
    backgroundColor: 'black',
  },
  createAccountButtonGray: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
