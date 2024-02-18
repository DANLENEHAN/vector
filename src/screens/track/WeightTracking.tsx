// React imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
// Components
import Header from '@components/navbar/Header';
import GenericMeasurementTracking from '@screens/track/bodyMeasurement/GenericMeasurementTracking';

// Types
import {ScreenProps} from '@screens/Types';
import {BodyStatType} from '@services/api/swagger/data-contracts';
// Styling
import {layoutStyles} from '@styles/Main';
// Services
import ScreenWrapper from '@components/layout/ScreenWrapper';

/**
 *  Weight tracking screen
 *
 * @component WeightTracking
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the weight tracking screen component
 */
const WeightTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header onClick={navigation.goBack} includeBackArrow={true} />
      </View>
      <View style={styles.componentContainer}>
        <GenericMeasurementTracking
          statType={BodyStatType.Weight}
          onSuccessfulCreate={navigation.goBack}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flex: 1,
  },
  componentContainer: {
    flex: 15,
    ...layoutStyles.centerVertically,
  },
});

export default WeightTracking;
