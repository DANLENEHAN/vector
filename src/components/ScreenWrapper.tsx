import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';

interface ScreenWrapperProps {
  children: ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({children}) => {
  return <View style={styles.screenWrapper}>{children}</View>;
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenWrapper;
