// React
import React, {useState, useMemo} from 'react';
import {
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';

// Types and Utilities
import {BodyPartToPolygonMapper} from './Constants';
import {PolygonGroup} from './Types';
import {ComponentSize} from '@shared/Types';
import {BodyStatType} from '@services/api/swagger/data-contracts';

// Styles
import {layoutStyles} from '@styles/Main';

/**
 * Defines the properties for the BodyMap component, enabling interaction with selected body parts on the map.
 *
 * @type {Object} BodyMapProps
 * @property {(bodyPart: string) => void} onBodyPartSelect - A callback function that is called when a body part is selected. It receives the name of the selected body part as a string argument.
 */
interface BodyMapProps {
  onBodyPartSelect: (bodyPart: BodyStatType) => void;
}

const BodyMap: React.FC<BodyMapProps> = ({
  onBodyPartSelect,
}: BodyMapProps): React.ReactElement<BodyMapProps> => {
  const [componentSize, setComponentSize] = useState<ComponentSize>({
    width: 0,
    height: 0,
  });

  const polygonGroup = useMemo(
    () => new PolygonGroup(BodyPartToPolygonMapper),
    [],
  );

  const handleMusclePress = (event: GestureResponderEvent) => {
    const {locationX, locationY} = event.nativeEvent;
    const normalizedX = locationX / componentSize.width;
    const normalizedY = locationY / componentSize.height;
    const selectionCoords = {x: normalizedX, y: normalizedY};

    const bodyPart = polygonGroup.isPointInAnyPolygon(selectionCoords);
    if (bodyPart) {
      onBodyPartSelect(bodyPart);
    }
  };

  const onComponentLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setComponentSize({width, height});
  };

  return (
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
        resizeMode="stretch"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bodyMapContainer: {
    ...layoutStyles.centerVertically,
  },
  bodyMapImage: {
    flex: 1,
  },
});

export default BodyMap;
