import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

interface ClickableLinkProps {
  onPress: () => void;
  text: string;
  textStyle: object;
}

const ClickableLink: React.FC<ClickableLinkProps> = ({
  onPress,
  text,
  textStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ClickableLink;
