// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {fontSizes} from '../../styles/main';
// Components
import Header from '../../components/navbar/Header';
//import {LineChart} from 'react-native-chart-kit';
import {LineChart, CurveType} from 'react-native-gifted-charts';
// Types
import {ScreenProps} from '../types';
import {useWindowDimensions} from 'react-native';

const WeightProgress: React.FC<ScreenProps> = ({navigation}) => {
  const graphWidth = useWindowDimensions().width * 0.7;

  const data = [
    {
      date: '1 Jan 2023',
      value: 50,
      label: '1 Jan',
      labelTextStyle: {color: 'black', width: 60},
    },
    {date: '2 Jan 2023', value: 32},
    {date: '3 Jan 2023', value: 70},
    {date: '4 Jan 2023', value: null},
    {date: '5 Jan 2023', value: 65},
    {date: '6 Jan 2023', value: 60},
  ];

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
            {
              <LineChart
                curveType={CurveType.CUBIC}
                areaChart
                data={data}
                rotateLabel
                width={graphWidth}
                isAnimated
                animateOnDataChange
                animationDuration={1000}
                onDataChangeAnimationDuration={300}
                //hideDataPoints
                spacing={graphWidth / data.length}
                color="#00ff83"
                thickness={2}
                startFillColor="rgba(20,105,81,0.3)"
                endFillColor="rgba(20,85,81,0.01)"
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={20}
                noOfSections={6}
                yAxisColor="black"
                yAxisThickness={0}
                rulesType="solid"
                rulesColor="gray"
                yAxisTextStyle={{color: 'gray'}}
                yAxisSide="right"
                xAxisColor="black"
                showXAxisIndices={true}
                pointerConfig={{
                  pointerStripHeight: 160,
                  pointerStripColor: 'black',
                  pointerStripWidth: 2,
                  pointerColor: 'lightgray',
                  pointerStripUptoDataPoint: true,
                  strokeDashArray: [2, 5],
                  radius: 6,
                  pointerLabelWidth: 100,
                  pointerLabelHeight: 90,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: false,
                  pointerLabelComponent: items => {
                    return (
                      <View
                        style={{
                          height: 90,
                          width: 100,
                          justifyContent: 'center',
                          //marginTop: -30,
                          //marginLeft: -40,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 14,
                            marginBottom: 6,
                            textAlign: 'center',
                          }}>
                          {items[0].date}
                        </Text>

                        <View
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: 'black',
                          }}>
                          <Text
                            style={{fontWeight: 'bold', textAlign: 'center'}}>
                            {items[0].value + '.0' + 'Kg'}
                          </Text>
                        </View>
                      </View>
                    );
                  },
                }}
              />
            }
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
