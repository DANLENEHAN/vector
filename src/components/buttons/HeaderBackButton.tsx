import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {
  lightThemeColors,
  darkThemeColors,
  margins,
  paddings,
} from '../../styles/main';

type HeaderBackButtonProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({navigation}) => {
  //Setup theme for the component
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <TouchableOpacity
      style={[
        styles.headerBackButton,
        {backgroundColor: currentTheme.background},
      ]}
      onPress={() => navigation.navigate('Settings')}>
      <Icon name="arrow-left" size={25} color={currentTheme.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerBackButton: {
    marginLeft: margins.small,
    padding: paddings.small,
  },
});

export default HeaderBackButton;
