// React imports
import React, {useState} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  layoutStyles,
  headingTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import Header from '@components/navbar/Header';
import UnitSelector from '@components/buttons/UnitSelector';
import NumberInput from '@components/inputs/NumberInput';
import ButtonComponent from '@components/buttons/ButtonComponent';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// Services
import {createNewBodyStat} from '@services/api/blueprints/bodyStat/Functions';
// Types
import {
  BodyStatType,
  WeightUnit,
  HeightUnit,
  MuscleMeasurementUnit,
} from '@services/api/swagger/data-contracts';
// Constants
import {MeasureableBodyparts} from '@components/visualisations/BodyMap/Constants';
import {
  BodyMeasurementConfig,
  MuscleToConfig,
} from '@screens/track/bodyMeasurement/Constants';
// Logger
import logger from '@utils/Logger';

export interface GenericMeasurementTrackingProps {
  bodyStatType: BodyStatType;
  bodyPart: MeasureableBodyparts | null;
  headerArrowOnClick: () => void;
}

const GenericMeasurementTracking: React.FC<GenericMeasurementTrackingProps> = ({
  bodyStatType,
  bodyPart,
  headerArrowOnClick,
}: GenericMeasurementTrackingProps): React.ReactElement<GenericMeasurementTrackingProps> => {
  const config = BodyMeasurementConfig[bodyStatType];
  const muscleConfig = bodyPart != null ? MuscleToConfig[bodyPart] : null;

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [measurementValue, setMeasurementValue] = useState('0');
  const [activeUnit, setActiveUnit] = useState<string>(
    Object.values(config.measurementUnit)[0],
  );

  const handleSaveMeasurement = async () => {
    const parsedMeasurement = parseFloat(measurementValue);
    if (isNaN(parsedMeasurement) || parsedMeasurement <= 0) {
      logger.error(
        'Invalid measurement value. Please enter a valid measurement.',
      );
      return;
    }
    createNewBodyStat({
      value: parsedMeasurement,
      unitValue: activeUnit.toLowerCase() as
        | MuscleMeasurementUnit
        | WeightUnit
        | HeightUnit,
      onSuccessfulCreate: headerArrowOnClick,
      bodyStatType: config.bodyStatType,
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header onClick={headerArrowOnClick} includeBackArrow={true} />
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          <Text>{muscleConfig?.howToMeasure}</Text>
          <Text style={[styles.title, {color: currentTheme.text}]}>
            What is your {bodyPart} measurement?
          </Text>
          <NumberInput
            allowFloat={true}
            inputValue={measurementValue}
            setInputValue={setMeasurementValue}
          />
          <UnitSelector
            units={Object.values(config.measurementUnit)}
            activeUnit={activeUnit}
            setActiveUnit={setActiveUnit}
          />
          <ButtonComponent
            text="Track"
            disabled={
              measurementValue === '0' ||
              measurementValue === '' ||
              measurementValue === '0.0'
            }
            onPress={handleSaveMeasurement}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flex: 1,
  },
  content: {
    flex: 9,
    ...layoutStyles.spaceAroundVertical,
  },
  title: {
    ...headingTextStyles.small,
    marginBottom: marginSizes.xxLarge,
  },
});

export default GenericMeasurementTracking;
