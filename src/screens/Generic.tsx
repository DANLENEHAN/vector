// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import HomepageLayout from '../components/layout/HomepageLayout';
// Styling
import {fontSizes, lightThemeColors, darkThemeColors} from '../styles/main';
import {useTheme} from '../context/ThemeContext';

const Generic: React.FC<any> = ({navigation, route}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const {name} = route.params;
  return (
    <HomepageLayout navigation={navigation}>
      <View style={styles.content}>
        <Text style={{color: currentTheme.text}}>{name}</Text>
      </View>
    </HomepageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
});

export default Generic;
