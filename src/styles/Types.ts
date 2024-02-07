import {ViewStyle} from 'react-native';
import {TextStyle} from 'react-native';

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
}

export interface ButtonStyles {
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
}

export interface HeadingStyles {
  headingTitle: TextStyle;
  headingPrimary: TextStyle;
  headingSecondary: TextStyle;
}

export interface TextStyles {
  bodyPrimarySmall: TextStyle;
  bodyPrimaryMedium: TextStyle;
  bodySecondarySmall: TextStyle;
  bodySecondaryMedium: TextStyle;
  buttonText: TextStyle;
  inputText: TextStyle;
  ctaText: TextStyle;
}
