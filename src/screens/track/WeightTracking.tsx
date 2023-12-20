// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  fontWeights,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
// Components
import Header from '../../components/navbar/Header';
import UnitSelector from '../../components/buttons/UnitSelector';
import NumberInput from '../../components/inputs/NumberInput';

const WeightTracking: React.FC<any> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <ScreenWrapper>
      <Header
        label=""
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, {color: currentTheme.text}]}>
            What is your weight?
          </Text>
        </View>
        <View style={styles.trackContainer}>
          <NumberInput allowFloat={true} />
          <UnitSelector units={['KG', 'LBS', 'Stone']} />
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
    //backgroundColor: 'red'
  },
  //   unitSelector: {
  //    height: 50,
  //    backgroundColor: 'green',
  //    width: '80%',
  //    borderRadius: borderRadius.medium,
  //     flexDirection: 'row',
  //  },
  //     unitOption: {
  //     flex: 1,
  //     width: '33%',
  //     justifyContent: 'center',
  //     alignItems: 'center',

  //     },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
});

export default WeightTracking;
