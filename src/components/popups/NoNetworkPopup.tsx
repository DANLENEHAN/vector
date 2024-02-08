// React Imports
import React from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  headingStyles,
  layoutStyles,
  textStyles,
  borderRadius,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';
import NetInfo from '@react-native-community/netinfo';

/**
 * No Network Popup
 * This component is used to display a popup when the user is not connected to the internet
 *
 * @component NoNetworkPopup
 *
 * @returns {React.FC} - Returns the no network popup component
 *
 * @example
 * <NoNetworkPopup />
 */
const NoNetworkPopup: React.FC = (): React.ReactElement => {
  const {theme, isConnected} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <Modal
      testID="no-network-popup"
      animationType="fade"
      transparent={true}
      onRequestClose={async () => {
        await NetInfo.refresh();
      }}
      visible={!isConnected}>
      <View
        style={[
          styles.modalBackGround,
          {backgroundColor: currentTheme.lowOpacityBackground},
        ]}>
        <View
          style={[styles.content, {backgroundColor: currentTheme.background}]}>
          <Text
            style={{color: currentTheme.text, ...headingStyles.headingPrimary}}>
            No Internet
          </Text>
          <Text style={[styles.textBody, {color: currentTheme.text}]}>
            Oops! It looks like you're offline. We can't reach our servers at
            the moment. Please check your internet connection and try again.
          </Text>
          <ButtonComponent
            onPress={async () => {
              await NetInfo.refresh();
            }}
            disabled={isConnected}
            text="Retry"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    ...layoutStyles.centerVertically,
    flex: 1,
  },
  content: {
    ...layoutStyles.spaceAroundVertical,
    height: 300,
    borderTopRightRadius: borderRadius.xLarge,
    borderTopLeftRadius: borderRadius.xLarge,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  textBody: {
    ...textStyles.bodyPrimarySmall,
    width: '90%',
    textAlign: 'center',
  },
});

export default NoNetworkPopup;
