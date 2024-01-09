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
// Types
import {ScreenProps} from '../types';
import {StatSchema, StatType} from '../../services/api/swagger/data-contracts';

const MoodProgress: React.FC<ScreenProps> = ({navigation}) => {
  const [data, setData] = useState<StatSchema[]>([]);
  useEffect(() => {
    const getUserMoods = async () => {
      let user_mood = await getUserStats({statType: StatType.Feeling});
      setData(user_mood ?? []);
    };
    getUserMoods();
  });

  return (
    <ScreenWrapper>
      <Header
        label="Mood"
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

export default MoodProgress;
