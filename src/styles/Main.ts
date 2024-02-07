/*
  Common styling used throughout the app
*/

// Types
import {
  FontTypes,
  FontWeights,
  ButtonStyles,
  LayoutStyles,
  HeadingStyles,
  TextStyles,
} from '@styles/Types';

const black = '#333333';
const white = '#FFFFFF';
const blue = '#3498db';
const purple = '#9b59b6';
export const gray = 'gray';

export const fonts = {
  primary: 'Montserrat',
  secondary: 'Lato',
};

export const fontSizes = {
  // explore allowFontScaling for accessability
  small: 12,
  default: 14,
  medium: 16,
  large: 20,
  xLarge: 24,
  title: 32,
};

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
  lowOpacityBackground: 'rgba(51, 51, 51, 0.5)',
};

export const darkThemeColors = {
  background: black,
  button: white,
  disabledButton: gray,
  buttonText: black,
  icon: white,
  borders: '#4d4d4d',
  text: white,
  primary: blue,
  secondary: purple,
  lightText: '#E5E5EA',
  darkText: '#F2F2F7',
  error: '#FF453A',
  shadow: 'rgba(50, 50, 50, 0.3)',
  lowOpacityBackground: 'rgba(255, 255, 255, 0.5)',
};

export const paddingSizes = {
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
};

export const marginSizes = {
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
  xxLarge: 30,
  xxxLarge: 40,
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

export const buttonStyles: ButtonStyles = {
  small: {
    height: 50,
    width: 160,
  },
  medium: {
    width: 225,
    height: 50,
  },
  large: {
    width: 300,
    height: 50,
  },
};

export const headingStyles: HeadingStyles = {
  headingTitle: {
    fontSize: fontSizes.title,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
  headingPrimary: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
  headingSecondary: {
    fontSize: fontSizes.large,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
};

export const textStyles: TextStyles = {
  bodyPrimarySmall: {
    fontSize: fontSizes.small,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.normal,
  },
  bodyPrimaryMedium: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.normal,
  },
  bodySecondarySmall: {
    fontSize: fontSizes.small,
    fontFamily: fonts.secondary,
    fontWeight: fontWeights.normal,
  },
  bodySecondaryMedium: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.secondary,
    fontWeight: fontWeights.normal,
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.secondary,
    fontWeight: fontWeights.bold,
  },
  inputText: {
    fontSize: fontSizes.default,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.normal,
  },
  ctaText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.normal,
  },
};

export const layoutStyles: LayoutStyles = {
  centerHorizontally: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  centerVertically: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  spaceAroundHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  spaceBetweenHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceAroundVertical: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  spaceBetweenVertical: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStartHorizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexStartVertical: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStretchVertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  flexStretchHorizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
};
