import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

// Theme
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';
// Components
import HeaderBackButton from '../buttons/HeaderBackButton';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  label: string;
  targetScreen?: keyof RootStackParamList;
};

const Header: React.FC<HeaderProps> = ({navigation, label, targetScreen}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.header, {backgroundColor: currentTheme.background}]}>
      {
        // Include the HeaderBackButton component if targetScreen is defined
      }
      <View style={styles.sideItem}>
        {targetScreen && (
          <HeaderBackButton
            navigation={navigation}
            targetScreen={targetScreen}
          />
        )}
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
    borderTopWidth: 1,
    marginTop: 30,
  },
  logoText: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.primary,
    marginTop: 4,
    fontWeight: '700',
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
