// React Imports
import React from 'react';

// Components
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Styling
import {
  borderRadius,
  darkThemeColors,
  lightThemeColors,
  iconSizes,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the Clickable Tile Component
 *
 * @interface ClickableTileProps
 *
 * @param {() => void} onPress - Function to be called when the tile is pressed
 * @param {string} label - The label text for the tile
 * @param {ViewStyle} style - Additional styles for the tile (optional)
 * @param {string} icon - The icon for the tile
 * @param {string} backgroundColor - The background color of the tile
 * @param {string} lastTracked - The last tracked date for the tile (optional)
 */
interface ClickableTileProps {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  icon: string;
  backgroundColor: string;
  lastTracked?: string;
}

/**
 * Clickable Tile Data Interface
 *
 * @interface TileData
 *
 * @param {string} label - The label text for the tile
 * @param {string} icon - The icon for the tile
 * @param {string} backgroundColor - The background color of the tile
 * @param {string} lastTracked - The last tracked date for the tile (optional)
 * @param {string} route - The route to navigate to when the tile is pressed
 */
export interface TileData {
  label: string;
  icon: string;
  backgroundColor?: string;
  // NOTE: This needs to be changed to be subtext for the tile.
  lastTracked?: string;
  route: string;
}

/**
 *  Clickable Tile Component
 *
 * @component ClickableTile
 * @example
 * <ClickableTile
 *   onPress={() => logger.info('Tile Pressed')}
 *   label={'Tile Label'}
 *   icon={'tile-icon'}
 *   backgroundColor={'red'}
 *   lastTracked={'Last Tracked'}
 * />
 *
 * @param {Object} props - Component ClickableTile Props
 * @returns {React.FC<ClickableTileProps>} - React Component
 */
const ClickableTile: React.FC<ClickableTileProps> = ({
  onPress,
  label,
  style,
  icon,
  backgroundColor,
  lastTracked,
}: ClickableTileProps): React.ReactElement<ClickableTileProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const displayText = lastTracked ? lastTracked : 'Start Tracking!';

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        style,
        {backgroundColor, shadowColor: currentTheme.shadow},
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon
          solid
          name={icon}
          size={iconSizes.xLarge}
          color={currentTheme.text}
        />
      </View>
      <View style={styles.tileLabelContainer}>
        <Text style={[styles.tileLabel, {color: currentTheme.text}]}>
          {label}
        </Text>
      </View>
      <View style={styles.tileCurrentValue}>
        {lastTracked && (
          <Text style={[styles.tileSubtext, {color: currentTheme.lightText}]}>
            Last Tracked:
          </Text>
        )}
        <Text style={[styles.tileSubtext, {color: currentTheme.lightText}]}>
          {displayText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    ...layoutStyles.spaceAroundVertical,
    width: '45%',
    height: 110,
    borderRadius: borderRadius.medium,
  },
  iconContainer: {
    ...layoutStyles.centerVertically,
  },
  tileLabelContainer: {
    ...layoutStyles.centerVertically,
  },
  tileCurrentValue: {
    ...layoutStyles.centerVertically,
  },
  tileLabel: {
    ...headingTextStyles.small,
  },
  tileSubtext: {
    ...bodyTextStyles.small,
  },
});

export default ClickableTile;
