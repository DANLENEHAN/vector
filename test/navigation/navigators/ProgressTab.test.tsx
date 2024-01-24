import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ProgressTabNavigator from '@navigation/navigators/ProgressTab';
import {NavigationContainer} from '@react-navigation/native';
import {useSystem} from '@context/SystemContext';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(),
}));
// Mock useSafeAreaInsets hook
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn().mockReturnValue({top: 0, bottom: 0}),
  SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
}));

describe('ProgressTabNavigator Tests', () => {
  beforeEach(() => {
    // Set up the mock return value before each test
    (useSystem as jest.Mock).mockReturnValue({
      theme: 'light', // or 'dark', depending on what you want to test
      setTheme: jest.fn(),
      userPreferenceTheme: 'system',
      setUserPreferenceTheme: jest.fn(),
    });
  });

  // Test if the component renders
  it('should render the navigator', () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <ProgressTabNavigator />
      </NavigationContainer>,
    );

    // Test the tab labels are correct
    const workoutTabLabel = getByTestId('tab-label-workoutprogress');
    expect(workoutTabLabel.props.children).toBe('Workout');

    const nutritionTabLabel = getByTestId('tab-label-nutritionprogress');
    expect(nutritionTabLabel.props.children).toBe('Nutrition');

    const wellnessTabLabel = getByTestId('tab-label-wellnessprogress');
    expect(wellnessTabLabel.props.children).toBe('Wellness');
  });

  // Test if correct content for each tab is rendered
  it('should show correct content for each tab', () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <ProgressTabNavigator />
      </NavigationContainer>,
    );

    // Simulate pressing the Workout tab
    fireEvent.press(getByTestId('tab-label-workoutprogress'));
    expect(getByTestId('workout-progress-screen')).toBeTruthy();

    // Simulate pressing the Nutrition tab
    fireEvent.press(getByTestId('tab-label-nutritionprogress'));
    expect(getByTestId('nutrition-progress-screen')).toBeTruthy();

    // Simulate pressing the Wellness tab
    fireEvent.press(getByTestId('tab-label-wellnessprogress'));
    expect(getByTestId('wellness-progress-screen')).toBeTruthy();
  });
});
