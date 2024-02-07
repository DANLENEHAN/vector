// React imports
import React, {useState} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
// Components
import {View, StyleSheet} from 'react-native';
import Header from '@components/navbar/Header';
import LineGraph from '@components/graphs/Line/Graph';
import UnitSelector from '@components/buttons/UnitSelector';
// Services
import {useSystem} from '@context/SystemContext';
// Types
import {ScreenProps} from '@screens/Types';

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
const MoodProgress: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
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

  return (
    <ScreenWrapper>
      <View style={styles.pageWrapper}>
        <View style={styles.headerSection}>
          <Header
            label="Mood"
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
