import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TrackTabNavigator from '@navigation/navigators/TrackTab';
import {NavigationContainer} from '@react-navigation/native';
import {useSystem} from '@context/SystemContext';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(),
}));

describe('TrackTabNavigator Tests', () => {
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
        <TrackTabNavigator />
      </NavigationContainer>,
    );

    // Test the tab labels are correct
    const workoutTabLabel = getByTestId('tab-label-workouttracking');
    expect(workoutTabLabel.props.children).toBe('Workout');

    const nutritionTabLabel = getByTestId('tab-label-nutritiontracking');
    expect(nutritionTabLabel.props.children).toBe('Nutrition');

    const wellnessTabLabel = getByTestId('tab-label-wellnesstracking');
    expect(wellnessTabLabel.props.children).toBe('Wellness');
  });

  // Test if correct content for each tab is rendered
  it('should show correct content for each tab', () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <TrackTabNavigator />
      </NavigationContainer>,
    );

    // Simulate pressing the Workout tab
    fireEvent.press(getByTestId('tab-label-workouttracking'));
    expect(getByTestId('workout-tracking-screen')).toBeTruthy();

    // Simulate pressing the Nutrition tab
    fireEvent.press(getByTestId('tab-label-nutritiontracking'));
    expect(getByTestId('nutrition-tracking-screen')).toBeTruthy();

    // Simulate pressing the Wellness tab
    fireEvent.press(getByTestId('tab-label-wellnesstracking'));
    expect(getByTestId('wellness-tracking-screen')).toBeTruthy();
  });
});
