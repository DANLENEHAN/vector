import React from 'react';

// Components
import {Appearance, View, StyleSheet} from 'react-native';
import Header from '../../../components/navbar/Header';
import OptionGroup from '../../../components/settings/OptionGroup';
import {lightThemeColors, darkThemeColors} from '../../../styles/main';

// Styling
import {useTheme} from '../../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserPreference} from '../../../services/asyncStorage/types';

const AppAppearance: React.FC<any> = ({navigation}) => {
  const {theme, setTheme, userPreferenceTheme, setUserPreferenceTheme} =
    useTheme();
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
    AsyncStorage.setItem(UserPreference, selectedTheme);
  };
  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <Header
        label="App Appearance"
        navigation={navigation}
        includeBackArrow={true}
      />
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
  },
  settingsSection: {
    flex: 1,
  },
});

export default AppAppearance;
