import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
// Functions
import {useSystem} from '@context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  margins,
  borderRadius,
} from '@styles/Main';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';

interface ErrorPopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({visible, message, onClose}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          {backgroundColor: currentTheme.lowOpacityBackground},
        ]}>
        <View
          style={[
            styles.popupContainer,
            {backgroundColor: currentTheme.background},
          ]}>
          <Text style={[styles.errorText, {color: currentTheme.text}]}>
            {message}
          </Text>
          <ButtonComponent onPress={onClose} text={'Ok'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    flex: 0.2,
    width: '80%',
    borderRadius: borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    margin: margins.xLarge,
  },
});

export default ErrorPopup;
