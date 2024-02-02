// React imports
import React, {useState} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  fontWeights,
  marginSizes,
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
import {createNewStat} from '@services/api/blueprints/bodyStat/Functions';
// Types
import {BodyStatType, WeightUnit} from '@services/api/swagger/data-contracts';
import {ScreenProps} from '@screens/Types';
// Logger
import logger from '@utils/Logger';

/**
 *  Weight tracking screen
 *
 * @component WeightTracking
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the weight tracking screen component
 *
 * @example
 * <WeightTracking navigation={navigation}/>
 */
const WeightTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Variables to track the weight input
  const allowFloatingNumbers = true;
  const [weightValue, setWeightValue] = useState(
    allowFloatingNumbers ? '0.0' : '0',
  );
  // Variables to track the unit selection
  const [activeUnit, setActiveUnit] = useState<string>(WeightUnit.Kg);

  // Function to handle the tracking of the weight
  const handleSaveWeight = async () => {
    const parsedWeight = parseFloat(weightValue);
    // Validation: Check if the weight is 0 or the string is empty
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      logger.error('Invalid weight value. Please enter a valid weight.');
      return; // Stop the function if the weight is invalid
    }
    createNewStat({
      value: parsedWeight,
      unitValue: activeUnit.toLowerCase() as WeightUnit,
      navigation: navigation,
      bodyStatType: BodyStatType.Weight,
    });
  };

  return (
    <ScreenWrapper>
      <Header navigation={navigation} includeBackArrow={true} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {color: currentTheme.text}]}>
              What is your current weight?
            </Text>
          </View>

          <View style={styles.trackContainer}>
            <NumberInput
              style={styles.numberInput}
              allowFloat={true}
              inputValue={weightValue}
              setInputValue={setWeightValue}
            />
            <UnitSelector
              units={Object.values(WeightUnit)}
              activeUnit={activeUnit}
              setActiveUnit={setActiveUnit}
            />
            <ButtonComponent
              text="Track"
              disabled={
                weightValue === '0' ||
                weightValue === '' ||
                weightValue === '0.0'
              }
              onPress={handleSaveWeight}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
  },
  titleContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackContainer: {
    flex: 8,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  numberInput: {
    margin: marginSizes.small,
  },
});

export default WeightTracking;
