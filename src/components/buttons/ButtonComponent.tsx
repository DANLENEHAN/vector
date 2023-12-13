import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type ButtonProps = {
  onPress: () => void;
  disabled: boolean;
  text: string;
  style?: object;
};

const ButtonComponent: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  text,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled ? styles.buttonGray : styles.buttonBlack,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonBlack: {
    backgroundColor: 'black',
  },
  buttonGray: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ButtonComponent;
