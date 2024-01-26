import React from 'react';
import {render} from '@testing-library/react-native';
import NoNetworkPopup from '@components/popups/NoNetworkPopup';

jest.mock('@context/SystemContext', () => ({
  ...jest.requireActual('@context/SystemContext'),
  useSystem: jest.fn().mockReturnValue({
    theme: 'light',
    setTheme: jest.fn(),
    userPreferenceTheme: 'system',
    setUserPreferenceTheme: jest.fn(),
  }),
}));
jest.mock('@react-native-community/netinfo', () => ({
  NetInfo: jest.fn().mockReturnValue({
    refresh: jest.fn(),
    isConnected: true,
  }),
}));

describe('NoNetworkPopup Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('NoNetworkPopup should render', () => {
    // Arrange
    const component = <NoNetworkPopup />;
    // Act
    const {getByTestId} = render(component);
    // Assert
    expect(getByTestId('no-network-popup')).toBeTruthy();
  });
});
