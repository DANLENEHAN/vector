// React imports
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// Styles
import {layoutStyles} from '@styles/Main';

// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import BodyMap from '@components/visualisations/BodyMap/BodyMapComponent';
import GenericMeasurementTracking from './GenericMeasurementTracking';
import Header from '@components/navbar/Header';

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
      <View style={styles.headerSection}>
        <Header
          onClick={() => {
            if (selectedBodyPart) {
              setSelectedBodyPart(null);
            } else {
              navigation.goBack();
            }
          }}
          includeBackArrow={true}
        />
      </View>
      <View style={styles.componentContainer}>
        {!selectedBodyPart && (
          <View style={styles.bodyMapContainer}>
            <BodyMap onBodyPartSelect={handleBodyPartSelect} />
          </View>
        )}
        {selectedBodyPart && (
          <GenericMeasurementTracking
            statType={BodyStatType.BodyMeasurement}
            onSuccessfulCreate={() => setSelectedBodyPart(null)}
            statName={selectedBodyPart}
          />
        )}
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
  bodyMapContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
});

export default BodyMeasurementTracking;
