import React from 'react';
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
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type ProfileHeaderProps = {
  profileImageUrl: string;
  name: string;
  username: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImageUrl,
  name,
  username,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={styles.profileContainerContainer}>
      <View
        style={[
          styles.profileContainer,
          {backgroundColor: currentTheme.background},
        ]}>
        <Image style={styles.profileImage} source={{uri: profileImageUrl}} />
        <Text style={[styles.name, {color: currentTheme.text}]}>{name}</Text>
        <Text style={[styles.username, {color: currentTheme.text}]}>
          {username}
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
  name: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    fontWeight: 'bold',
    marginBottom: margins.small,
  },
  username: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    marginBottom: margins.xSmall,
  },
});

export default ProfileHeader;
