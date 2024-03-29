// React Imports
import React from 'react';
// Components
import {TouchableOpacity, Text} from 'react-native';

/**
 * Interface for the ClickableLink Component
 *
 * @interface ClickableLinkProps
 *
 * @param {() => void} onPress - Function to be called when the link is pressed
 * @param {string} text - Text to be displayed on the link
 * @param {object} textStyle - Style object to be applied to the link text
 */
interface ClickableLinkProps {
  onPress: () => void;
  text: string;
  textStyle: object;
}

/**
 *  ClickableLink Component
 *
 * @component ClickableLink
 * @param {Object} props - Component ClickableLink Props
 * @returns {React.FC<ClickableLinkProps>} - React Component
 */
const ClickableLink: React.FC<ClickableLinkProps> = ({
  onPress,
  text,
  textStyle,
}: ClickableLinkProps): React.ReactElement<ClickableLinkProps> => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ClickableLink;
