// ./src/styles/components.js

import { colors, gradients, shadows, typography, animations } from "./themes";

// Trong src/styles/components.js
export const loginStyles = {
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 128,
    height: 128,
    borderRadius: '50%',
    bgcolor: colors.white,
    p: 0.5,
    boxShadow: shadows.medium,
    zIndex: 2,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Đảm bảo hình ảnh không tràn ra ngoài
  },
  dividerLine: {
    width: 48,
    height: 1,
    bgcolor: colors.primary.main,
  },
  linkButton: {
    color: colors.primary.main,
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      color: colors.primary.dark,
    },
    transition: animations.transition,
  },
  input: {
    height: 40,
    borderRadius: 2,
    borderColor: colors.neutral[400],
    background: colors.neutral[100],
    '&:hover': {
      borderColor: colors.primary.main,
    },
    '&:focus': {
      borderColor: colors.primary.main,
      borderWidth: 2,
    },
  },
  googleButton: {
    height: 40,
    borderRadius: 28,
    borderColor: colors.neutral[400],
    color: colors.neutral[800],
    background: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    '&:hover': {
      borderColor: colors.primary.main,
      background: 'rgba(0, 113, 227, 0.05)',
    },
    transition: animations.transition,
  },
};

// Style cho avatar
export const avatarStyles = {
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: gradients.secondary,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    overflow: "hidden",
    background: colors.neutral[100],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// Style cho menu
export const menuStyles = {
  paper: {
    borderRadius: 3,
    boxShadow: shadows.large,
    border: "1px solid rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  item: {
    py: 1.5,
    px: 2,
    minWidth: 200,
    "&:hover": {
      backgroundColor: "rgba(0, 113, 227, 0.05)",
    },
  },
};

// Style cho button
export const buttonStyles = {
  primary: {
    background: gradients.primary,
    color: colors.white,
    borderRadius: 28,
    px: 3,
    boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      background: gradients.primary,
      boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      background: "rgba(0, 113, 227, 0.3)",
      color: colors.white,
      cursor: "not-allowed",
    },
    transition: animations.transition,
  },
  outlined: {
    borderColor: colors.neutral[400],
    color: colors.neutral[400],
    borderRadius: 28,
    px: 3,
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      borderColor: colors.neutral[800],
      color: colors.neutral[800],
      background: "rgba(0, 0, 0, 0.05)",
    },
    "&:disabled": {
      borderColor: colors.neutral[400],
      color: colors.neutral[400],
      cursor: "not-allowed",
    },
    transition: animations.transition,
  },
  outlinedPrimary: {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    borderRadius: 28,
    px: 2,
    py: 0.5,
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.75rem",
    "&:hover": {
      borderColor: colors.primary.main,
      background: "rgba(0, 113, 227, 0.05)",
    },
    "&:disabled": {
      borderColor: colors.neutral[400],
      color: colors.neutral[400],
      cursor: "not-allowed",
    },
    transition: animations.transition,
  },
  danger: {
    background: gradients.error,
    color: colors.white,
    borderRadius: 28,
    px: 3,
    boxShadow: "0 4px 12px rgba(255, 59, 48, 0.2)",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      background: gradients.error,
      boxShadow: "0 6px 16px rgba(255, 59, 48, 0.3)",
      transform: "translateY(-2px)",
    },
    transition: animations.transition,
  },
  iconButton: {
    color: colors.primary.main,
    "&:hover": {
      backgroundColor: "rgba(0, 113, 227, 0.1)",
    },
  },
  dangerIconButton: {
    color: colors.error.main,
    "&:hover": {
      backgroundColor: "rgba(255, 59, 48, 0.1)",
    },
    "&:disabled": {
      color: colors.neutral[400],
      cursor: "not-allowed",
    },
  },
};

// Style cho card
export const cardStyles = {
  main: {
    borderRadius: 4,
    boxShadow: shadows.large,
    border: "1px solid rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  login: {
    borderRadius: 4,
    boxShadow: shadows.large,
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  headerBlue: {
    p: 3,
    background: gradients.headerBlue,
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  },
  headerPink: {
    p: 3,
    background: gradients.headerPink,
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 2,
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// Style cho hình ảnh
export const imageStyles = {
  container: {
    position: "relative",
    width: 64,
    height: 64,
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: shadows.medium,
    transition: animations.transition,
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: shadows.hover,
    },
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 3,
    background: gradients.neutral,
    border: "1px solid rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: animations.transition,
    "&:hover": {
      background: "rgba(0, 0, 0, 0.2)",
      opacity: 1,
    },
  },
};

// Style cho table
export const tableStyles = {
  container: {
    backgroundColor: "transparent",
    boxShadow: "none",
    border: `1px solid rgba(0, 0, 0, 0.05)`,
    borderRadius: 3,
    overflow: "auto",
    maxHeight: 800,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0, 0, 0, 0.05)",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0, 113, 227, 0.3)",
      borderRadius: "3px",
      "&:hover": {
        background: "rgba(0, 113, 227, 0.5)",
      },
    },
  },
  head: {
    backgroundColor: "rgba(0, 113, 227, 0.05)",
    "&.category": {
      backgroundColor: "rgba(156, 39, 176, 0.05)",
    },
    "& .MuiTableCell-root": {
      fontWeight: 600,
      color: colors.neutral[800],
      py: 1.5,
      fontSize: "0.75rem",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  },
  cell: {
    py: 1,
    fontSize: "0.75rem",
    color: colors.neutral[800],
    fontWeight: 500,
  },
  row: {
    "&:hover": {
      backgroundColor: "rgba(0, 113, 227, 0.05)",
    },
    transition: animations.tableHover,
  },
  empty: {
    py: 4,
    textAlign: "center",
    color: colors.neutral[400],
    fontSize: "0.875rem",
  },
};

// Style cho chip
export const chipStyles = {
  category: {
    height: 24,
    fontSize: "0.75rem",
    backgroundColor: "rgba(156, 39, 176, 0.1)",
    color: colors.secondary.main,
    fontWeight: 500,
    borderRadius: 2,
    "& .MuiChip-label": { px: 1 },
  },
  empty: {
    height: 24,
    fontSize: "0.75rem",
    backgroundColor: "rgba(142, 142, 147, 0.1)",
    color: colors.neutral[400],
    fontWeight: 500,
    borderRadius: 2,
  },
  voucherStatus: {
    height: 24,
    fontSize: "0.7rem",
    fontWeight: 500,
    borderRadius: 4,
  },
  pagination: {
    color: colors.neutral[800],
    fontSize: "0.875rem",
    "& .MuiTablePagination-selectLabel": {
      fontFamily: typography.body2.fontFamily,
      fontWeight: 500,
    },
    "& .MuiTablePagination-displayedRows": {
      fontFamily: typography.body2.fontFamily,
      fontWeight: 500,
    },
    "& .MuiTablePagination-actions": {
      "& .MuiIconButton-root": {
        color: colors.primary.main,
        "&:hover": {
          backgroundColor: "rgba(0, 113, 227, 0.1)",
        },
        "&.Mui-disabled": {
          color: colors.neutral[400],
        },
      },
    },
  },
};

// Style cho dialog
export const dialogStyles = {
  paper: {
    borderRadius: 4,
    boxShadow: shadows.large,
    background: gradients.dialog,
    overflow: "hidden",
    maxWidth: 400,
    width: "100%",
  },
  title: {
    p: 3,
    background: gradients.dialogHeader,
    color: colors.neutral[800],
    fontWeight: 600,
    fontFamily: typography.h6.fontFamily,
    fontSize: "1.1rem",
    borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  titleError: {
    p: 3,
    background: gradients.dialogHeaderError,
    color: colors.neutral[800],
    fontWeight: 600,
    fontFamily: typography.h6.fontFamily,
    fontSize: "1.1rem",
    borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  content: {
    p: 3,
    mt: 2,
  },
  actions: {
    p: 3,
    borderTop: `1px solid rgba(0, 0, 0, 0.05)`,
  },
};

// Style cho input
export const inputStyles = {
  textField: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      height: 40,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
        borderWidth: 2,
      },
      "& .MuiInputBase-input": {
        fontSize: "0.875rem",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.primary.main,
    },
  },
  select: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.primary.main,
    },
  },
  datePicker: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.primary.main,
    },
  },
  disabled: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "rgba(0, 0, 0, 0.03)",
    },
  },
};

// Style cho progress indicator
export const progressStyles = {
  primary: {
    color: colors.primary.main,
  },
  white: {
    color: colors.white,
  },
};

// Style cho switch
export const switchStyles = {
  default: {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: colors.primary.main,
      "&:hover": {
        backgroundColor: "rgba(0, 113, 227, 0.08)",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: colors.primary.main,
    },
  },
};

// Style cho checkbox
export const checkboxStyles = {
  default: {
    color: colors.primary.main,
    "&.Mui-checked": {
      color: colors.primary.main,
    },
  },
};

// Thêm vào cuối file ./src/styles/components.js

export const boxStyles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
  },
  buttonGroup: {
    display: "flex",
    gap: 2,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    mb: 3,
  },
  sizeContainer: {
    display: "flex",
    gap: 2,
    alignItems: "center",
    mb: 2,
    p: 2,
    borderRadius: 2,
    background: "rgba(0, 113, 227, 0.05)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
};
