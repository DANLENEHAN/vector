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
import {ScreenProps} from '@screens/Types';
import {BodyStatType} from '@services/api/swagger/data-contracts';

// Functions
import {capitalizeString} from '@shared/Functions';

const BodyMeasurementTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyStatType | null>(
    null,
  );

  const handleBodyPartSelect = (bodyPart: BodyStatType) => {
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
            statType={selectedBodyPart}
            headingText={`Track a measurement for ${capitalizeString(
              selectedBodyPart,
            )}!`}
            onSuccessfulCreate={() => setSelectedBodyPart(null)}
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
