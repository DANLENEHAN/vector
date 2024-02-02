// React Import
import React from 'react';
// Components
import TopNavBar from '@components/navbar/TopNavBar';
import {View} from 'react-native';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList, RootStackParamList} from '@navigation/Types';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {layoutStyles} from '@styles/Main';

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
}: HomepageLayoutProps): React.ReactElement<HomepageLayoutProps> => {
  return (
    <ScreenWrapper>
      <View style={layoutStyles.centerVertically}>
        {<TopNavBar navigation={navigation} />}
        {children}
      </View>
    </ScreenWrapper>
  );
};

export default HomepageLayout;
