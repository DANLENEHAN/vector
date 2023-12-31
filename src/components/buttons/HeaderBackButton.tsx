import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
// Navigation
import {ScreenNavigationProp} from '../../navigation/types';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {
  lightThemeColors,
  darkThemeColors,
  margins,
  paddings,
  iconSizes,
} from '../../styles/main';

interface HeaderBackButtonProps {
  navigation: ScreenNavigationProp;
}

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
      onPress={() => navigation.goBack()}>
      <Icon
        name="arrow-left"
        size={iconSizes.large}
        color={currentTheme.text}
      />
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
