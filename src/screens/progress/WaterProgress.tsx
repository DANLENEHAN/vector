// React imports
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {fontSizes} from '../../styles/main';
// Components
import Header from '../../components/navbar/Header';
// Services
import {getUserStats} from '../../services/api/blueprints/stat/functions';
// Utils
import {convertStats} from '../../utils/conversion';
// Types
import {ScreenProps} from '../types';
import {
  StatSchema,
  StatType,
  WaterUnit,
} from '../../services/api/swagger/data-contracts';

const WaterProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<StatSchema[]>([]);
  useEffect(() => {
    const getUserWater = async () => {
      const waterUnitPref = WaterUnit.Ml;
      let user_water = await getUserStats({statType: StatType.Water});
      if (user_water == null) {
        console.log('No user water found');
      }
      setData(
        convertStats({stats: user_water, targetUnit: waterUnitPref}) ?? [],
      );
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
            <View style={{marginBottom: 10}}>
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
});

export default WaterProgress;
