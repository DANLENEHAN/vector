// React imports
import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  fontWeights,
  margins,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
// Components
import Header from '../../components/navbar/Header';
import UnitSelector from '../../components/buttons/UnitSelector';
import NumberInput from '../../components/inputs/NumberInput';
import ButtonComponent from '../../components/buttons/ButtonComponent';
// Services
import {createStat} from '../../services/api/blueprints/stat_api';
import {getUserDetails} from '../../services/api/blueprints/user_api';
// Types
import {StatType, WeightUnit} from '../../services/api/swagger/data-contracts';
import {ScreenProps} from '../types';

const WeightTracking: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Variables to track the weight input
  const allowFloatingNumbers = true;
  const [weightValue, setWeightValue] = useState(
    allowFloatingNumbers ? '0.0' : '0',
  );
  // Variables to track the unit selection
  const [activeUnit, setActiveUnit] = useState<string>(WeightUnit.KG);

  // Function to handle the tracking of the weight
  const handleSaveWeight = async () => {
    console.log('Saving weight...');
    const parsedWeight = parseFloat(weightValue);
    console.log('Parsed weight: ', parsedWeight);
    // Validation: Check if the weight is 0 or the string is empty
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      console.log('Invalid weight value. Please enter a valid weight.');
      return; // Stop the function if the weight is invalid
    }

    try {
      const user = await getUserDetails();
      await createStat({
        unit: activeUnit.toLowerCase(),
        stat_type: StatType.Weight,
        user_id: user.user_id,
        value: parsedWeight,
      });
      console.log('Successfully saved weight (', parsedWeight, activeUnit, ')');
      navigation.goBack();
    } catch (error) {
      console.log("Couldn't save weight", error);
    }
  };

  return (
    <ScreenWrapper>
      <Header
        label=""
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
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
            disabled={false}
            onPress={handleSaveWeight}
          />
        </View>
      </View>
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
    margin: margins.small,
  },
});

export default WeightTracking;