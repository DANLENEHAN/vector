import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';

type ProfileHeaderProps = {
  profileImageUrl: string;
  userName: string;
  userUsername: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImageUrl,
  userName,
  userUsername,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

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
    padding: 20,
    flex: 1,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userUsername: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    fontWeight: 'normal',
    marginBottom: 3,
  },
});

export default ProfileHeader;
