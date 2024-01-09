import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  fontSizes,
  fontWeights,
  paddings,
  borderRadius,
  margins,
  darkThemeColors,
  lightThemeColors,
  iconSizes,
  fonts,
} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';

// Props for a clickable tile component.
interface ClickableTileProps {
  // Callback function to be called when the tile is pressed.
  onPress: () => void;
  //The label text for the tile.
  label: string;
  // Additional styles for the tile. (Optional)
  style?: object;
  // The icon for the tile.
  icon: string;
  // The background color of the tile.
  backgroundColor: string;
  // The last tracked date for the tile. (Optional)
  lastTracked?: string;
}

// Tile Data Type
export interface TileData {
  label: string;
  icon: string;
  backgroundColor?: string;
  // NOTE: This needs to be changed to the be subtext for the tile.
  lastTracked?: string;
  route: string;
}

const ClickableTile: React.FC<ClickableTileProps> = ({
  onPress,
  label,
  style,
  icon,
  backgroundColor,
  lastTracked,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const subText = lastTracked ? lastTracked : 'Start Tracking!';

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        style,
        {backgroundColor: backgroundColor, shadowColor: currentTheme.shadow},
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.tileContent}>
        <View style={styles.tileTop}>
          <View style={styles.iconContainer}>
            <Icon
              solid
              name={icon}
              size={iconSizes.xLarge}
              color={currentTheme.text}
            />
          </View>
        </View>
        <View style={styles.tileBottom}>
          <View style={styles.tileBottomContent}>
            <View style={styles.tileLabelContainer}>
              <Text style={[styles.tileLabel, {color: currentTheme.text}]}>
                {label}
              </Text>
            </View>
            <View style={styles.tileCurrentValue}>
              {lastTracked && (
                <Text
                  style={[styles.tileSubtext, {color: currentTheme.lightText}]}>
                  Last Tracked:
                </Text>
              )}
              <Text
                style={[styles.tileSubtext, {color: currentTheme.lightText}]}>
                {subText}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    padding: paddings.small,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '45%',
    height: 120,
    marginVertical: margins.small,
    shadowRadius: 3,
    elevation: 3,
    shadowOpacity: 1.0,
  },
  tileContent: {
    flex: 1,
    alignItems: 'center',
  },

  // Left Icon
  tileTop: {
    flex: 4,
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },

  // Right Content
  tileBottom: {
    flex: 6,
    justifyContent: 'center',
  },
  tileBottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.bold,
  },
  tileLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tileLabel: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.primary,
  },
  tileSubtext: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.normal,
    fontFamily: fonts.secondary,
  },
  tileCurrentValue: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ClickableTile;
