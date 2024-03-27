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
  xxSmall: TextStyle;
  xSmall: TextStyle;
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;
}

export interface BodyTextStyles {
  xxxSmall: TextStyle;
  xxSmall: TextStyle;
  xSmall: TextStyle;
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;
}

export interface CtaTextStyles {
  xxSmall: TextStyle;
  xSmall: TextStyle;
  small: TextStyle;
}

export interface themeColors {
  background: string;
  button: string;
  disabledButton: string;
  buttonText: string;
  icon: string;
  borders: string;
  text: string;
  primary: string;
  secondary: string;
  lightText: string;
  darkText: string;
  error: string;
  shadow: string;
  lowOpacityBackground: string;
  secondaryBackground: string;
}
