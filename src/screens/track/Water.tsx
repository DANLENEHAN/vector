// React imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
// Components
import Header from '@components/navbar/Header';
import GenericMeasurementTracking from '@screens/track/GenericMeasurementTracking';

// Types
import {ScreenProps} from '@screens/Types';
import {NutritionType} from '@services/api/swagger/data-contracts';
// Styling
import {layoutStyles} from '@styles/Main';
// Services
import ScreenWrapper from '@components/layout/ScreenWrapper';

/**
 *  Water tracking screen
 *
 * @component WaterScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the water tracking screen component
 */
const WaterScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  return (
    <ScreenWrapper>
      <Header onClick={navigation.goBack} />
      <View style={styles.componentContainer}>
        <GenericMeasurementTracking
          statType={NutritionType.Water}
          headingText="Track Your Water Intake!"
          onSuccessfulCreate={navigation.goBack}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
});

export default WaterScreen;
