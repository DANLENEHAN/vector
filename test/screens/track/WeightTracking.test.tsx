import WeightTracking from '@screens/track/WeightTracking';
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ScreenNavigationProp} from '@navigation/Types';
import {mockSystemContextData} from '../../Objects';
import * as SystemContext from '@context/SystemContext';

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

describe('WeightTracking Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('WeightTracking should render', () => {
    // Arrange
    jest
      .spyOn(SystemContext, 'useSystem')
      .mockReturnValue(mockSystemContextData);
    const component = (
      <WeightTracking navigation={{} as ScreenNavigationProp} />
    );
    // Act
    const {getByTestId} = render(component);
    // Assert
    expect(getByTestId('WeightTracking')).toBeTruthy();
  });

  it('WeightTracking should render both inputs if stone', () => {
    // Arrange
    jest
      .spyOn(SystemContext, 'useSystem')
      .mockReturnValue(mockSystemContextData);
    const component = (
      <WeightTracking navigation={{} as ScreenNavigationProp} />
    );
    // Act
    const {getByTestId, getByText, queryByTestId} = render(component);
    const stoneButton = getByText('stone');
    const kgButton = getByText('kg');
    // Assert
    fireEvent.press(stoneButton);
    // both inputs should be visible
    expect(getByTestId('WeightTracking_unit_a')).toBeTruthy();
    expect(getByTestId('WeightTracking_unit_b')).toBeTruthy();
    fireEvent.press(kgButton);
    expect(queryByTestId('WeightTracking_unit_a')).toBeNull();
    expect(queryByTestId('WeightTracking_unit_b')).toBeNull();
  });
});
