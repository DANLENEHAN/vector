// React imports
import React from 'react';
// Components
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import HomepageLayout from '@components/layout/HomepageLayout';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Generic Screen
 *
 * @component Generic
 * @param {Object} props - Component props
 * @returns {React.FC<any>} - React Component
 */
const Generic: React.FC<any> = ({navigation, route}) => {
  const {theme} = useSystem();
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
  content: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
});

export default Generic;
