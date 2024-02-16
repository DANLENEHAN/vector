// React imports
import React, {useState} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
// Components
import {View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import LineGraph from '@components/visualisations/graphs/Line/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
// Services
import {useSystem} from '@context/SystemContext';
// Types
import {ScreenProps} from '@screens/Types';
import {GraphPlotData} from '@components/visualisations/graphs/Line/Types';
import {WaterUnit} from '@services/api/swagger/data-contracts';

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

  const dateOptions = ['D', 'W', 'M', '6M', 'Y'];
  const [activePeriod, setActivePeriod] = useState<string>(dateOptions[0]);

  const graphData = new GraphPlotData(
    [
      {value: 4000, date: '2024-01-01T11:35:36.961Z'},
      {value: 3000, date: '2024-01-02T11:35:36.961Z'},
      {value: 3500, date: '2024-01-03T11:35:36.961Z'},
      {value: 2000, date: '2024-01-04T11:35:36.961Z'},
      {value: 1000, date: '2024-01-05T11:35:36.961Z'},
      {value: 3666, date: '2024-01-06T11:35:36.961Z'},
    ],
    WaterUnit.Ml,
  );

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper}>
        <View style={styles.headerSection}>
          <Header
            label="Water"
            navigation={navigation}
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
          <LineGraph
            data={graphData.graphData}
            averageLabel={graphData.averagePeriodLabel}
            averageValue={graphData.averageValue}
            unit={graphData.unit}
          />
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
