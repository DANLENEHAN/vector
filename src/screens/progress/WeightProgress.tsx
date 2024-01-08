// React imports
import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  fontWeights,
  lightThemeColors,
  darkThemeColors,
  margins,
} from '../../styles/main';
// Components
import Header from '../../components/navbar/Header';
import LineGraph from '../../components/graphs/LineGraph';
import UnitSelector from '../../components/buttons/UnitSelector';
// Services
import {getUserStats} from '../../services/api/blueprints/stat/functions';
import {useTheme} from '../../context/ThemeContext';
// Utils
import {convertStats} from '../../utils/conversion';
import {parse} from 'date-fns';
// Types
import {ScreenProps} from '../types';
import {StatType, WeightUnit} from '../../services/api/swagger/data-contracts';

const WeightProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<any>([]);
  const {theme} = useTheme();

  const dateOptions = ['D', 'W', 'M', '6M', 'Y'];
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);

  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  useFocusEffect(
    React.useCallback(() => {
      const getUserWeights = async () => {
        // NOTE: This is a temporary solution until we have a user profile page
        const weightUnitPref = WeightUnit.Kg;
        let user_weights = await getUserStats({statType: StatType.Weight});
        if (user_weights == null) {
          console.log('No user weights found');
        }
        user_weights = convertStats({
          stats: user_weights,
          targetUnit: weightUnitPref,
        });
        // Inside your useEffect
        if (user_weights) {
          // const graphData = user_weights.map(d => ({
          //   date: new Date(d.created_at).valueOf(),
          //   value: d.value,
          // })) as graphData[];
          const tempData = [
            {date: parse('2023-01-01', 'yyyy-MM-dd', new Date()), value: 70},
            {date: parse('2023-01-02', 'yyyy-MM-dd', new Date()), value: 71},
            {date: parse('2023-01-03', 'yyyy-MM-dd', new Date()), value: 70},
            {date: parse('2023-01-04', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-05', 'yyyy-MM-dd', new Date()), value: 70},
            {date: parse('2023-01-06', 'yyyy-MM-dd', new Date()), value: 65},
            {date: parse('2023-01-07', 'yyyy-MM-dd', new Date()), value: 64},
            {date: parse('2023-01-08', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-09', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-10', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-11', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-12', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-13', 'yyyy-MM-dd', new Date()), value: null},
            {date: parse('2023-01-14', 'yyyy-MM-dd', new Date()), value: 80},
          ];

          const graphData = {
            D: [
              {date: parse('2023-01-01', 'yyyy-MM-dd', new Date()), value: 70},
              {date: parse('2023-01-02', 'yyyy-MM-dd', new Date()), value: 71},
              {date: parse('2023-01-03', 'yyyy-MM-dd', new Date()), value: 70},
              {
                date: parse('2023-01-04', 'yyyy-MM-dd', new Date()),
                value: null,
              },
              {date: parse('2023-01-05', 'yyyy-MM-dd', new Date()), value: 70},
              {date: parse('2023-01-06', 'yyyy-MM-dd', new Date()), value: 65},
            ],
            W: tempData,
            M: tempData,
            '6M': tempData,
            Y: tempData,
          };
          setData(graphData);
        }
      };
      getUserWeights();
      return () => {
        // This is where you can return a function to be called when the component is unfocused or unmounted
        // For example, you might want to clear some state or unsubscribe from a service.
      };
    }, []),
  );

  return (
    <ScreenWrapper>
      <Header
        label="Weight"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />

      <View style={styles.content}>
        <View style={styles.averageWeightContainer}>
          <Text
            style={[
              styles.averageWeightLabel,
              {color: currentTheme.lightText, marginBottom: margins.xSmall},
            ]}>
            Average:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: margins.xSmall,
            }}>
            <Text
              style={[styles.averageWeightValue, {color: currentTheme.text}]}>
              87.65
            </Text>
            <Text
              style={[
                styles.averageWeightLabel,
                {color: currentTheme.lightText, fontSize: fontSizes.large},
              ]}>
              {' '}
              Kg
            </Text>
          </View>
          <Text
            style={[
              styles.averageWeightLabel,
              {color: currentTheme.lightText},
            ]}>
            1 Jan - 6 Jan 2024
          </Text>
        </View>
        <UnitSelector
          units={Object.values(dateOptions)}
          activeUnit={activePeriod}
          setActiveUnit={setActivePeriod}
          style={{
            height: 25,
            width: '90%',
            color: currentTheme.text,
            marginTop: margins.xSmall,
            marginBottom: margins.xSmall,
          }}
        />
        <View style={styles.chartContainer}>
          <View
            style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            {data && activePeriod && data[activePeriod] && (
              <LineGraph data={data[activePeriod]} />
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  chartContainer: {
    width: '100%',
    height: 300,
  },
  averageWeightContainer: {
    width: '90%',
    height: 100,
    //backgroundColor: 'red',
  },
  averageWeightLabel: {
    fontSize: fontSizes.medium,
  },
  averageWeightValue: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.extraBold,
    color: 'black',
  },
});

export default WeightProgress;
