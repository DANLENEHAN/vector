// React Import
import React, {useState} from 'react';
// Components
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

export interface TagProps {
  label: string;
  icon: string;
  color: string;
}

export interface TagSelectorProps {
  tags: TagProps[];
  tagSelectorLabel: string;
}

export const Tag: React.FC<
  TagProps & {active: boolean; onPress: () => void}
> = ({label, icon, color, active, onPress}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

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
      <Icon name={icon} solid size={iconSizes.medium} color={fontColor} />
      <Text style={[styles.tagLabel, {color: fontColor}]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const TagSelector: React.FC<TagSelectorProps> = ({
  tagSelectorLabel,
  tags,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Track selected tags by label
  const toggleTagSelection = (label: string) => {
    setSelectedTags(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label],
    );
  };

  // Toggle the collapse state
  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <View>
      <View style={styles.TagSelectorHeader}>
        <Text style={[styles.TagSelectorLabel, {color: currentTheme.text}]}>
          {tagSelectorLabel}
        </Text>
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
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => console.log('Menu action')}>
            <Icon
              name={'bars'}
              solid
              size={iconSizes.small}
              color={currentTheme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCollapse}
            style={styles.TagSelectorAdd}
            testID="tagSelectorCollapseButton">
            <Icon
              name={isCollapsed ? 'plus' : 'minus'}
              solid
              size={iconSizes.small}
              color={currentTheme.text}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!isCollapsed && (
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <Tag
              key={index}
              label={tag.label}
              icon={tag.icon}
              color={tag.color}
              active={selectedTags.includes(tag.label)}
              onPress={() => toggleTagSelection(tag.label)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    height: 45,
    borderRadius: borderRadius.circle,
    ...layoutStyles.centerHorizontally,
    paddingHorizontal: marginSizes.small,
    borderWidth: 1,
    margin: marginSizes.xSmall,
  },
  tagLabel: {
    ...bodyTextStyles.small,
    marginLeft: marginSizes.small,
  },
  tagContainer: {
    flexWrap: 'wrap',
    ...layoutStyles.flexStartHorizontal,
  },
  TagSelectorLabel: {
    ...headingTextStyles.xSmall,
    marginLeft: marginSizes.medium,
    marginBottom: marginSizes.xSmall,
  },
  TagSelectorActiveOptions: {
    ...bodyTextStyles.small,
  },
  TagSelectorAdd: {
    marginRight: marginSizes.medium,
  },
  iconContainer: {
    width: 50,
    ...layoutStyles.spaceBetweenHorizontal,
  },
  TagSelectorHeader: {
    ...layoutStyles.spaceBetweenHorizontal,
  },
});

export default TagSelector;
