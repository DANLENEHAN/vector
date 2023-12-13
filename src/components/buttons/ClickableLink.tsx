import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

type ClickableLinkProps = {
  onPress: () => void;
  text: string;
};

const ClickableLink: React.FC<ClickableLinkProps> = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default ClickableLink;
