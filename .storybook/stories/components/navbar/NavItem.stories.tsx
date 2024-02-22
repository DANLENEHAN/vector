import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavItem from '../../../../src/components/navbar/NavItem'; // Adjust the import path as necessary
import {SystemProvider} from '../../../../src/context/SystemContext'; // Adjust the import path as necessary

export default {
  title: 'components/navbar//NavItem',
  component: NavItem,
  decorators: [
    Story => (
      <SystemProvider>
        <View style={styles.storyContainer}>
          <Story />
        </View>
      </SystemProvider>
    ),
  ],
};

const Template = args => <NavItem {...args} />;

export const ActiveWithLabel = Template.bind({});
ActiveWithLabel.args = {
  icon: 'house',
  label: 'Home',
  onPress: () => console.log('Home Pressed'),
  isActive: true,
};

export const InactiveWithLabel = Template.bind({});
InactiveWithLabel.args = {
  icon: 'compass',
  label: 'Discover',
  onPress: () => console.log('Discover Pressed'),
  isActive: false,
};

export const ActiveWithoutLabel = Template.bind({});
ActiveWithoutLabel.args = {
  icon: 'users',
  onPress: () => console.log('Profile Pressed'),
  isActive: true,
};

export const InactiveWithoutLabel = Template.bind({});
InactiveWithoutLabel.args = {
  icon: 'calendar-check',
  onPress: () => console.log('Settings Pressed'),
  isActive: false,
};

const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
