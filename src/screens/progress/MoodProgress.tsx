// React imports
import React, {useEffect, useState} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
// Components
import {View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import Graph from '@components/visualisations/graphs/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
// Services
import {useSystem} from '@context/SystemContext';
import {getMoodData} from '@services/api/blueprints/mood/Functions';
// Types
import {ScreenProps} from '@screens/Types';
import {graphPeriodData} from '@services/timeSeries/Types';
import {timePeriodLabels, timePeriods} from '@services/timeSeries/Types';
import {defaultNullString} from '@services/timeSeries/Constants';
// Constants
import {loadingGraphPeriodData} from '@services/timeSeries/Constants';

// Give me typing for an object with keys of dateOptions and values of GraphPlotData
// I think that's what's happening here
// const graphData: {[key: string]: GraphPlotData} = {
/**
 *  Weight progress screen
 *
 * @component WeightProgress
 * @param {ScreenProps} navigation - Navigation object for the screen
 * @returns {React.FC} - Returns the weight progress screen component
 */
const MoodProgress: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const dateOptions = Object.keys(timePeriodLabels);
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);
  const [graphData, setGraphData] = useState<graphPeriodData>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setGraphData(loadingGraphPeriodData);
      const data = await getMoodData();
      setGraphData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper}>
        <View style={styles.headerSection}>
          <Header
            label="Mood"
            onClick={navigation.goBack}
            includeBackArrow={true}
          />
        </View>
        <View style={styles.unitSelectorSection}>
          <UnitSelector
            units={Object.values(dateOptions)}
            activeUnit={activePeriod}
            setActiveUnit={setActivePeriod}
            style={[
              {
                color: currentTheme.text,
              },
            ]}
          />
        </View>
        <View style={styles.graphSection}>
          {graphData &&
            activePeriod &&
            timePeriodLabels[activePeriod as timePeriods] &&
            graphData[timePeriodLabels[activePeriod as timePeriods]] && (
              <Graph
                data={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].data
                }
                averageLabel={
                  graphData[timePeriodLabels[activePeriod as timePeriods]]
                    .averagePeriodLabel || defaultNullString
                }
                averageValue={
                  graphData[timePeriodLabels[activePeriod as timePeriods]]
                    .averageValue
                }
                unit={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].unit
                }
                minYValue={0}
                maxYValue={6.1} // 6 is the max + 0.1 for padding
                chartType="bar"
                showUnit={false}
                loading={loading}
              />
            )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
  },
  headerSection: {
    flex: 1,
  },
  unitSelectorSection: {
    flex: 2,
    ...layoutStyles.centerHorizontally,
  },
  graphSection: {
    flex: 10,
  },
});

export default MoodProgress;
