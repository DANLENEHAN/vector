// React imports
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {fontSizes} from '../../styles/main';
// Components
import Header from '../../components/navbar/Header';
import LineGraph from '../../components/graphs/LineGraph';
// Services
import {getUserStats} from '../../services/api/blueprints/stat/functions';
// Utils
import {convertStats} from '../../utils/conversion';
import {parse} from 'date-fns';
// Types
import {ScreenProps} from '../types';
import {StatType, WeightUnit} from '../../services/api/swagger/data-contracts';

type graphData = {
  date: number;
  value: Date;
};

const WeightProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<graphData[]>([]);

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

          const tempGraphData = [
            {created_at: '2023-01-01', value: 50},
            {created_at: '2023-01-02', value: 60},
            {created_at: '2023-01-03', value: 70},
            {created_at: '2023-01-04', value: 60},
            {created_at: '2023-01-05', value: 70},
            {created_at: '2023-01-06', value: 60},
          ];
          const graphData = tempGraphData.map(d => ({
            date: parse(d.created_at, 'yyyy-MM-dd', new Date()),
            value: d.value,
          })) as graphData[];
          console.log('Here: ', graphData);

          console.log('Here: ', graphData.length);
          setData(graphData);
        }
      };
      getUserWeights();
      return () => {
        // This is where you can return a function to be called when the component is unfocused or unmounted
        // For example, you might want to clear some state or unsubscribe from a service.
      };
    }, []),
    // Empty dependency array
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
        <View style={styles.chartContainer}>
          <View
            style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            {data && data.length > 0 && <LineGraph data={data} />}
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
});

export default WeightProgress;
