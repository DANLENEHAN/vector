// Common styling used throughout the app

export const fonts = {
  primary: 'Montserrat',
  secondary: 'Lato',
};

export const fontSizes = {
  // explore allowFontScaling for accessability
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
};

// Typing required for adding fontWeight
// to Tab.Screen options prop object
export type FontTypes =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
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

export const fontWeights: Record<FontTypes, FontWeights> = {
  ultraLight: '100',
  thin: '200',
  light: '300',
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
  extraBold: '800',
  ultraBold: '900',
};

export const lightThemeColors = {
  background: '#FFFFFF',
  icon: '#333333',
  button: '#333333',
  buttonText: '#FFFFFF',
  text: '#333333',
  primary: '#3498db',
  secondary: '#9b59b6',
};

export const darkThemeColors = {
  background: '#333333',
  button: '#FFFFFF',
  buttonText: '#333333',
  icon: '#FFFFFF',
  text: '#FFFFFF',
  primary: '#3498db',
  secondary: '#9b59b6',
};

export const disabledButton = 'gray';

export const paddings = {
  xsmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xlarge: 25,
};

export const margins = {
  xsmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xlarge: 25,
  xxLarge: 30,
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xLarge: 16,
  circle: 50, // for creating circular elements
};

export const borderWidth = {
  xsmall: 1,
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 6,
};
