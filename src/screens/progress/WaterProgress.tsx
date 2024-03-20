// React imports
import React, {useState, useEffect} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  marginSizes,
} from '@styles/Main';
// Components
import {View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import Graph from '@components/visualisations/graphs/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
// Services
import {useSystem} from '@context/SystemContext';
import {getNutritionGraphData} from '@services/api/blueprints/nutrition/Functions';
// Types
import {ScreenProps} from '@screens/Types';
import {NutritionType, WaterUnit} from '@services/api/swagger/data-contracts';
import {graphPeriodData} from '@services/timeSeries/Types';
import {timePeriods} from '@services/timeSeries/Types';
import {timePeriodLabels, statisticType} from '@services/timeSeries/Types';
// Constants
import {loadingGraphPeriodData} from '@services/timeSeries/Constants';

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

  const graphStatType = statisticType.sum;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setGraphData(loadingGraphPeriodData);
      const data = await getNutritionGraphData(
        NutritionType.Water,
        WaterUnit.Ml,
        graphStatType,
      );
      setGraphData(data);
      setLoading(false);
    };
    fetchData();
  }, [graphStatType]);

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper}>
        <Header
          label="Water"
          onClick={navigation.goBack}
          includeBackArrow={true}
        />
        <View style={styles.unitSelectorSection}>
          <UnitSelector
            units={Object.values(dateOptions)}
            activeUnit={activePeriod}
            setActiveUnit={setActivePeriod}
            style={[
              styles.periodSelector,
              {
                color: currentTheme.text,
              },
            ]}
          />
        </View>
        <View>
          {graphData &&
            activePeriod &&
            timePeriodLabels[activePeriod as timePeriods] &&
            graphData[timePeriodLabels[activePeriod as timePeriods]] && (
              <Graph
                data={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].data
                }
                displayLabel={
                  graphData[timePeriodLabels[activePeriod as timePeriods]]
                    .periodLabel || ''
                }
                displayValue={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].value
                }
                unit={
                  graphData[timePeriodLabels[activePeriod as timePeriods]].unit
                }
                minYValue={0}
                chartType="line"
                showUnit={true}
                loading={loading}
                statisticType={graphStatType}
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
  unitSelectorSection: {
    ...layoutStyles.centerHorizontally,
  },
  periodSelector: {
    height: 30,
    marginVertical: marginSizes.medium,
  },
});

export default MoodProgress;
