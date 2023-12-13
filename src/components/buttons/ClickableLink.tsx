import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

type ViewLinkProps = {
  onPress: () => void;
  text: string;
};

const ViewLink: React.FC<ViewLinkProps> = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default ViewLink;
