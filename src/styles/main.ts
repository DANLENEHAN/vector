// Common styling used throughout the app

const black = '#333333';
const white = '#FFFFFF';
const blue = '#3498db';
const purple = '#9b59b6';
const gray = 'gray';

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

export const fontWeights: Record<FontTypes, FontWeights> = {
  ultraLight: '100',
  thin: '200',
  light: '300',
  normal: 'normal',
  medium: '500',
  semiBold: '600',
  bold: 'bold',
  extraBold: '800',
  ultraBold: '900',
};

export const lightThemeColors = {
  background: white,
  button: black,
  disabledButton: gray,
  buttonText: white,
  icon: black,
  borders: '#CCCCCC',
  text: black,
  primary: blue,
  secondary: purple,
  lightText: '#575757', // Lighter text color for less emphasis
  darkText: '#333333', // Darker text color for more emphasis
  error: '#FF3B30', // Error text color
  shadow: 'rgba(150, 150, 150, 0.3)',
};

export const darkThemeColors = {
  background: black,
  button: white,
  disabledButton: gray,
  buttonText: black,
  icon: white,
  borders: '#CCCCCC',
  text: white,
  primary: blue,
  secondary: purple,
  lightText: '#E5E5EA',
  darkText: '#F2F2F7',
  error: '#FF453A',
  shadow: 'rgba(50, 50, 50, 0.3)',
};

export const paddings = {
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
};

export const margins = {
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
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
  xSmall: 1,
  small: 2,
  medium: 3,
  large: 4,
  xLarge: 6,
};

export const iconSizes = {
  small: 15,
  medium: 20,
  large: 25,
  xLarge: 30,
  xxLarge: 35,
};
