import { colors, gradients, shadows, typography, animations, spacing, borderRadius } from './theme';

export const textStyles = {
  heading: {
    color: colors.neutral[900],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.primary,
  },
  subheading: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.primary,
  },
  body: {
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.normal,
    fontFamily: typography.fontFamily.secondary,
  },
  bodyEmphasis: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  caption: {
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.normal,
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.sm,
  },
  label: {
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.sm,
  },
  primary: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  secondary: {
    color: colors.secondary.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  success: {
    color: colors.success.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  error: {
    color: colors.error.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  warning: {
    color: colors.warning.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  info: {
    color: colors.info.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
  },
  disabled: {
    color: colors.neutral[400],
    fontWeight: typography.fontWeight.normal,
    fontFamily: typography.fontFamily.secondary,
  },
  link: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.secondary,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: colors.primary.dark,
      textDecoration: 'underline',
    },
  },
};

// Login styles
export const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradients.neutral,
    padding: spacing[4],
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    borderRadius: borderRadius.lg,
    background: gradients.card,
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 128,
    height: 128,
    borderRadius: borderRadius.full,
    bgcolor: colors.white,
    padding: spacing[2],
    boxShadow: shadows.lg,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    padding: `${spacing[20]} ${spacing[6]} ${spacing[6]}`,
    textAlign: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.neutral[900],
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body1,
    color: colors.neutral[600],
    marginBottom: spacing[8],
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    margin: `${spacing[6]} 0`,
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: colors.neutral[300],
  },
  dividerText: {
    ...typography.caption,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  input: {
    marginBottom: spacing[4],
    '& .MuiOutlinedInput-root': {
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: colors.neutral[50],
      border: `1px solid ${colors.neutral[300]}`,
      '&:hover': {
        borderColor: colors.primary.main,
        backgroundColor: colors.white,
      },
      '&:focus-within': {
        borderColor: colors.primary.main,
        backgroundColor: colors.white,
        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
      },
      '& input': {
        ...typography.body2,
        padding: `${spacing[3]} ${spacing[4]}`,
      },
    },
    '& .MuiInputLabel-root': {
      ...typography.body2,
      color: colors.neutral[600],
      '&.Mui-focused': {
        color: colors.primary.main,
      },
    },
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: borderRadius.lg,
    background: gradients.primary,
    color: colors.white,
    ...typography.subtitle2,
    textTransform: 'none',
    boxShadow: shadows.primaryShadow,
    border: 'none',
    cursor: 'pointer',
    transition: animations.buttonHover,
    '&:hover': {
      background: gradients.primary,
      boxShadow: shadows.primaryHover,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      background: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  googleButton: {
    width: '100%',
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[300]}`,
    color: colors.neutral[700],
    ...typography.subtitle2,
    textTransform: 'none',
    cursor: 'pointer',
    transition: animations.buttonHover,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    '&:hover': {
      borderColor: colors.primary.main,
      backgroundColor: colors.primary[50],
      color: colors.primary.main,
    },
  },
  linkButton: {
    color: colors.primary.main,
    ...typography.subtitle2,
    textTransform: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: animations.transition,
    '&:hover': {
      color: colors.primary.dark,
      textDecoration: 'underline',
    },
  },
  footer: {
    marginTop: spacing[6],
    padding: spacing[4],
    textAlign: 'center',
    borderTop: `1px solid ${colors.neutral[200]}`,
    backgroundColor: colors.neutral[50],
  },
};

// Avatar styles
export const avatarStyles = {
  small: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...typography.caption,
    fontWeight: typography.fontWeight.medium,
  },
  medium: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...typography.body2,
    fontWeight: typography.fontWeight.medium,
  },
  large: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...typography.body1,
    fontWeight: typography.fontWeight.medium,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    background: gradients.secondary,
  },
};

// Menu styles
export const menuStyles = {
  paper: {
    borderRadius: borderRadius.md,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
  },
  item: {
    padding: `${spacing[2]} ${spacing[4]}`,
    minWidth: 200,
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
    transition: animations.transition,
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    background: gradients.primary,
    color: colors.white,
    borderRadius: borderRadius.lg,
    padding: `${spacing[2]} ${spacing[4]}`,
    boxShadow: shadows.primaryShadow,
    textTransform: 'none',
    fontWeight: typography.fontWeight.medium,
    ...typography.subtitle2,
    '&:hover': {
      background: gradients.primary,
      boxShadow: shadows.primaryHover,
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      background: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
    },
    transition: animations.buttonHover,
  },
  outlined: {
    borderColor: colors.neutral[400],
    color: colors.neutral[700],
    borderRadius: borderRadius.lg,
    padding: `${spacing[2]} ${spacing[4]}`,
    textTransform: 'none',
    fontWeight: typography.fontWeight.medium,
    ...typography.subtitle2,
    '&:hover': {
      borderColor: colors.neutral[800],
      color: colors.neutral[800],
      background: colors.neutral[50],
    },
    '&:disabled': {
      borderColor: colors.neutral[400],
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
    transition: animations.buttonHover,
  },
  outlinedPrimary: {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    borderRadius: borderRadius.lg,
    padding: `${spacing[1]} ${spacing[3]}`,
    textTransform: 'none',
    fontWeight: typography.fontWeight.medium,
    ...typography.caption,
    '&:hover': {
      borderColor: colors.primary.main,
      background: colors.primary[50],
    },
    '&:disabled': {
      borderColor: colors.neutral[400],
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
    transition: animations.buttonHover,
  },
  danger: {
    background: gradients.error,
    color: colors.white,
    borderRadius: borderRadius.lg,
    padding: `${spacing[2]} ${spacing[4]}`,
    boxShadow: shadows.errorShadow,
    textTransform: 'none',
    fontWeight: typography.fontWeight.medium,
    ...typography.subtitle2,
    '&:hover': {
      background: gradients.error,
      boxShadow: shadows.errorHover,
      transform: 'translateY(-2px)',
    },
    transition: animations.buttonHover,
  },
  iconButton: {
    color: colors.primary.main,
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
    transition: animations.buttonHover,
  },
  dangerIconButton: {
    color: colors.error.main,
    '&:hover': {
      backgroundColor: colors.error[50],
    },
    '&:disabled': {
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
    transition: animations.buttonHover,
  },
};

// Card styles
export const cardStyles = {
  main: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    background: gradients.card,
  },
  login: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral[200]}`,
    background: gradients.card,
  },
  header: {
    padding: spacing[4],
    background: gradients.primary,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    color: colors.white,
    ...typography.h6,
  },
};

// Image styles
export const imageStyles = {
  container: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.md,
    transition: animations.transition,
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: shadows.lg,
    },
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    background: gradients.neutral,
    border: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: animations.transition,
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.2)',
      opacity: 1,
    },
  },
};

// Table styles
export const tableStyles = {
  container: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.md,
    overflow: 'auto',
    maxHeight: 800,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: colors.neutral[100],
      borderRadius: borderRadius.sm,
    },
    '&::-webkit-scrollbar-thumb': {
      background: colors.primary[300],
      borderRadius: borderRadius.sm,
      '&:hover': {
        background: colors.primary[500],
      },
    },
  },
  head: {
    backgroundColor: colors.primary[50],
    '&.category': {
      backgroundColor: colors.secondary[50],
    },
    '& .MuiTableCell-root': {
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral[800],
      padding: spacing[3],
      fontSize: typography.fontSize.sm,
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
  },
  cell: {
    padding: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
  },
  row: {
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
    transition: animations.tableHover,
  },
  empty: {
    padding: spacing[6],
    textAlign: 'center',
    color: colors.neutral[400],
    fontSize: typography.fontSize.sm,
  },
};

// Chip styles
export const chipStyles = {
  category: {
    height: 24,
    fontSize: typography.fontSize.xs,
    backgroundColor: colors.secondary[50],
    color: colors.secondary.main,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.sm,
    '& .MuiChip-label': { padding: `0 ${spacing[2]}` },
  },
  empty: {
    height: 24,
    fontSize: typography.fontSize.xs,
    backgroundColor: colors.neutral[100],
    color: colors.neutral[400],
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.sm,
  },
  voucherStatus: {
    height: 24,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.sm,
  },
  pagination: {
    color: colors.neutral[800],
    fontSize: typography.fontSize.sm,
    '& .MuiTablePagination-selectLabel': {
      fontFamily: typography.body2.fontFamily,
      fontWeight: typography.fontWeight.medium,
    },
    '& .MuiTablePagination-displayedRows': {
      fontFamily: typography.body2.fontFamily,
      fontWeight: typography.fontWeight.medium,
    },
    '& .MuiTablePagination-actions': {
      '& .MuiIconButton-root': {
        color: colors.primary.main,
        '&:hover': {
          backgroundColor: colors.primary[50],
        },
        '&.Mui-disabled': {
          color: colors.neutral[400],
        },
      },
    },
  },
};

// Dialog styles
export const dialogStyles = {
  paper: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
    background: gradients.dialog,
    overflow: 'hidden',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    padding: spacing[4],
    background: gradients.dialogHeader,
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.h6.fontFamily,
    fontSize: typography.fontSize.lg,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  titleError: {
    padding: spacing[4],
    background: gradients.dialogHeaderError,
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.h6.fontFamily,
    fontSize: typography.fontSize.lg,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  content: {
    padding: spacing[4],
    marginTop: spacing[2],
  },
  actions: {
    padding: spacing[4],
    borderTop: `1px solid ${colors.neutral[200]}`,
  },
};

// Input styles
export const inputStyles = {
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: borderRadius.md,
      height: 40,
      display: 'flex',
      alignItems: 'center', // canh giữa nội dung theo chiều dọc
      '& input': {
        padding: '10px 14px', // canh giữa chữ gợi ý (hint text)
        height: '100%',
        boxSizing: 'border-box',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      top: '-5px', // điều chỉnh label mặc định
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: colors.primary.main,
    },
  },
  // giữ nguyên các phần còn lại
  select: {
    textField: {
      '& .MuiInputBase-root': {
        height: '40px',
      },
    },
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputLabel-root': {
      lineHeight: '1.2',
      top: '-2px',
    },
  },
  datePicker: {
    marginBottom: spacing[4],
    '& .MuiOutlinedInput-root': {
      borderRadius: borderRadius.md,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: colors.primary.main,
    },
  },
  disabled: {
    '& .MuiOutlinedInput-root': {
      borderRadius: borderRadius.md,
      backgroundColor: colors.neutral[100],
    },
  },
};


// Progress styles
export const progressStyles = {
  primary: {
    color: colors.primary.main,
  },
  white: {
    color: colors.white,
  },
};

// Switch styles
export const switchStyles = {
  default: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: colors.primary.main,
      '&:hover': {
        backgroundColor: colors.primary[50],
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: colors.primary.main,
    },
  },
};

// Checkbox styles
export const checkboxStyles = {
  default: {
    color: colors.primary.main,
    '&.Mui-checked': {
      color: colors.primary.main,
    },
  },
};

// Box styles
export const boxStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  buttonGroup: {
    display: 'flex',
    gap: spacing[2],
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  sizeContainer: {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'center',
    marginBottom: spacing[3],
    padding: spacing[3],
    borderRadius: borderRadius.md,
    background: colors.primary[50],
    border: `1px solid ${colors.neutral[200]}`,
  },
};