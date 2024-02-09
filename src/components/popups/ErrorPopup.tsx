import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
// Functions
import {useSystem} from '@context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  marginSizes,
  borderRadius,
  buttonStyles,
  layoutStyles,
  ctaTextStyles,
} from '@styles/Main';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';

interface ErrorPopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  message,
  onClose,
}: ErrorPopupProps): React.ReactElement<ErrorPopupProps> => {
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
          <Text style={[styles.ctaText, {color: currentTheme.text}]}>
            {message}
          </Text>
          <ButtonComponent
            style={styles.closeButton}
            onPress={onClose}
            text={'Ok'}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  popupContainer: {
    flex: 0.2,
    width: '95%',
    borderRadius: borderRadius.large,
    ...layoutStyles.centerVertically,
  },
  ctaText: {
    ...ctaTextStyles.small,
    marginLeft: marginSizes.large,
    marginRight: marginSizes.large,
    marginBottom: marginSizes.xxLarge,
  },
  closeButton: {
    ...buttonStyles.medium,
  },
});

export default ErrorPopup;
