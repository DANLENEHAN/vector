// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';

// Styling
import {fontSizes, lightThemeColors, darkThemeColors} from '../../styles/main';

//Services
import {useTheme} from '../../context/ThemeContext';

const WellnessProgressScreen: React.FC<any> = ({route}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Text style={{color: currentTheme.text}}>{route.name}</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
});

export default WellnessProgressScreen;
