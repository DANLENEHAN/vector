// React imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  //lightThemeColors,
  //darkThemeColors,
  fontWeights,
  margins,
} from '../../styles/main';
//import {useTheme} from '../../context/ThemeContext';
// Components
import Header from '../../components/navbar/Header';
// Services
//import {getStats} from '../../services/api/blueprints/stat_api';
// Types
import {ScreenProps} from '../types';

const WeightTracking: React.FC<ScreenProps> = ({navigation}) => {
  //const {theme} = useTheme();
  //const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <Header
        label="Weight"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.content} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
  },
  titleContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackContainer: {
    flex: 8,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  numberInput: {
    margin: margins.small,
  },
});

export default WeightTracking;
