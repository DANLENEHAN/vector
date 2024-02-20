// React Import
import React from 'react';
// Components
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Styling
import {useSystem} from '@context/SystemContext';
import {
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  paddingSizes,
  iconSizes,
} from '@styles/Main';

/**
 * Interface for the Header Back Button Component
 *
 * @interface HeaderBackButtonProps
 *
 * @param {CallableFunction} onClick - Function to be called when back is selected
 */
interface HeaderBackButtonProps {
  onClick: () => void;
}

/**
 * Header Back Button Component
 *
 * @component HeaderBackButton
 * @param {Object} props - Component props
 * @returns {React.FC<HeaderBackButtonProps>} - React Component
 */
const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  onClick,
}: HeaderBackButtonProps): React.ReactElement<HeaderBackButtonProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <TouchableOpacity
      style={[
        styles.headerBackButton,
        {backgroundColor: currentTheme.background},
      ]}
      onPress={() => onClick()}>
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
    marginLeft: marginSizes.small,
    padding: paddingSizes.small,
  },
});

export default HeaderBackButton;
