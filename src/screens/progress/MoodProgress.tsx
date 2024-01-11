// React imports
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
} from '../../styles/main';
// Components
import Header from '../../components/navbar/Header';
import {BarChart} from 'react-native-gifted-charts';
import UnitSelector from '../../components/buttons/UnitSelector';
// Services
import {getUserStats} from '../../services/api/blueprints/stat/functions';
import {useSystem} from '../../context/SystemContext';
// Types
import {ScreenProps} from '../types';
import {StatType} from '../../services/api/swagger/data-contracts';

const MoodProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [setData] = useState<any>({});
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const dateOptions = ['D', 'W', 'M', '6M', 'Y'];
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);

  const fakeData = [
    {value: 4, label: '1 Jan'},
    {value: 3, label: '2 Jan'},
    {value: 3, label: '3 Jan'},
    {value: 2, label: '4 Jan'},
    {value: 1, label: '5 Jan'},
    {value: 3, label: '6 Jan'},
  ];

  const moodValues = {
    0: 'Awful',
    1: 'Bad',
    2: 'Neutral',
    3: 'Okay',
    4: 'Good',
  };

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
          style={{
            height: 25,
            width: '90%',
            color: currentTheme.text,
            marginTop: margins.xSmall,
            marginBottom: margins.medium,
          }}
        />

        <View style={styles.chartContainer}>
          <BarChart
            data={fakeData}
            formatYLabel={yValue => moodValues[yValue]}
            width={300}
            roundedBottom
            roundedTop
            noOfSections={5}
            maxValue={4}
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
});

export default MoodProgress;
