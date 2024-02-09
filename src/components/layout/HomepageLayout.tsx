// React Import
import React from 'react';
// Components
import TopNavBar from '@components/navbar/TopNavBar';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList, RootStackParamList} from '@navigation/Types';
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
 * @param {Object} props - Component Props
 * @returns {React.FC<HomepageLayoutProps>} - React Component
 */
const HomepageLayout: React.FC<HomepageLayoutProps> = ({
  children,
  navigation,
}: HomepageLayoutProps): React.ReactElement<HomepageLayoutProps> => {
  return (
    <ScreenWrapper>
      {<TopNavBar navigation={navigation} />}
      {children}
    </ScreenWrapper>
  );
};

export default HomepageLayout;
