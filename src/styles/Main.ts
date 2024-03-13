/*
  Common styling used throughout the app
*/

// Types
import {
  FontTypes,
  FontWeights,
  ButtonStyles,
  LayoutStyles,
  HeadingTextStyles,
  BodyTextStyles,
  CtaTextStyles,
  themeColors,
} from '@styles/Types';

export const topNavBarHeight: number = 60;

const black = '#333333';
const white = '#FFFFFF';
const blue = '#3498db';
const purple = '#9b59b6';
export const gray = 'gray';

export const fonts = {
  heading: 'Montserrat',
  cta: 'Oswald',
  body: 'Lato',
};

export const fontSizes = {
  xxSmall: 12,
  xSmall: 14, // also the default
  small: 16,
  medium: 19,
  large: 23,
  xLarge: 28,
  xxLarge: 33,
};

export const fontWeights: Record<FontTypes, FontWeights> = {
  normal: 'normal',
  semiBold: '600',
  bold: 'bold',
  ultraBold: '900',
};

export const lightThemeColors: themeColors = {
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
  secondaryBackground: '#F0F0F0',
};

export const darkThemeColors: themeColors = {
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
  secondaryBackground: '#383838',
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

export const headingTextStyles: HeadingTextStyles = {
  xxSmall: {
    fontSize: fontSizes.xSmall,
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
  },
  xSmall: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
  },
  small: {
    fontSize: fontSizes.large,
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
  },
  medium: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
  },
  large: {
    fontSize: fontSizes.xxLarge,
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
  },
};

export const bodyTextStyles: BodyTextStyles = {
  xxSmall: {
    fontSize: fontSizes.xxSmall,
    fontFamily: fonts.body,
    fontWeight: fontWeights.normal,
  },
  xSmall: {
    fontSize: fontSizes.xSmall,
    fontFamily: fonts.body,
    fontWeight: fontWeights.normal,
  },
  small: {
    fontSize: fontSizes.small,
    fontFamily: fonts.body,
    fontWeight: fontWeights.normal,
  },
  medium: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.body,
    fontWeight: fontWeights.normal,
  },
  large: {
    fontSize: fontSizes.large,
    fontFamily: fonts.body,
    fontWeight: fontWeights.normal,
  },
};

export const ctaTextStyles: CtaTextStyles = {
  xxSmall: {
    fontSize: fontSizes.xxSmall,
    fontFamily: fonts.cta,
    fontWeight: fontWeights.semiBold,
  },
  xSmall: {
    fontSize: fontSizes.xSmall,
    fontFamily: fonts.cta,
    fontWeight: fontWeights.bold,
  },
  small: {
    fontSize: fontSizes.small,
    fontFamily: fonts.cta,
    fontWeight: fontWeights.bold,
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
  flexEndHorizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
