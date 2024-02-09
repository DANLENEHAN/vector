// React Native Import
import React from 'react';
// Components
import {View, StyleSheet, Text, Image} from 'react-native';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  borderRadius,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the ProfileHeader Component
 *
 * @interface ProfileHeaderProps
 *
 * @param {string} profileImageUrl - The url for the profile image
 * @param {string} userName - The name of the user
 * @param {string} userUsername - The username of the user
 */
interface ProfileHeaderProps {
  profileImageUrl: string;
  userName: string;
  userUsername: string;
}

/**
 * Profile Header Component
 *
 * @component ProfileHeader
 * @example
 * <ProfileHeader
 *     profileImageUrl={'https://picsum.photos/200'}
 *     userName={'John Smith'}
 *     userUsername={'@johnsmith'}
 * />
 *
 * @param {Object} props - Component ProfileHeader Props
 * @returns {React.FC<ProfileHeaderProps>} - React Component
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImageUrl,
  userName,
  userUsername,
}: ProfileHeaderProps): React.ReactElement<ProfileHeaderProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.profileContainer,
        {backgroundColor: currentTheme.background},
      ]}>
      <Image style={styles.profileImage} source={{uri: profileImageUrl}} />
      <Text style={[styles.userName, {color: currentTheme.text}]}>
        {userName}
      </Text>
      <Text style={[styles.userUsername, {color: currentTheme.text}]}>
        {userUsername}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.circle,
    marginBottom: marginSizes.medium,
  },
  userName: {
    ...headingTextStyles.small,
    marginBottom: marginSizes.medium,
  },
  userUsername: {
    ...bodyTextStyles.xSmall,
  },
});

export default ProfileHeader;
