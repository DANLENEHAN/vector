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
  WeightUnit,
} from '../../services/api/swagger/data-contracts';

const WeightProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<StatSchema[]>([]);
  // NOTE: This is a temporary solution until we have a user profile page
  const weightUnitPref = WeightUnit.Stone;
  useEffect(() => {
    const getUserWeights = async () => {
      let user_weights = await getUserStats({statType: StatType.Weight});
      if (user_weights == null) {
        console.log('No user weights found');
      }
      user_weights = convertStats({
        stats: user_weights,
        targetUnit: weightUnitPref,
      });
      setData(user_weights ?? []);
    };
    getUserWeights();
  });

  return (
    <ScreenWrapper>
      <Header
        label="Weight"
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

export default WeightProgress;
