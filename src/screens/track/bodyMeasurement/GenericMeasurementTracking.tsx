// React imports
import React, {useState} from 'react';

// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

// Components
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

// Types
import {
  BodyStatType,
  WeightUnit,
  HeightUnit,
  MuscleMeasurementUnit,
  NutritionType,
  WaterUnit,
  CaloriesUnit,
  NutritionWeightUnit,
} from '@services/api/swagger/data-contracts';

// Constants
import {MeasureableBodyparts} from '@components/visualisations/BodyMap/Constants';
import {MeasurementConfig} from '@screens/track/bodyMeasurement/Constants';

// Logger
import logger from '@utils/Logger';

// Functions
import {createNewNutrition} from '@services/api/blueprints/nutrition/Functions';
import {createNewBodyStat} from '@services/api/blueprints/bodyStat/Functions';
import {capitalizeString} from '@shared/Functions';

export interface GenericMeasurementTrackingProps {
  statType: BodyStatType | NutritionType;
  statName: MeasureableBodyparts | 'Weight' | 'Height' | 'Water';
  onSuccessfulCreate: () => void;
}

const GenericMeasurementTracking: React.FC<GenericMeasurementTrackingProps> = ({
  statType,
  statName,
  onSuccessfulCreate,
}: GenericMeasurementTrackingProps): React.ReactElement<GenericMeasurementTrackingProps> => {
  const measurementConfig = MeasurementConfig[statType];
  const measurementUnit = Object.values(measurementConfig.measurementUnit);

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [measurementValue, setMeasurementValue] = useState('0');
  const [activeUnit, setActiveUnit] = useState<
    | MuscleMeasurementUnit
    | WeightUnit
    | HeightUnit
    | WaterUnit
    | CaloriesUnit
    | NutritionWeightUnit
  >(measurementUnit[0]);

  const handleSaveMeasurement = async () => {
    const parsedMeasurement = parseFloat(measurementValue);
    if (isNaN(parsedMeasurement) || parsedMeasurement <= 0) {
      logger.error(
        'Invalid measurement value. Please enter a valid measurement.',
      );
      return;
    }

    if (statType === BodyStatType.BodyMeasurement) {
      createNewBodyStat({
        value: parsedMeasurement,
        unitValue: activeUnit as
          | MuscleMeasurementUnit
          | WeightUnit
          | HeightUnit,
        onSuccessfulCreate: onSuccessfulCreate,
        statType: statType as BodyStatType,
      });
    } else {
      createNewNutrition({
        value: parsedMeasurement,
        unitValue: activeUnit as WaterUnit | CaloriesUnit | NutritionWeightUnit,
        onSuccessfulCreate: onSuccessfulCreate,
        statType: statType as NutritionType,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: currentTheme.text}]}>
          What is your {capitalizeString(statName)} measurement?
        </Text>
        <NumberInput
          style={styles.inputStyle}
          allowFloat={true}
          inputValue={measurementValue}
          setInputValue={setMeasurementValue}
        />
        <UnitSelector
          units={measurementUnit}
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
  );
};

const styles = StyleSheet.create({
  content: {
    height: '60%',
    width: '80%',
    ...layoutStyles.spaceBetweenVertical,
  },
  title: {
    ...headingTextStyles.small,
    textAlign: 'center',
  },
  inputStyle: {
    ...headingTextStyles.medium,
  },
  measureInstructions: {
    ...bodyTextStyles.small,
    textAlign: 'center',
  },
});

export default GenericMeasurementTracking;
