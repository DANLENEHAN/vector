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
 * Weight tracking screen component
 * Provides UI for tracking weight updates.
 *
 * @param {ScreenProps} props - Props containing the navigation object for screen navigation
 * @returns {React.FC<ScreenProps>} The weight tracking screen component
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
          headingText="Track Your Weight Update!"
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
