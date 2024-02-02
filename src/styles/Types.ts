import {ViewStyle} from 'react-native';

export type FontTypes =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold'
  | 'ultraBold';

export type FontWeights =
  | '100'
  | '200'
  | '300'
  | 'normal'
  | '500'
  | '600'
  | 'bold'
  | '800'
  | '900';

export interface LayoutStyles {
  centerContent: ViewStyle;
  centerHorizontally: ViewStyle;
  centerVertically: ViewStyle;
  absolutePosition: ViewStyle;
  spaceAroundHorizontal: ViewStyle;
  spaceBetweenHorizontal: ViewStyle;
  spaceAroundVertical: ViewStyle;
  spaceBetweenVertical: ViewStyle;
}

export interface ButtonStyles {
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
}
