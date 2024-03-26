// React Import
import React, {useState} from 'react';
// Components
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  marginSizes,
  paddingSizes,
  borderWidth,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the TagSelector Component
 *
 * @interface TagProps
 *
 * @param {string} label - The label for the tag
 * @param {string} icon - The icon for the tag
 * @param {string} color - The color for the tag (optional)
 */
export interface TagProps {
  label: string;
  icon?: string;
  color?: string;
}

/**
 * Interface for Tag Selector Component properties.
 *
 * The Tag Selector Component allows users to select from a list of tags,
 * providing a flexible and dynamic tag selection UI.
 *
 * @param {TagProps[]} tags - Array of TagProps, representing the individual
 *  tags available for selection.
 * @param {string} tagSelectorLabel - Label for the tag selector component,
 *  typically displayed above the selection area.
 * @param {string[]} selectedTags - Array of selected tag IDs, indicating
 *  which tags are currently selected.
 * @param {(tagID: string) => void} onTagSelect - Callback function that
 *  is called when a tag is selected or deselected. Receives the tag ID as
 *  an argument.
 * @param {object} [style] - Optional styling object to customize the
 *  appearance of the tag selector component.
 *
 * @returns {React.FC} - React Functional Component that renders the
 *  tag selector interface.
 */

export interface TagSelectorProps {
  tags: TagProps[];
  tagSelectorLabel: string;
  selectedTags: string[];
  onTagSelect: (tagID: string) => void;
  style?: object;
}

/**
 *  Tag Component
 *
 * @param {TagProps} TagProps
 * @param {boolean} active - The active state for the tag
 * @param {() => void} onPress - The function to be called when the tag is pressed
 * @returns {React.FC} - React Component
 */
export const Tag: React.FC<
  TagProps & {active: boolean; onPress: () => void}
> = ({label, icon, color, active, onPress}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  if (!color) {
    color = currentTheme.primary;
  }
  // Function to toggle selection state
  const fontColor = active ? currentTheme.background : currentTheme.text;
  const backgroundColor = active ? color : currentTheme.background;

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        {
          backgroundColor: backgroundColor,
          borderColor: color,
        },
      ]}
      onPress={onPress}
      testID={`tagSelectorTag_${label}`}>
      {icon && (
        <Icon name={icon} solid size={iconSizes.small} color={fontColor} />
      )}
      <Text
        style={[
          styles.tagLabel,
          {color: fontColor, marginLeft: icon ? marginSizes.small : 0},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * TagSelector Component
 *
 * @param {TagSelectorProps} tagSelectorLabel - The label for the tag selector
 * @returns {React.FC} - React Component
 */
export const TagSelector: React.FC<TagSelectorProps> = ({
  tagSelectorLabel,
  tags,
  selectedTags,
  onTagSelect,
  style = {},
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <View
      style={[
        styles.TagSelectorContainer,
        {
          borderColor: currentTheme.borders,
          backgroundColor: currentTheme.secondaryBackground,
        },
        style,
      ]}>
      <View style={styles.TagSelectorHeader}>
        <Text style={[styles.TagSelectorLabel, {color: currentTheme.text}]}>
          {tagSelectorLabel}
        </Text>
        <View style={styles.selectedTagsContainer}>
          {isCollapsed && selectedTags.length > 0 && (
            <Text
              style={[
                styles.TagSelectorActiveOptions,
                {color: currentTheme.lightText},
              ]}
              testID="tagSelectorSelectedCount">
              ({selectedTags.length} Selected)
            </Text>
          )}
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={toggleCollapse}
            style={[
              styles.TagSelectorAdd,
              {
                backgroundColor: currentTheme.button,
              },
            ]}
            testID="tagSelectorCollapseButton">
            <Icon
              name={isCollapsed ? 'caret-down' : 'caret-up'}
              solid
              size={iconSizes.small}
              color={currentTheme.background}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!isCollapsed && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tagContainer}>
          {tags.map((tag, index) => (
            <Tag
              key={index}
              label={tag.label}
              icon={tag.icon}
              color={tag.color}
              active={selectedTags.includes(tag.label)}
              onPress={() => onTagSelect(tag.label)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Tag Styles
  tag: {
    borderRadius: borderRadius.circle,
    ...layoutStyles.centerHorizontally,
    paddingHorizontal: marginSizes.small,
    paddingVertical: paddingSizes.xSmall,
    borderWidth: 1,
    margin: marginSizes.xSmall,
  },
  tagLabel: {
    ...bodyTextStyles.xxSmall,
  },
  tagContainer: {
    flexWrap: 'wrap',
    ...layoutStyles.flexStartHorizontal,
    paddingRight: paddingSizes.xSmall,
  },
  // Tag Selector Styles
  TagSelectorContainer: {
    width: '95%',
    padding: paddingSizes.small,
    borderRadius: borderRadius.large,
    borderWidth: borderWidth.xSmall,
  },
  TagSelectorLabel: {
    ...headingTextStyles.xxSmall,
    width: '40%',
  },
  selectedTagsContainer: {
    width: '40%',
  },
  TagSelectorActiveOptions: {
    ...bodyTextStyles.small,
    textAlign: 'center',
  },
  TagSelectorAdd: {
    borderRadius: borderRadius.circle,
    height: 25,
    width: 25,
    ...layoutStyles.centerHorizontally,
  },
  iconContainer: {
    ...layoutStyles.flexEndHorizontal,
    width: '10%',
  },
  TagSelectorHeader: {
    margin: marginSizes.xSmall,
    ...layoutStyles.spaceBetweenHorizontal,
  },
});

export default TagSelector;
