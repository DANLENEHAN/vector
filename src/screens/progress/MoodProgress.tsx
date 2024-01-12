// React imports
import React, {useState, useEffect} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
} from '@styles/main';
// Components
import {View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import LineGraph from '@components/graphs/Line/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
// Services
import {getUserStats} from '@services/api/blueprints/stat/functions';
import {useSystem} from '@context/SystemContext';
// Types
import {ScreenProps} from '@screens/types';
import {StatType} from '@services/api/swagger/data-contracts';

/**
 *  Weight progress screen
 *
 * @component WeightProgress
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the weight progress screen component
 *
 * @example
 * <WeightProgress navigation={navigation}/>
 */
const MoodProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [setData] = useState<any>({});
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const dateOptions = ['D', 'W', 'M', '6M', 'Y'];
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);

  const fakeData = [
    {value: 4, date: new Date('2021-01-01').valueOf()},
    {value: 3, date: new Date('2021-01-02').valueOf()},
    {value: 3, date: new Date('2021-01-03').valueOf()},
    {value: 2, date: new Date('2021-01-04').valueOf()},
    {value: 1, date: new Date('2021-01-05').valueOf()},
    {value: 3, date: new Date('2021-01-06').valueOf()},
  ];

  useEffect(() => {
    const getUserMoods = async () => {
      let user_mood = await getUserStats({statType: StatType.Feeling});

      setData(user_mood ?? []);
    };
    getUserMoods();
  });

  return (
    <ScreenWrapper>
      <Header
        label="Mood"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.content}>
        <UnitSelector
          units={Object.values(dateOptions)}
          activeUnit={activePeriod}
          setActiveUnit={setActivePeriod}
          style={[
            styles.unitSelector,
            {
              color: currentTheme.text,
            },
          ]}
        />

        <View style={styles.chartContainer}>
          <LineGraph
            data={fakeData}
            averageLabel={'test'}
            averageValue={5}
            unit={''}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 300,
  },
  unitSelector: {
    height: 25,
    width: '90%',
    marginTop: margins.xSmall,
    marginBottom: margins.medium,
  },
});

export default MoodProgress;
