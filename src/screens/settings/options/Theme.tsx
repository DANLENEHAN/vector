// React imports
import React from 'react';
// Components
import {Appearance, View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import OptionGroup from '@components/settings/OptionGroup';
import {margins} from '@styles/main';
// Styling
import {useSystem} from '@context/SystemContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import ScreenWrapper from '@components/layout/ScreenWrapper';

/**
 * Theme Screen
 *
 * @component ThemeScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the theme screen component
 *
 * @example
 * <ThemeScreen navigation={navigation}/>
 */
const ThemeScreen: React.FC<any> = ({navigation}) => {
  const {setTheme, userPreferenceTheme, setUserPreferenceTheme} = useSystem();

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
    <ScreenWrapper>
      <Header
        label="Theme"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />

      <View style={styles.settingsSection}>
        <OptionGroup
          options={options}
          selectedOption={initialSelectedIndex}
          onOptionPress={handleOptionPress}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    marginTop: margins.xxLarge,
    flex: 1,
    width: '100%',
  },
});

export default ThemeScreen;
