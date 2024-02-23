import React from 'react';
import {render} from '@testing-library/react-native';
import LoginScreen from '@screens/Login';
import {mockSystemContextData} from '../Objects';
import * as SystemContext from '@context/SystemContext';
import {ScreenNavigationProp} from '@navigation/Types';

jest.mock('@react-native-community/netinfo', () => {
  const mockNetInfo = {
    refresh: jest.fn(),
    isConnected: true,
  };
  return {
    __esModule: true, // this property makes it work
    default: mockNetInfo,
  };
});

jest.mock('@services/api/blueprints/device/Api', () => ({
  ...jest.requireActual('@services/asyncStorage/Functions'),
  retrieveOrRegisterDeviceId: jest.fn(),
}));

describe('LoginScreen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('LoginScreen should render without no-popup when connected', () => {
    // Arrange
    const props = {
      ...mockSystemContextData,
      // Internet is not connected
      isConnected: false,
    };

    jest.spyOn(SystemContext, 'useSystem').mockReturnValue(props);
    const component = <LoginScreen navigation={{} as ScreenNavigationProp} />;
    // Act
    const {getByTestId} = render(component);
    // Assert
    expect(getByTestId('login-screen')).toBeTruthy();
    expect(getByTestId('no-network-popup')).toBeTruthy();
  });
  it('LoginScreen should render with no-popup when connected', () => {
    // Arrange
    const props = {
      ...mockSystemContextData,
      // Internet is connected
      isConnected: true,
    };

    jest.spyOn(SystemContext, 'useSystem').mockReturnValue(props);
    const component = <LoginScreen navigation={{} as ScreenNavigationProp} />;
    // Act
    const {getByTestId, queryByTestId} = render(component);
    // Assert
    expect(getByTestId('login-screen')).toBeTruthy();
    // Ensure no popup is rendered
    expect(queryByTestId('no-network-popup')).toBeFalsy();
  });
});
