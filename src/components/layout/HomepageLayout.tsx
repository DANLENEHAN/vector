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

interface HomepageLayoutProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList & HomeParamList>;
}

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
