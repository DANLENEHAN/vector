// React imports
import React, {useState, useEffect} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {fontSizes, margins} from '@styles/main';
// Components
import Header from '@components/navbar/Header';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
// Services
import {getUserStats} from '@services/api/blueprints/stat/functions';
// Utils
import {convertStats} from '@utils/conversion';
// Types
import {ScreenProps} from '@screens/types';
import {
  StatCreateSchema,
  StatType,
  WaterUnit,
} from '@services/api/swagger/data-contracts';

/**
 *  Water progress screen
 *
 * @component WaterProgress
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the water progress screen component
 *
 * @example
 * <WaterProgress navigation={navigation}/>
 */
const WaterProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<StatCreateSchema[]>([]);
  useEffect(() => {
    const getUserWater = async () => {
      // NOTE: This is a temporary solution until we have a user profile page
      const waterUnitPref = WaterUnit.Ml;
      let user_water = await getUserStats({statType: StatType.Water});
      let stats: any[] = [];
      if (user_water !== undefined) {
        stats = convertStats({stats: user_water, targetUnit: waterUnitPref});
      }
      setData(stats ?? []);
    };
    getUserWater();
  });

  return (
    <ScreenWrapper>
      <Header
        label="Water"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.content}>
        <ScrollView>
          {data.map(item => (
            <View style={styles.statItem}>
              <Text>Unit: {item.unit}</Text>
              <Text>Created At: {item.created_at}</Text>
              <Text>Value: {item.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  statItem: {
    marginBottom: margins.small,
  },
});

export default WaterProgress;
