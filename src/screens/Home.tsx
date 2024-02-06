// React imports
import React from 'react';
// Components
import {Text} from 'react-native';
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
      <Text>Home</Text>
    </HomepageLayout>
  );
};

export default HomeScreen;
