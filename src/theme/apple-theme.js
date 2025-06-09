// Apple Colors
export const appleColors = {
  // Primary colors
  primary: {
    main: "#0071e3",
    light: "#42a5f5",
    dark: "#004494",
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#0071e3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },

  // Secondary colors
  secondary: {
    main: "#34c759",
    light: "#66bb6a",
    dark: "#2e7d32",
  },

  // Status colors
  success: "#34c759",
  warning: "#ff9500",
  error: "#ff2d55",
  info: "#5856d6",

  // Neutral colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  // Background colors
  background: {
    default: "#f5f5f7",
    paper: "#ffffff",
    light: "#fafafa",
  },

  // Text colors
  text: {
    primary: "#1d1d1f",
    secondary: "#86868b",
    disabled: "#c7c7cc",
  },

  // Common colors
  white: "#ffffff",
  black: "#000000",
}

// Apple Gradients
export const appleGradients = {
  primary: "linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)",
  secondary: "linear-gradient(135deg, #34c759 0%, #66bb6a 100%)",
  success: "linear-gradient(135deg, #34c759 0%, #2e7d32 100%)",
  warning: "linear-gradient(135deg, #ff9500 0%, #f57c00 100%)",
  error: "linear-gradient(135deg, #ff2d55 0%, #d32f2f 100%)",
  info: "linear-gradient(135deg, #5856d6 0%, #3f51b5 100%)",
  light: "linear-gradient(145deg, #ffffff 0%, #f5f5f7 100%)",
  dark: "linear-gradient(145deg, #1d1d1f 0%, #424242 100%)",
  glass: "linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
}

// Apple Shadows
export const appleShadows = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  card: "0 5px 15px rgba(0, 0, 0, 0.05)",
  button: "0 8px 20px rgba(0, 113, 227, 0.3)",
  hover: "0 15px 35px rgba(0, 113, 227, 0.2)",
}

// Apple Border Radius
export const appleBorderRadius = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  card: "12px",
  button: "28px",
  input: "8px",
  modal: "16px",
  full: "9999px",
}

// Apple Spacing
export const appleSpacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
}

// Apple Typography
export const appleTypography = {
  fontFamily: {
    primary: '"SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    secondary: '"SF Pro Text", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"SF Mono", "Monaco", "Consolas", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
}

// Material-UI Theme Configuration
export const createAppleTheme = () => ({
  palette: {
    mode: "light",
    primary: {
      main: appleColors.primary.main,
      light: appleColors.primary.light,
      dark: appleColors.primary.dark,
    },
    secondary: {
      main: appleColors.secondary.main,
      light: appleColors.secondary.light,
      dark: appleColors.secondary.dark,
    },
    success: {
      main: appleColors.success,
    },
    warning: {
      main: appleColors.warning,
    },
    error: {
      main: appleColors.error,
    },
    info: {
      main: appleColors.info,
    },
    background: {
      default: appleColors.background.default,
      paper: appleColors.background.paper,
    },
    text: {
      primary: appleColors.text.primary,
      secondary: appleColors.text.secondary,
      disabled: appleColors.text.disabled,
    },
  },
  typography: {
    fontFamily: appleTypography.fontFamily.primary,
    h1: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.bold,
      fontSize: appleTypography.fontSize["4xl"],
      lineHeight: appleTypography.lineHeight.tight,
    },
    h2: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.bold,
      fontSize: appleTypography.fontSize["3xl"],
      lineHeight: appleTypography.lineHeight.tight,
    },
    h3: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.semibold,
      fontSize: appleTypography.fontSize["2xl"],
      lineHeight: appleTypography.lineHeight.snug,
    },
    h4: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.semibold,
      fontSize: appleTypography.fontSize.xl,
      lineHeight: appleTypography.lineHeight.snug,
    },
    h5: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.medium,
      fontSize: appleTypography.fontSize.lg,
      lineHeight: appleTypography.lineHeight.normal,
    },
    h6: {
      fontFamily: appleTypography.fontFamily.primary,
      fontWeight: appleTypography.fontWeight.medium,
      fontSize: appleTypography.fontSize.base,
      lineHeight: appleTypography.lineHeight.normal,
    },
    body1: {
      fontFamily: appleTypography.fontFamily.secondary,
      fontWeight: appleTypography.fontWeight.normal,
      fontSize: appleTypography.fontSize.base,
      lineHeight: appleTypography.lineHeight.relaxed,
    },
    body2: {
      fontFamily: appleTypography.fontFamily.secondary,
      fontWeight: appleTypography.fontWeight.normal,
      fontSize: appleTypography.fontSize.sm,
      lineHeight: appleTypography.lineHeight.normal,
    },
  },
  shape: {
    borderRadius: parseInt(appleBorderRadius.md),
  },
  shadows: [
    "none",
    appleShadows.xs,
    appleShadows.sm,
    appleShadows.md,
    appleShadows.lg,
    appleShadows.xl,
    appleShadows["2xl"],
    appleShadows.card,
    appleShadows.button,
    appleShadows.hover,
    // Thêm các shadows khác nếu cần
    ...Array(15).fill(appleShadows.lg),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: appleBorderRadius.button,
          textTransform: "none",
          fontWeight: appleTypography.fontWeight.semibold,
          padding: `${appleSpacing[3]} ${appleSpacing[6]}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: appleGradients.primary,
          boxShadow: appleShadows.button,
          "&:hover": {
            background: "linear-gradient(135deg, #005bb5 0%, #004494 100%)",
            boxShadow: appleShadows.hover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: appleBorderRadius.card,
          background: appleGradients.light,
          boxShadow: appleShadows.card,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: appleShadows.hover,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: appleBorderRadius.input,
            backgroundColor: appleColors.background.light,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: appleColors.background.paper,
            },
            "&.Mui-focused": {
              backgroundColor: appleColors.background.paper,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: appleColors.primary.main,
                borderWidth: "2px",
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: appleBorderRadius.button,
          fontWeight: appleTypography.fontWeight.medium,
        },
      },
    },
  },
})
