// React
import React, {useState, useMemo} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';

// Types and Utilities
import {BodyPartToPolygonMapper} from './Constants';
import {PolygonGroup} from './Types';
import {ComponentSize} from '@shared/Types';

// Styles
import {layoutStyles} from '@styles/Main';

const BodyMap: React.FC = () => {
  const [componentSize, setComponentSize] = useState<ComponentSize>({
    width: 0,
    height: 0,
  });

  // Use useMemo to avoid unnecessary re-creation of polygonGroup
  const polygonGroup = useMemo(
    () => new PolygonGroup(BodyPartToPolygonMapper),
    [],
  );

  const handleMusclePress = (event: GestureResponderEvent) => {
    const {locationX, locationY} = event.nativeEvent;
    const normalizedX = locationX / componentSize.width;
    const normalizedY = locationY / componentSize.height;
    const selectionCoords = {x: normalizedX, y: normalizedY};

    polygonGroup.isPointInAnyPolygon(selectionCoords);
    console.log('Selection coordinates:', selectionCoords);
  };

  const onComponentLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setComponentSize({width, height});
  };

  return (
    <View style={styles.componentContainer}>
      <TouchableOpacity
        onPress={handleMusclePress}
        onLayout={onComponentLayout}
        accessibilityLabel="Body map"
        accessibilityHint="Select a muscle group by tapping on the body map."
        accessibilityRole="button"
        style={styles.bodyMapContainer}>
        <Image
          style={styles.bodyMapImage}
          source={require('../../../../assets/fonts/BodyMapFront.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    ...layoutStyles.centerHorizontally,
    backgroundColor: 'green',
  },
  bodyMapContainer: {
    width: '75%',
    height: '85%',
    ...layoutStyles.centerHorizontally,
  },
  bodyMapImage: {
    width: '100%',
    height: '100%',
  },
});

export default BodyMap;
