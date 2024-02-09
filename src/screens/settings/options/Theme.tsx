// React imports
import React from 'react';
// Components
import {Appearance, View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import OptionGroup from '@components/settings/OptionGroup';
import {darkThemeColors, lightThemeColors, layoutStyles} from '@styles/Main';
// Styling
import {useSystem} from '@context/SystemContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
// Types
import {ScreenProps} from '@screens/Types';

/**
 * Theme Screen
 *
 * @component ThemeScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the theme screen component
 */
const ThemeScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme, setTheme, userPreferenceTheme, setUserPreferenceTheme} =
    useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const options = [
    {value: 'system', label: 'System Preferences'},
    {value: 'dark', label: 'Dark Mode'},
    {value: 'light', label: 'Light Mode'},
  ];

  // Find the index of the initially selected option based on the theme
  const initialSelectedIndex = options.findIndex(
    option => option.value === userPreferenceTheme,
  );
  // Callback function to set the theme when an option is pressed
  const handleOptionPress = (index: number) => {
    const selectedTheme = options[index].value as 'light' | 'dark' | 'system';
    if (selectedTheme === 'system') {
      setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    } else {
      setTheme(selectedTheme);
    }
    setUserPreferenceTheme(selectedTheme);
    AsyncStorage.setItem(AsyncStorageKeys.UserThemePreference, selectedTheme);
  };
  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <Header label="Theme" navigation={navigation} includeBackArrow={true} />
      </View>
      <View style={styles.settingsSection}>
        <OptionGroup
          options={options}
          selectedOption={initialSelectedIndex}
          onOptionPress={handleOptionPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  headerSection: {
    flex: 2,
    ...layoutStyles.centerVertically,
  },
  settingsSection: {
    flex: 8,
  },
});

export default ThemeScreen;
