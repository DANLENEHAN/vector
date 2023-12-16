import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../../../components/navbar/Header';
import OptionGroup from '../../../components/settings/OptionGroup';
import {lightThemeColors, darkThemeColors} from '../../../styles/main';
import {useTheme} from '../../../context/ThemeContext';

const AppAppearance: React.FC<any> = ({navigation}) => {
  const {theme, setTheme} = useTheme(); // Added setTheme
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Define options based on the theme
  const options = [
    {value: 'system', label: 'System Preferences'},
    {value: 'dark', label: 'Dark Mode'},
    {value: 'light', label: 'Light Mode'},
  ];

  // Find the index of the initially selected option based on the theme
  const initialSelectedIndex = options.findIndex(
    option => option.value === theme,
  );

  // Callback function to set the theme when an option is pressed
  const handleOptionPress = (index: number) => {
    const selectedTheme = options[index].value as 'light' | 'dark'; // Explicit type cast
    setTheme(selectedTheme);
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
  profileSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    flex: 7,
  },
});

export default AppAppearance;
