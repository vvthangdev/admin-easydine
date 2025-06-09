import { appleColors, appleGradients, appleShadows, appleBorderRadius, appleSpacing } from "./apple-theme.js"

// Pre-built component styles
export const appleComponentStyles = {
  // Card styles
  card: {
    main: {
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
    gradient: {
      borderRadius: appleBorderRadius.card,
      background: appleGradients.primary,
      color: "white",
      boxShadow: appleShadows.button,
      border: "none",
    },
    glass: {
      borderRadius: appleBorderRadius.card,
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: appleShadows.card,
    },
  },

  // Button styles
  button: {
    primary: {
      background: appleGradients.primary,
      color: "white",
      borderRadius: appleBorderRadius.button,
      padding: `${appleSpacing[3]} ${appleSpacing[6]}`,
      fontWeight: 600,
      textTransform: "none",
      boxShadow: appleShadows.button,
      border: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: "linear-gradient(135deg, #005bb5 0%, #004494 100%)",
        transform: "translateY(-2px)",
        boxShadow: appleShadows.hover,
      },
    },
    secondary: {
      background: appleGradients.secondary,
      color: "white",
      borderRadius: appleBorderRadius.button,
      padding: `${appleSpacing[3]} ${appleSpacing[6]}`,
      fontWeight: 600,
      textTransform: "none",
      boxShadow: appleShadows.sm,
      border: "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
        transform: "translateY(-2px)",
        boxShadow: appleShadows.lg,
      },
    },
    outline: {
      background: "transparent",
      color: appleColors.primary.main,
      borderRadius: appleBorderRadius.button,
      padding: `${appleSpacing[3]} ${appleSpacing[6]}`,
      fontWeight: 600,
      textTransform: "none",
      border: `2px solid ${appleColors.primary.main}`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: appleColors.primary.main,
        color: "white",
        transform: "translateY(-2px)",
        boxShadow: appleShadows.button,
      },
    },
    ghost: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "white",
      borderRadius: appleBorderRadius.button,
      padding: `${appleSpacing[3]} ${appleSpacing[6]}`,
      fontWeight: 600,
      textTransform: "none",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-2px)",
      },
    },
  },

  // Input styles
  input: {
    default: {
      borderRadius: appleBorderRadius.input,
      backgroundColor: appleColors.background.light,
      border: `1px solid ${appleColors.neutral[200]}`,
      padding: `${appleSpacing[3]} ${appleSpacing[4]}`,
      fontSize: "1rem",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: appleColors.background.paper,
        borderColor: appleColors.primary.light,
      },
      "&:focus": {
        backgroundColor: appleColors.background.paper,
        borderColor: appleColors.primary.main,
        borderWidth: "2px",
        outline: "none",
        boxShadow: `0 0 0 3px ${appleColors.primary.main}20`,
      },
    },
    search: {
      borderRadius: appleBorderRadius.button,
      backgroundColor: appleColors.background.light,
      border: `1px solid ${appleColors.neutral[200]}`,
      padding: `${appleSpacing[3]} ${appleSpacing[4]}`,
      fontSize: "1rem",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: appleColors.background.paper,
      },
      "&:focus": {
        backgroundColor: appleColors.background.paper,
        borderColor: appleColors.primary.main,
        outline: "none",
        boxShadow: appleShadows.sm,
      },
    },
  },

  // Header styles
  header: {
    primary: {
      background: appleGradients.primary,
      color: "white",
      padding: appleSpacing[6],
      borderRadius: appleBorderRadius.card,
      boxShadow: appleShadows.button,
      marginBottom: appleSpacing[6],
    },
    secondary: {
      background: appleGradients.secondary,
      color: "white",
      padding: appleSpacing[6],
      borderRadius: appleBorderRadius.card,
      boxShadow: appleShadows.lg,
      marginBottom: appleSpacing[6],
    },
    glass: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      color: "white",
      padding: appleSpacing[6],
      borderRadius: appleBorderRadius.card,
      border: "1px solid rgba(255, 255, 255, 0.2)",
      marginBottom: appleSpacing[6],
    },
  },

  // Table styles
  table: {
    container: {
      borderRadius: appleBorderRadius.card,
      overflow: "hidden",
      boxShadow: appleShadows.card,
      border: "1px solid rgba(0, 0, 0, 0.05)",
    },
    header: {
      backgroundColor: appleColors.background.light,
      fontWeight: 600,
      color: appleColors.text.primary,
      padding: appleSpacing[4],
    },
    row: {
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: appleColors.background.light,
        transform: "scale(1.001)",
      },
    },
    cell: {
      padding: appleSpacing[4],
      borderBottom: `1px solid ${appleColors.neutral[100]}`,
    },
  },

  // Modal styles
  modal: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
    },
    content: {
      borderRadius: appleBorderRadius.modal,
      boxShadow: appleShadows["2xl"],
      border: "none",
      background: appleColors.background.paper,
      maxWidth: "90vw",
      maxHeight: "90vh",
    },
    header: {
      background: appleGradients.primary,
      color: "white",
      padding: appleSpacing[6],
      borderRadius: `${appleBorderRadius.modal} ${appleBorderRadius.modal} 0 0`,
      marginBottom: 0,
    },
  },

  // Icon container styles
  iconContainer: {
    primary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: appleBorderRadius.lg,
      background: appleGradients.primary,
      color: "white",
      boxShadow: appleShadows.button,
    },
    secondary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: appleBorderRadius.lg,
      background: appleGradients.secondary,
      color: "white",
      boxShadow: appleShadows.lg,
    },
    glass: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: appleBorderRadius.lg,
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
  },

  // Status styles
  status: {
    success: {
      backgroundColor: appleColors.success,
      color: "white",
      padding: `${appleSpacing[1]} ${appleSpacing[3]}`,
      borderRadius: appleBorderRadius.button,
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    warning: {
      backgroundColor: appleColors.warning,
      color: "white",
      padding: `${appleSpacing[1]} ${appleSpacing[3]}`,
      borderRadius: appleBorderRadius.button,
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    error: {
      backgroundColor: appleColors.error,
      color: "white",
      padding: `${appleSpacing[1]} ${appleSpacing[3]}`,
      borderRadius: appleBorderRadius.button,
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    info: {
      backgroundColor: appleColors.info,
      color: "white",
      padding: `${appleSpacing[1]} ${appleSpacing[3]}`,
      borderRadius: appleBorderRadius.button,
      fontSize: "0.875rem",
      fontWeight: 500,
    },
  },
}

export default appleComponentStyles
