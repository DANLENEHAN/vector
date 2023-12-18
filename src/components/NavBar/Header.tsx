import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

// Theme
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
  fontWeights,
  borderWidth,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
// Components
import HeaderBackButton from '../buttons/HeaderBackButton';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, HomeParamList} from '../../navigation/types';

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList & HomeParamList>;
  label: string;
  //targetScreen?: keyof RootStackParamList;
  goBack?: boolean;
};

const Header: React.FC<HeaderProps> = ({navigation, label, goBack}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={[styles.header, {backgroundColor: currentTheme.background}]}>
      {
        // Include the HeaderBackButton component if targetScreen is defined
      }
      <View style={styles.sideItem}>
        {goBack && <HeaderBackButton navigation={navigation} />}
      </View>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, {color: currentTheme.darkText}]}>
          {label}
        </Text>
      </View>
      <View style={styles.sideItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
    borderTopWidth: borderWidth.xSmall,
    marginTop: margins.xxLarge,
  },
  logoText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    marginTop: margins.xSmall,
    fontWeight: fontWeights.bold,
    alignContent: 'center',
    justifyContent: 'center',
  },
  sideItem: {
    flex: 1, // Adjust this as necessary to align with BottomNavBar
  },
  logoContainer: {
    flex: 3, // Adjust this as necessary to match the width of the middle three items of BottomNavBar
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
