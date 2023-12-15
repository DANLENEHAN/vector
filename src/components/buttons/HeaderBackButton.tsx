import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Theme
import {useTheme} from '../../context/ThemeContext';
import {lightTheme, darkTheme} from '../../theme';

type HeaderBackButtonProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  targetScreen: keyof RootStackParamList;
};

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  navigation,
  targetScreen,
}) => {
  //Setup theme for the component
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  return (
    <TouchableOpacity
      style={[
        styles.headerBackButton,
        {backgroundColor: currentTheme.background},
      ]}
      onPress={() => navigation.navigate(targetScreen)}>
      <Icon name="arrow-left" size={25} color={currentTheme.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerBackButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default HeaderBackButton;
