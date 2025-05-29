// src/theme/index.js
import { createTheme } from '@mui/material/styles';
import colors from './colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.silverAccent,
      light: colors.pureWhite,
      dark: colors.obsidianBlack,
    },
    secondary: {
      main: colors.softGray,
      light: colors.pureWhite,
      dark: colors.obsidianBlack,
    },
    text: {
      primary: colors.obsidianBlack,
      secondary: colors.softGray,
      disabled: colors.softGray,
    },
    background: {
      default: colors.pureWhite,
      paper: colors.pureWhite,
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", Roboto, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '8px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          background: colors.gradientBlack,
          color: colors.pureWhite,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            background: colors.silverAccent,
            color: colors.obsidianBlack,
          },
        },
        outlinedPrimary: {
          borderColor: colors.silverAccent,
          color: colors.silverAccent,
          '&:hover': {
            background: colors.gradientBlack,
            color: colors.pureWhite,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.pureWhite,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s',
        },
      },
    },
  },
});

export default theme;