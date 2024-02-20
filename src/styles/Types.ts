import {ViewStyle} from 'react-native';
import {TextStyle} from 'react-native';

export type FontTypes = 'normal' | 'semiBold' | 'bold' | 'ultraBold';

export type FontWeights = 'normal' | '600' | 'bold' | '900';

export interface LayoutStyles {
  centerHorizontally: ViewStyle;
  centerVertically: ViewStyle;
  spaceAroundHorizontal: ViewStyle;
  spaceBetweenHorizontal: ViewStyle;
  spaceAroundVertical: ViewStyle;
  spaceBetweenVertical: ViewStyle;
  flexStartHorizontal: ViewStyle;
  flexStartVertical: ViewStyle;
  flexStretchVertical: ViewStyle;
  flexStretchHorizontal: ViewStyle;
  flexEndHorizontal: ViewStyle;
}

export interface ButtonStyles {
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
}

export interface HeadingTextStyles {
  xSmall: TextStyle;
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;
}

export interface BodyTextStyles {
  xSmall: TextStyle;
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;
}

export interface CtaTextStyles {
  xSmall: TextStyle;
  small: TextStyle;
}
