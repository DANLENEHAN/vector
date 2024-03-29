// React imports
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// Styles
import {layoutStyles} from '@styles/Main';

// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import BodyMap from '@components/visualisations/BodyMap/BodyMap';
import GenericMeasurementTracking from '@screens/track/GenericMeasurementTracking';
import Header from '@components/navbar/Header';

// Types
import {ScreenProps} from '@screens/Types';
import {BodyStatType} from '@services/api/swagger/data-contracts';

// Functions
import {transformsInternalNameToDisplay} from '@shared/Functions';

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
      <View style={styles.componentContainer}>
        {!selectedBodyPart ? (
          <BodyMap onBodyPartSelect={handleBodyPartSelect} />
        ) : (
          <GenericMeasurementTracking
            statType={selectedBodyPart}
            headingText={`Track Your Measurement For ${transformsInternalNameToDisplay(
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
  componentContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  bodyMapContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
});

export default BodyMeasurementTracking;
