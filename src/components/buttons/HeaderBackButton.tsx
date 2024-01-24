// React Import
import React from 'react';
// Components
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Navigation
import {ScreenNavigationProp} from '@navigation/Types';
// Styling
import {useSystem} from '@context/SystemContext';
import {
  lightThemeColors,
  darkThemeColors,
  margins,
  paddings,
  iconSizes,
} from '@styles/Main';

/**
 * Interface for the Header Back Button Component
 *
 * @interface HeaderBackButtonProps
 *
 * @param {ScreenNavigationProp} navigation - Navigation prop for the screen
 */
interface HeaderBackButtonProps {
  navigation: ScreenNavigationProp;
}

/**
 * Header Back Button Component
 *
 * @component HeaderBackButton
 * @example
 * <HeaderBackButton navigation={navigation} />
 *
 * @param {Object} props - Component props
 * @returns {React.FC<HeaderBackButtonProps>} - React Component
 */
const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({navigation}) => {
  //Setup theme for the component
  const {theme} = useSystem();
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
