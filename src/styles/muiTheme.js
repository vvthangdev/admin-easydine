import { createTheme } from '@mui/material/styles';
import { theme } from './theme'; // Import theme đã tạo

const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary.main,
      light: theme.colors.primary.light,
      dark: theme.colors.primary.dark,
      contrastText: theme.colors.white,
    },
    secondary: {
      main: theme.colors.secondary.main,
      light: theme.colors.secondary.light,
      dark: theme.colors.secondary.dark,
      contrastText: theme.colors.white,
    },
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
    info: theme.colors.info,
    text: {
      primary: theme.colors.neutral[800],
      secondary: theme.colors.neutral[600],
      disabled: theme.colors.neutral[400],
    },
    background: {
      default: theme.colors.neutral[100],
     paper: theme.colors.white,
    },
  },
  typography: {
    fontFamily: theme.typography.fontFamily.primary,
    h1: theme.typography.h1,
    h2: theme.typography.h2,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle1: theme.typography.subtitle1,
    subtitle2: theme.typography.subtitle2,
    body1: theme.typography.body1,
    body2: theme.typography.body2,
    caption: theme.typography.caption,
    overline: theme.typography.overline,
  },
  spacing: theme.spacing,
  shape: {
    borderRadius: theme.borderRadius.md,
  },
  shadows: [
    theme.shadows.none,
    theme.shadows.xs,
    theme.shadows.sm,
    theme.shadows.md,
    theme.shadows.lg,
    theme.shadows.xl,
    theme.shadows.xxl,
    theme.shadows.primaryShadow,
    theme.shadows.primaryHover,
    theme.shadows.secondaryShadow,
    theme.shadows.secondaryHover,
    theme.shadows.errorShadow,
    theme.shadows.errorHover,
    theme.shadows.successShadow,
    theme.shadows.successHover,
  ],
  transitions: {
    easing: theme.animations.easing,
    duration: theme.animations.duration,
  },
  components: {
    // Override MUI Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.lg,
          textTransform: 'none',
          fontWeight: theme.typography.fontWeight.medium,
          transition: theme.animations.buttonHover,
        },
        containedPrimary: theme.components.button.primary,
        outlined: theme.components.button.outlined,
        outlinedPrimary: theme.components.button.outlinedPrimary,
        containedError: theme.components.button.danger,
      },
    },
    // Override MUI Table
    MuiTableContainer: {
      styleOverrides: {
        root: theme.components.table.container,
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: theme.components.table.head,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: theme.components.table.cell,
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: theme.components.table.row,
      },
    },
    // Override MUI Card
    MuiCard: {
      styleOverrides: {
        root: theme.components.card.main,
      },
    },
    // Override MUI Chip
    MuiChip: {
      styleOverrides: {
        root: theme.components.chip.category,
      },
    },
    // Override MUI Dialog
    MuiDialog: {
      styleOverrides: {
        paper: theme.components.dialog.paper,
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: theme.components.dialog.title,
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: theme.components.dialog.content,
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: theme.components.dialog.actions,
      },
    },
    // Override MUI TextField
    MuiTextField: {
      styleOverrides: {
        root: theme.components.input.textField,
      },
    },
    // Override MUI Select
    MuiSelect: {
      styleOverrides: {
        root: theme.components.input.select,
      },
    },
    // Override MUI CircularProgress
    MuiCircularProgress: {
      styleOverrides: {
        root: theme.components.progress.primary,
      },
    },
    // Override MUI Switch
    MuiSwitch: {
      styleOverrides: {
        root: theme.components.switch.default,
      },
    },
    // Override MUI Checkbox
    MuiCheckbox: {
      styleOverrides: {
        root: theme.components.checkbox.default,
      },
    },
    // Override MUI Menu
    MuiMenu: {
      styleOverrides: {
        paper: theme.components.menu.paper,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: theme.components.menu.item,
      },
    },
  },
  ...theme,
});

export default muiTheme;