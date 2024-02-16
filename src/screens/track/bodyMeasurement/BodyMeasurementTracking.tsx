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
import {ScreenProps} from '@screens/Types';
import {MeasureableBodyparts} from '@components/visualisations/BodyMap/Constants';

const BodyMeasurementTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
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
            navigation={navigation}
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
    ...layoutStyles.spaceBetweenVertical,
    backgroundColor: 'blue',
  },
  bodyMapContainer: {
    flex: 9,
    ...layoutStyles.centerVertically,
    backgroundColor: 'green',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'orange',
  },
});

export default BodyMeasurementTracking;
