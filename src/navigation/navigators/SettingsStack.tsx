// React imports
import React from 'react';

// Navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import SettingsScreen from '../../screens/settings/Settings';
import AccountSettings from '../../screens/settings/options/AccountSettings';
import ThemeScreen from '../../screens/settings/options/Theme';
import Preferences from '../../screens/settings/options/Preferences';

// Navigation stacks
const SettingsStack = createNativeStackNavigator();

// Navigation for the Settings page
const SettingsStackNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="Preferences"
        component={Preferences}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
