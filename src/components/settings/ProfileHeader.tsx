// React Native Import
import React from 'react';
// Components
import {View, StyleSheet, Text, Image} from 'react-native';
// Styling
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
  paddings,
  borderRadius,
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
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={styles.profileContainerContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: paddings.large,
    flex: 1,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: borderRadius.circle,
    marginBottom: margins.small,
  },
  userName: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    fontWeight: 'bold',
    marginBottom: margins.small,
  },
  userUsername: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    marginBottom: margins.xSmall,
  },
});

export default ProfileHeader;
