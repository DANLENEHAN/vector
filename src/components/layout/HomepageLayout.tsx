// React Import
import React from 'react';
// Components
import TopNavBar from '@components/navbar/TopNavBar';
import {View, StyleSheet} from 'react-native';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList, RootStackParamList} from '@navigation/types';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';

/**
 * HomepageLayout
 * @interface HomepageLayoutProps
 *
 * @param {React.ReactNode} children - The children to render
 * @param {NativeStackNavigationProp<RootStackParamList & HomeParamList>} navigation - The navigation prop
 */
interface HomepageLayoutProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList & HomeParamList>;
}

/**
 * HomepageLayout
 *
 * @component HomepageLayout
 * @example
 * <HomepageLayout
 *    navigation={navigation}
 * >
 *    <View>
 *      <Text>Example</Text>
 *    </View>
 * </HomepageLayout>
 *
 * @param {Object} props - Component Props
 * @returns {React.FC<HomepageLayoutProps>} - React Component
 */
const HomepageLayout: React.FC<HomepageLayoutProps> = ({
  children,
  navigation,
}) => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {<TopNavBar navigation={navigation} />}
        {children}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomepageLayout;
