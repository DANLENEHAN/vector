import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {loginUser} from '../services/api/user/user_api';

const LoginScreen: React.FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleLogin = async () => {
    const loginResponse = await loginUser({email: email, password: password});
    setResponse(loginResponse);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" type="font-awesome" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" type="font-awesome" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text>{response}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
