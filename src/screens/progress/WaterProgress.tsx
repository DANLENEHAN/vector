// React imports
import React, {useState, useEffect} from 'react';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {fontSizes, marginSizes} from '@styles/Main';
// Components
import Header from '@components/navbar/Header';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
// Services
import {getUserStats} from '@services/api/blueprints/bodyStat/Functions';
// Utils
import {convertStats} from '@utils/Conversion';
// Types
import {ScreenProps} from '@screens/Types';
import {
  BodyStatCreateSchema,
  BodyStatType,
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
const WaterProgress: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const [data, setData] = useState<BodyStatCreateSchema[]>([]);
  useEffect(() => {
    const getUserWater = async () => {
      // NOTE: This is a temporary solution until we have a user profile page
      const waterUnitPref = WaterUnit.Ml;
      // BROKEN
      let user_water = await getUserStats({bodyStatType: BodyStatType.Water});
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
      <Header label="Water" navigation={navigation} includeBackArrow={true} />
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
    marginBottom: marginSizes.small,
  },
});

export default WaterProgress;
