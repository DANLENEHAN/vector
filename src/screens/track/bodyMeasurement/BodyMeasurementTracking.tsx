// React imports
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// Styles
import {layoutStyles} from '@styles/Main';

// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import BodyMap from '@components/visualisations/BodyMap/BodyMapComponent';
import GenericMeasurementTracking from './GenericMeasurementTracking';

// Types
import {BodyStatType} from '@services/api/swagger/data-contracts';
import {MeasureableBodyparts} from '@components/visualisations/BodyMap/Constants';

const BodyMeasurementTracking: React.FC = (): React.ReactElement => {
  const [selectedBodyPart, setSelectedBodyPart] =
    useState<MeasureableBodyparts | null>(null);

  const handleBodyPartSelect = (bodyPart: MeasureableBodyparts) => {
    setSelectedBodyPart(bodyPart);
  };

  return (
    <ScreenWrapper>
      <View style={styles.componentContainer}>
        {!selectedBodyPart && (
          <View style={styles.bodyMapContainer}>
            <BodyMap onBodyPartSelect={handleBodyPartSelect} />
          </View>
        )}
        {selectedBodyPart && (
          <GenericMeasurementTracking
            bodyStatType={BodyStatType.BodyMeasurement}
            headerArrowOnClick={() => setSelectedBodyPart(null)}
            bodyPart={selectedBodyPart}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  bodyMapContainer: {
    flex: 0.8,
    ...layoutStyles.centerVertically,
  },
});

export default BodyMeasurementTracking;
