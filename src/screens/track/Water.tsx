import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome6';

// Components
import HeaderBackButton from '../../components/buttons/HeaderBackButton';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import UnitSelector from '../../components/buttons/UnitSelector';
import NumberInput from '../../components/inputs/NumberInput';

// Types
import {ScreenProps} from '../types';
import {StatType, WaterUnit} from '../../services/api/swagger/data-contracts';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {margins, fontSizes, fonts, fontWeights} from '../../styles/main';

// Services
import {createStat} from '../../services/api/blueprints/stat_api';
import {getUserDetails} from '../../services/api/blueprints/user_api';

const WaterScreen: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Variables to track the unit selection
  const [activeUnit, setActiveUnit] = useState<string>(WaterUnit.Ml);
  const [waterValue, setWaterValue] = useState<string>('0');

  const handleSavedWater = async () => {
    const parsedWater = parseFloat(waterValue);
    const user_details = await getUserDetails();
    if ('user_id' in user_details) {
      await createStat({
        unit: activeUnit.toLowerCase() as WaterUnit,
        stat_type: StatType.Water,
        user_id: user_details.user_id,
        value: parsedWater,
      });
      navigation.goBack();
    } else {
      console.error(`Error: ${user_details.message}`);
    }
  };

  return (
    <View style={[styles.page, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <HeaderBackButton navigation={navigation} />
      </View>
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
          disabled={waterValue === '0'}
          onPress={handleSavedWater}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  headerSection: {
    flex: 1,
    marginTop: margins.large,
  },
  contentSection: {
    flex: 9,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: margins.xxLarge,
  },
  waterIcon: {
    marginBottom: margins.medium,
  },
  numberInput: {
    marginBottom: margins.medium,
  },
  unitSelector: {
    marginBottom: margins.xxLarge,
  },
});

export default WaterScreen;
