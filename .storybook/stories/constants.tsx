import React from 'react';
import {Button, View} from 'react-native';
import ButtonComponent from '../../src/components/buttons/ButtonComponent';
import {layoutStyles} from '../../src/styles/Main';

/**
 * Mocked navigation object for Storybook
 *
 * @type {object}
 */
export const mockStoryNavigation = {
  goBack: () => console.log('Back action simulated in Storybook'),
  navigate(route: string) {
    console.log(`Navigating to ${route} in Storybook`);
  },
};

/**
 * PopupComponentProps
 *
 * @interface PopupComponentProps
 *
 * @param {React.ElementType} PopupComponent - The popup component
 * @param {string} message - The message for the popup
 */
interface PopupComponentProps {
  PopupComponent: React.ElementType;
  message: string;
}

/**
 * PopupContainer
 *
 * @param {PopupComponentProps} { PopupComponent, message = "Default value" } - The props for the PopupContainer
 * @returns {React.FC<PopupComponentProps>} - React Component
 */
export const PopupContainer: React.FC<PopupComponentProps> = ({
  PopupComponent,
  message = 'Default value',
}) => {
  const [visible, setVisible] = React.useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <View style={{flex: 1, ...layoutStyles.centerVertically}}>
      <ButtonComponent text="Toggle Popup" onPress={toggleVisibility} />
      {visible && (
        <PopupComponent
          visible={visible}
          message={message}
          onClose={toggleVisibility}
        />
      )}
    </View>
  );
};
