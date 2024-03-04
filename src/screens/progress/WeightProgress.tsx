// React imports
import React, {useState, useEffect} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
// Components
import Header from '@components/navbar/Header';
import Graph from '@components/visualisations/graphs/Line/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
import {View, StyleSheet} from 'react-native';
// Services
import {useSystem} from '@context/SystemContext';
import {getBodyStatGraphData} from '@services/api/blueprints/bodyStat/Functions';
// Types
import {ScreenProps} from '@screens/Types';
import {BodyStatType, WeightUnit} from '@services/api/swagger/data-contracts';
import {graphPeriodData} from '@services/timeSeries/Types';
import {timePeriods} from '@services/timeSeries/Types';
// Constants
import {timePeriodLabels} from '@services/timeSeries/Types';

/**
 *  Weight progress screen
 *
 * @component WeightProgress
 * @param {ScreenProps} navigation - Navigation object for the screen
 * @returns {React.FC} - Returns the weight progress screen component
 */
const WeightProgress: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const dateOptions = Object.keys(timePeriodLabels);
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);
  const [graphData, setGraphData] = useState<graphPeriodData>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBodyStatGraphData(
        BodyStatType.Weight,
        WeightUnit.Kg,
      );
      setGraphData(data);
    };
    fetchData();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper}>
        <View style={styles.headerSection}>
          <Header
            label="Weight"
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
                    .averagePeriodLabel || ''
                }
                averageValue={
                  graphData[timePeriodLabels[activePeriod as timePeriods]]
                    .averageValue
                }
                unit={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].unit
                }
                minYValue={0}
                chartType="line"
                showUnit={true}
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

export default WeightProgress;
