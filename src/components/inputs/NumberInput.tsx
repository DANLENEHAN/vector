import React, {useState} from 'react';
import {TextInput, StyleSheet} from 'react-native';

const NumberInput = ({allowFloat, ...props}) => {
  const [value, setValue] = useState('');

  const handleChange = text => {
    let validatedText = text;

    // Allow only numbers and, if allowFloat is true, a single dot for float values
    if (allowFloat) {
      validatedText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
      validatedText = text.replace(/[^0-9]/g, '');
    }
    setValue(validatedText);
  };

  return (
    <TextInput
      {...props}
      value={value}
      defaultValue={allowFloat ? '0.0' : '0'}
      style={styles.textInput}
      onChangeText={handleChange}
      keyboardType={allowFloat ? 'numeric' : 'number-pad'}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default NumberInput;
