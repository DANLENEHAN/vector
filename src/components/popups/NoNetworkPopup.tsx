// React Imports
import React from 'react';
// Styling
import {
  fontSizes,
  fontWeights,
  darkThemeColors,
  lightThemeColors,
  paddings,
  margins,
  borderRadius,
  fonts,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import {View, Text, StyleSheet} from 'react-native';
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
const NoNetworkPopup: React.FC = () => {
  const {theme, isConnected} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.overlayContainer,
        {
          backgroundColor: `rgba(${parseInt(
            currentTheme.text.slice(1, 3),
            16,
          )}, ${parseInt(currentTheme.text.slice(3, 5), 16)}, ${parseInt(
            currentTheme.text.slice(5, 7),
            16,
          )}, ${0.5})`,
        },
      ]}>
      <View
        style={[
          styles.overlayTop,
          {
            backgroundColor: `rgba(${parseInt(
              currentTheme.text.slice(1, 3),
              16,
            )}, ${parseInt(currentTheme.text.slice(3, 5), 16)}, ${parseInt(
              currentTheme.text.slice(5, 7),
              16,
            )}, ${0.5})`,
          },
        ]}
      />
      <View
        style={[
          styles.overlayContent,
          {backgroundColor: currentTheme.background},
        ]}>
        <View style={[styles.overlayTitleContainer]}>
          <Text style={[styles.overlayTitle, {color: currentTheme.text}]}>
            No Internet
          </Text>
        </View>
        <View style={styles.overlayMessageContainer}>
          <Text
            style={[styles.overlayMessage, {color: currentTheme.lightText}]}>
            Oops! It looks like you're offline. We can't reach our servers at
            the moment. Please check your internet connection and try again.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonComponent
            style={[styles.retryButton]}
            onPress={async () => {
              await NetInfo.refresh();
            }}
            disabled={isConnected}
            text="Retry"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute', // Position the red view absolutely
    bottom: 0, // Position it at the bottom of the parent view
    width: '100%',
    height: '100%',
    flex: 1,
    zIndex: 100,
    borderTop: 1,
  },
  overlayTop: {
    flex: 1,
  },
  overlayContent: {
    height: 300,
    borderTopRightRadius: borderRadius.xLarge,
    borderTopLeftRadius: borderRadius.xLarge,
    justifyContent: 'space-around',
  },
  overlayTitleContainer: {
    marginTop: margins.medium,
    padding: paddings.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.primary,
  },
  overlayMessageContainer: {
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    alignSelf: 'center',
    marginVertical: margins.medium,
  },
  overlayMessage: {
    width: '100%',
    justifyContent: 'center',
    padding: paddings.medium,
    flexWrap: 'wrap',
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.light,
    fontFamily: fonts.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: margins.medium,
  },
  retryButton: {
    // Override default button width
    minWidth: 225,
  },
});

export default NoNetworkPopup;
