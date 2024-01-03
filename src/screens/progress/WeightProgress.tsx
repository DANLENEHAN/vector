// React imports
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  //lightThemeColors,
  //darkThemeColors,
  fontWeights,
  margins,
} from '../../styles/main';
//import {useTheme} from '../../context/ThemeContext';
// Components
import Header from '../../components/navbar/Header';
// Services
import {getStats} from '../../services/api/blueprints/stat_api';
import {getUserDetails} from '../../services/api/blueprints/user_api';
// Types
import {ScreenProps} from '../types';
import {StatSchema, StatType} from '../../services/api/swagger/data-contracts';
import {SwaggerValidationError} from '../../services/api/types';

const WeightTracking: React.FC<ScreenProps> = ({navigation}) => {
  //const {theme} = useTheme();
  //const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [data, setData] = useState<StatSchema[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true);
      const user_details = await getUserDetails();
      if (user_details instanceof SwaggerValidationError) {
        console.error(`Error: ${user_details.message}`);
      } else {
        const response = await getStats({
          filters: {
            user_id: {eq: user_details.user_id},
            stat_type: {eq: StatType.Weight},
          },
          sort: ['created_at:desc'],
        });
        if (response instanceof SwaggerValidationError) {
          console.error(`Error: ${response.message}`);
        } else {
          setData(response);
        }
      }
    };
    fetchData();
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
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.bold,
  },
  titleContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackContainer: {
    flex: 8,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
  numberInput: {
    margin: margins.small,
  },
});

export default WeightTracking;
