// ./src/styles/themes.js

// Định nghĩa màu sắc
export const colors = {
  primary: {
    main: '#0071e3',
    light: '#42a5f5',
    dark: '#0056b3',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  success: {
    main: '#34c759',
    light: '#81c784',
    dark: '#2e7d32',
  },
  error: {
    main: '#ff3b30',
    light: '#ef5350',
    dark: '#c62828',
  },
  warning: {
    main: '#ff9500',
    light: '#ffb300',
    dark: '#f57c00',
  },
  neutral: {
    100: '#f5f5f7',
    200: '#e5e5ea',
    300: '#d1d1d6',
    400: '#86868b',
    500: '#8e8e93',
    800: '#1d1d1f',
  },
  white: '#ffffff',
  dialogLight: '#f8f8fa', // Màu mới cho gradient dialog
};

// Định nghĩa gradient
export const gradients = {
  primary: 'linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)',
  secondary: 'linear-gradient(145deg, #9c27b0 0%, #673ab7 100%)',
  success: 'linear-gradient(145deg, rgba(52, 199, 89, 0.1) 0%, rgba(52, 199, 89, 0.05) 100%)',
  error: 'linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)',
  headerBlue: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
  headerPink: 'linear-gradient(145deg, #f093fb 0%, #f5576c 100%)',
  neutral: 'linear-gradient(145deg, #f5f5f7 0%, #e5e5ea 100%)',
  dialog: 'linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)',
  dialogHeader: 'linear-gradient(145deg, rgba(0, 113, 227, 0.05) 0%, rgba(0, 113, 227, 0.1) 100%)',
  dialogHeaderError: 'linear-gradient(145deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 59, 48, 0.1) 100%)',
};

// Định nghĩa shadow
export const shadows = {
  small: '0 2px 8px rgba(0, 0, 0, 0.1)',
  medium: '0 5px 15px rgba(0, 0, 0, 0.05)',
  large: '0 10px 25px rgba(0, 0, 0, 0.1)',
  hover: '0 8px 20px rgba(0, 0, 0, 0.1)',
  buttonHover: '0 6px 16px rgba(0, 113, 227, 0.3)',
};

// Định nghĩa typography
export const typography = {
  h6: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
  },
  body1: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
  },
  body2: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.57,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
  },
  caption: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.66,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
  },
};

// Định nghĩa animations
export const animations = {
  transition: 'all 0.3s ease',
  fade: 'opacity 0.3s ease-in-out',
  hover: 'transform 0.2s ease, box-shadow 0.2s ease',
  tableHover: 'background-color 0.2s ease',
};

// Định nghĩa textStyles
export const textStyles = {
  blackBold: {
    color: colors.neutral[800],
    fontWeight: 600,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  blackLight: {
    color: colors.neutral[800],
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  whiteBold: {
    color: colors.white,
    fontWeight: 600,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  whiteLight: {
    color: colors.white,
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  grayLight: {
    color: colors.neutral[400],
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  graySmall: {
    color: colors.neutral[400],
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  selectedUsers: {
    color: colors.neutral[400],
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
  error: {
    color: colors.error.main,
    fontWeight: 400,
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
  },
};