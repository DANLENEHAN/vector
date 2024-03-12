// React imports
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// Components
import Header from '@components/navbar/Header';
import NumberInput from '@components/inputs/NumberInput';
import UnitSelector from '@components/buttons/UnitSelector';
import ButtonComponent from '@components/buttons/ButtonComponent';
// Types
import {ScreenProps} from '@screens/Types';
import {BodyStatType} from '@services/api/swagger/data-contracts';
// Styling
import {layoutStyles} from '@styles/Main';
// Services
import ScreenWrapper from '@components/layout/ScreenWrapper';
import {
  darkThemeColors,
  lightThemeColors,
  headingTextStyles,
  paddingSizes,
  marginSizes,
  bodyTextStyles,
} from '@styles/Main';
import {useState} from 'react';
import {MeasurementConfig} from '@screens/track/bodyMeasurement/Constants';
import {createNewBodyStat} from '@services/api/blueprints/bodyStat/Functions';
import {useSystem} from '@context/SystemContext';
import {convertValue} from '@utils/Conversion';
// Constants
import {maxWeighValues} from '@shared/Constants';
import {WeightUnit} from '@services/api/swagger/data-contracts';
// Logger
import logger from '@utils/Logger';

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
  const testID = 'WeightTracking';

  const measurementUnit = Object.values(MeasurementConfig[BodyStatType.Weight]);

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  // Measurement values for the input fields
  const [measurementValueA, setMeasurementValueA] = useState(0);
  const [measurementValueB, setMeasurementValueB] = useState(0);
  // Display values for the input fields
  const [displayValueA, setDisplayValueA] = useState('0');
  const [displayValueB, setDisplayValueB] = useState('0');
  // Wether max value is reached
  const [errorMessage, setErrorMessage] = useState('');
  const maxValueReached = errorMessage !== '';

  const [changingUnit, setChangingUnit] = useState(false);

  const [activeUnit, setActiveUnit] = useState<WeightUnit>(measurementUnit[0]);
  const [isSingleInput, setIsSingleInput] = useState<boolean>(true);

  const checkMaxValue = (
    valueA: number = measurementValueA,
    valueB: number = measurementValueB,
  ) => {
    let totalValue;
    if (activeUnit === WeightUnit.Stone) {
      totalValue = valueA + valueB / 14;
    } else {
      totalValue = valueA;
    }
    if (totalValue > maxWeighValues[activeUnit]) {
      setErrorMessage('Max value reached');
    } else {
      setErrorMessage('');
    }
  };

  const handleValueAChange = (value: string) => {
    let parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      parsedValue = 0;
    }
    setDisplayValueA(value);
    setMeasurementValueA(parsedValue);

    checkMaxValue(parsedValue, measurementValueB);
    return value;
  };
  const handleValueBChange = (value: string) => {
    let parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      parsedValue = 0;
    }
    setDisplayValueB(value);
    setMeasurementValueB(parsedValue);
    checkMaxValue(measurementValueA, parsedValue);
    return value;
  };

  const handleUnitChange = (unit: WeightUnit) => {
    setChangingUnit(true);
    if (activeUnit === unit) {
      setChangingUnit(false);
      return;
    }
    // Default to single input for most conversions
    const isStoneUnit = unit === WeightUnit.Stone;
    setIsSingleInput(!isStoneUnit);
    let convertedMeasurement;
    if (activeUnit !== WeightUnit.Stone) {
      // Convert the measurement to the new unit
      // Parse current measurement value as float
      convertedMeasurement = convertValue({
        value: measurementValueA,
        fromUnit: activeUnit,
        toUnit: unit,
      });
    } else {
      // For Stone, convert the stone and pound values to the new unit
      convertedMeasurement = convertValue({
        value: measurementValueA + measurementValueB / 14,
        fromUnit: activeUnit,
        toUnit: unit,
      });
    }

    if (isNaN(convertedMeasurement)) {
      logger.error(
        `Invalid measurement value. Could not convert to ${unit}. (resetting to 0)`,
      );
      convertedMeasurement = 0;
    }

    // Update measurement value, handle special case for Stone unit
    if (!isStoneUnit) {
      // Convert to string and limit precision for non-Stone units
      setMeasurementValueA(convertedMeasurement);
      setMeasurementValueB(0);
      setDisplayValueA(convertedMeasurement.toFixed(2));
      setDisplayValueB('0');
    } else {
      // For Stone, split the value into stone and pounds
      // and update both input fields
      const stoneValue = Math.floor(convertedMeasurement);
      const poundValue = (convertedMeasurement - stoneValue) * 14;
      setMeasurementValueA(stoneValue);
      setMeasurementValueB(poundValue);
      setDisplayValueA(stoneValue.toString());
      setDisplayValueB(poundValue.toFixed(2));
    }

    // Update past and active units
    setActiveUnit(unit);
    setChangingUnit(false);
  };

  const handleSaveMeasurement = async () => {
    let parsedMeasurement;
    if (isSingleInput) {
      parsedMeasurement = measurementValueA;
    } else {
      // Convert stone and pounds to a single value
      parsedMeasurement = measurementValueA + measurementValueB / 14;
    }
    if (isNaN(parsedMeasurement) || parsedMeasurement <= 0) {
      logger.error(
        'Invalid measurement value. Please enter a valid measurement.',
      );
      return;
    }
    createNewBodyStat({
      value: parsedMeasurement,
      unitValue: activeUnit,
      onSuccessfulCreate: navigation.goBack,
      statType: BodyStatType.Weight,
    });
  };

  return (
    <ScreenWrapper>
      <Header onClick={navigation.goBack} includeBackArrow={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.componentContainer} testID={testID}>
          <View style={styles.content}>
            <Text style={[styles.title, {color: currentTheme.text}]}>
              Track your weight update!
            </Text>

            <View style={[layoutStyles.spaceAroundHorizontal]}>
              {!isSingleInput ? (
                <>
                  <NumberInput
                    style={[
                      styles.inputStyle,
                      {
                        maxWidth: '30%',
                        minWidth: '10%',
                        textAlign: 'center',
                        marginRight: marginSizes.xSmall,
                      },
                    ]}
                    allowFloat={isSingleInput}
                    inputValue={displayValueA}
                    setInputValue={handleValueAChange}
                  />
                  <Text
                    testID={`${testID}_unit_a`}
                    style={[
                      styles.unitText,
                      {
                        color: currentTheme.lightText,
                        marginRight: marginSizes.medium,
                      },
                    ]}>
                    st
                  </Text>
                  <NumberInput
                    style={[styles.inputStyle, styles.multiNumberInput]}
                    allowFloat={true}
                    inputValue={displayValueB}
                    setInputValue={handleValueBChange}
                  />
                  <Text
                    testID={`${testID}_unit_b`}
                    style={[styles.unitText, {color: currentTheme.lightText}]}>
                    lbs
                  </Text>
                </>
              ) : (
                <NumberInput
                  style={[styles.inputStyle, styles.singleNumberInput]}
                  allowFloat={isSingleInput}
                  inputValue={displayValueA}
                  setInputValue={handleValueAChange}
                />
              )}
            </View>

            <View>
              <Text style={[bodyTextStyles.small, {color: currentTheme.error}]}>
                {errorMessage}
              </Text>
            </View>
            <UnitSelector
              units={measurementUnit}
              activeUnit={activeUnit}
              setActiveUnit={handleUnitChange}
              disabled={changingUnit}
              style={styles.unitSelector}
            />
            <ButtonComponent
              text="Track"
              disabled={
                (measurementValueA === 0 && measurementValueB === 0) ||
                maxValueReached
              }
              onPress={handleSaveMeasurement}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  content: {
    height: '60%',
    ...layoutStyles.spaceBetweenVertical,
    paddingHorizontal: paddingSizes.large,
  },
  title: {
    ...headingTextStyles.small,
    textAlign: 'center',
  },
  unitText: {
    ...headingTextStyles.xSmall,
    textAlign: 'center',
  },
  inputStyle: {
    ...headingTextStyles.medium,
  },
  multiNumberInput: {
    maxWidth: '30%',
    minWidth: '10%',
    textAlign: 'center',
    marginRight: marginSizes.xSmall,
  },
  singleNumberInput: {
    maxWidth: '70%',
    minWidth: '10%',
    textAlign: 'center',
  },
  unitSelector: {
    height: 50,
  },
});

export default WeightTracking;
