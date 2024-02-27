import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {iconNames} from '../icons';
import {SystemProvider} from '../../../src/context/SystemContext'; // Adjust the import path as necessary
import {useSystem} from '../../../src/context/SystemContext'; // Adjust the import path as necessary
import {lightThemeColors, darkThemeColors} from '../../../src/styles/Main';

export default {
  title: 'Styles/FontAwesome6 Icons',
  component: Icon,
  decorators: [
    Story => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const IconsGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter icons based on search term
  const filteredIcons = iconNames.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Icons"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {filteredIcons.map((iconName, index) => (
          <View key={index} style={styles.iconContainer}>
            <Icon name={iconName} size={30} color={'white'} solid />
            <Text style={[styles.iconLabel, {color: 'white'}]}>{iconName}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const FontAwesome6Icons = IconsGrid.bind({});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 50,
  },
  iconContainer: {
    alignItems: 'center',
    width: 80, // Adjust the width as necessary
    margin: 5,
  },
  iconLabel: {
    marginTop: 5,
  },
});
