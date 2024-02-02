// React imports
import React, {useState} from 'react';
// Components
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ButtonComponent from '@components/buttons/ButtonComponent';
import UnitSelector from '@components/buttons/UnitSelector';
import NumberInput from '@components/inputs/NumberInput';
import Header from '@components/navbar/Header';
// Types
import {ScreenProps} from '@screens/Types';
import {NutritionType, WaterUnit} from '@services/api/swagger/data-contracts';
// Styling
import {useSystem} from '@context/SystemContext';
import {lightThemeColors, darkThemeColors} from '@styles/Main';
import {marginSizes, fontSizes, fonts, fontWeights} from '@styles/Main';
// Services
import {createNewNutrition} from '@services/api/blueprints/nutrition/Functions';
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Logger
import logger from '@utils/Logger';

/**
 *  Water tracking screen
 *
 * @component WaterScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the water tracking screen component
 *
 * @example
 * <WaterScreen navigation={navigation}/>
 */
const WaterScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Variables to track the unit selection
  const [activeUnit, setActiveUnit] = useState<string>(WaterUnit.Ml);
  const [waterValue, setWaterValue] = useState<string>('0');

  const handleSavedWater = async () => {
    const parsedWater = parseFloat(waterValue);
    // Validation: Check if the weight is 0 or the string is empty
    if (isNaN(parsedWater) || parsedWater <= 0) {
      logger.error('Invalid water value. Please enter a valid water value.');
      return; // Stop the function if the weight is invalid
    }
    createNewNutrition({
      value: parsedWater,
      unit: activeUnit.toLowerCase() as WaterUnit,
      navigation: navigation,
      type: NutritionType.Water,
    });
  };

  return (
    <ScreenWrapper>
      <Header
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.title,
              {
                color: currentTheme.text,
              },
            ]}>
            Hydration is key!
          </Text>
          <Icon
            style={styles.waterIcon}
            name={'glass-water'}
            solid
            size={250}
            color={currentTheme.primary}
          />
          <NumberInput
            style={styles.numberInput}
            allowFloat={false}
            inputValue={waterValue}
            setInputValue={setWaterValue}
          />
          <UnitSelector
            style={styles.unitSelector}
            units={Object.values(WaterUnit)}
            activeUnit={activeUnit}
            setActiveUnit={setActiveUnit}
          />
          <ButtonComponent
            text="Track"
            disabled={waterValue === '0' || waterValue === ''}
            onPress={handleSavedWater}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flex: 1,
    marginTop: marginSizes.large,
  },
  contentSection: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: marginSizes.xxLarge,
  },
  waterIcon: {
    marginBottom: marginSizes.medium,
  },
  numberInput: {
    marginBottom: marginSizes.medium,
  },
  unitSelector: {
    marginBottom: marginSizes.xxLarge,
  },
});

export default WaterScreen;
