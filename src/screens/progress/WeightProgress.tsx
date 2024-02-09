// React imports
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
// Components
import Header from '@components/navbar/Header';
import LineGraph from '@components/graphs/Line/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
import {View, StyleSheet} from 'react-native';
// Services
import {getUserStats} from '@services/api/blueprints/bodyStat/Functions';
import {useSystem} from '@context/SystemContext';
// Utils
import {convertStats} from '@utils/Conversion';
// Types
import {ScreenProps} from '@screens/Types';
import {BodyStatType, WeightUnit} from '@services/api/swagger/data-contracts';
import {GraphPlotData} from '@components/graphs/Line/Types';
// Logger
import logger from '@utils/Logger';

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
        let user_weights = await getUserStats({
          bodyStatType: BodyStatType.Weight,
        });
        if (user_weights == null) {
          logger.info('No user weights found');
          return;
        }
        user_weights = convertStats({
          stats: user_weights,
          targetUnit: weightUnitPref,
        });
        // Inside your useEffect
        if (user_weights) {
          const tempData = new GraphPlotData(
            [
              {
                date: '2024-01-01T11:35:36.961Z',
                value: 70,
              },
              {
                date: '2024-01-02T11:35:36.961Z',
                value: 71,
              },
              {
                date: '2024-01-03T11:35:36.961Z',
                value: 70,
              },
              {
                date: '2024-01-04T11:35:36.961Z',
                value: null,
              },
              {
                date: '2024-01-05T11:35:36.961Z',
                value: 70,
              },
              {
                date: '2024-01-06T11:35:36.961Z',
                value: 65,
              },
              {
                date: '2024-01-07T11:35:36.961Z',
                value: 64,
              },
            ],
            weightUnitPref,
          );

          const graphData = {
            D: tempData,
            W: tempData,
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
      <View style={styles.pageWrapper}>
        <View style={styles.headerSection}>
          <Header
            label="Weight"
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
          {data && activePeriod && data[activePeriod] && (
            <LineGraph
              data={data[activePeriod].graphData}
              averageLabel={data[activePeriod].averagePeriodLabel}
              averageValue={data[activePeriod].averageValue}
              unit={data[activePeriod].unit}
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
