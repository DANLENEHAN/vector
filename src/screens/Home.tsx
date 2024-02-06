// React imports
import React from 'react';
// Components
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import HomepageLayout from '@components/layout/HomepageLayout';
// Types
import {ScreenProps} from '@screens/Types';

/**
 *  Home screen
 *
 * @component HomeScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the home screen component
 *
 * @example
 * <HomeScreen navigation={navigation}/>
 */
const HomeScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  return (
    <HomepageLayout navigation={navigation}>
      <View style={styles.content}>
        <Text>Home</Text>
      </View>
    </HomepageLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
