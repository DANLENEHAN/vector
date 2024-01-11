// React imports
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
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
import LineGraph from '../../components/graphs/Line/Graph';
import UnitSelector from '../../components/buttons/UnitSelector';
// Services
import {getUserStats} from '../../services/api/blueprints/stat/functions';
import {useSystem} from '../../context/SystemContext';
// Utils
import {convertStats} from '../../utils/conversion';
import {parse} from 'date-fns';
// Types
import {ScreenProps} from '../types';
import {StatType, WeightUnit} from '../../services/api/swagger/data-contracts';
import {GraphPlotData} from '../../components/graphs/Line/types';

const WeightProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<any>({});
  const {theme} = useSystem();

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
          const tempData = new GraphPlotData(
            [
              {
                date: parse('2023-01-01', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 70,
              },
              {
                date: parse('2023-01-02', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 71,
              },
              {
                date: parse('2023-01-03', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 70,
              },
              {
                date: parse('2023-01-04', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-05', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 70,
              },
              {
                date: parse('2023-01-06', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 65,
              },
              {
                date: parse('2023-01-07', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 64,
              },
              {
                date: parse('2023-01-08', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-09', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-10', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-11', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-12', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-13', 'yyyy-MM-dd', new Date()).valueOf(),
                value: null,
              },
              {
                date: parse('2023-01-14', 'yyyy-MM-dd', new Date()).valueOf(),
                value: 80,
              },
            ],
            weightUnitPref,
          );

          const graphData = {
            D: new GraphPlotData(
              [
                {
                  date: parse('2023-01-01', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 70,
                },
                {
                  date: parse('2023-01-02', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 71,
                },
                {
                  date: parse('2023-01-03', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 70,
                },
                {
                  date: parse('2023-01-04', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 50,
                },
                {
                  date: parse('2023-01-05', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 70,
                },
                {
                  date: parse('2023-01-06', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: 65,
                },
              ],
              weightUnitPref,
            ),
            W: new GraphPlotData(
              [
                {
                  date: parse('2023-01-01', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: null,
                },
                {
                  date: parse('2023-01-02', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: null,
                },
                {
                  date: parse('2023-01-03', 'yyyy-MM-dd', new Date()).valueOf(),
                  value: null,
                },
              ],
              weightUnitPref,
            ),
            M: tempData,
            '6M': tempData,
            Y: tempData,
          };
          setData(graphData);
        }
      };
      getUserWeights();
      return () => {};
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

        <View style={styles.chartContainerContainer}>
          <View style={styles.chartContainer}>
            {data && activePeriod && data[activePeriod] && (
              <LineGraph
                data={data[activePeriod].data}
                averageLabel={data[activePeriod].averagePeriodLabel}
                averageValue={data[activePeriod].averageValue}
                unit={data[activePeriod].unit}
              />
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
  chartContainerContainer: {
    width: '100%',
    height: 300,
  },
  chartContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  unitSelector: {
    height: 25,
    width: '90%',
    marginTop: margins.xSmall,
    marginBottom: margins.medium,
  },
});

export default WeightProgress;
