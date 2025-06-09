"use client"

import { useTheme } from "@mui/material/styles"
import { appleColors, appleGradients, appleShadows, appleBorderRadius, appleSpacing } from "./apple-theme.js"
import { appleComponentStyles } from "./theme-components.js"

// Hook để sử dụng Apple theme
export const useAppleTheme = () => {
  const muiTheme = useTheme()
console.log("appleColors:", appleColors); // Debug
  return {
    // Material-UI theme
    mui: muiTheme,

    // Apple colors
    colors: appleColors,

    // Apple gradients
    gradients: appleGradients,

    // Apple shadows
    shadows: appleShadows,

    // Apple border radius
    borderRadius: appleBorderRadius,

    // Apple spacing
    spacing: appleSpacing,

    // Pre-built component styles
    components: appleComponentStyles,
  }
}

// Hook để tạo style nhanh
export const useAppleStyles = () => {
  const theme = useAppleTheme()

  return {
    // Card styles
    card: (variant = "main") => theme.components.card[variant],

    // Button styles
    button: (variant = "primary") => theme.components.button[variant],

    // Input styles
    input: (variant = "default") => theme.components.input[variant],

    // Header styles
    header: (variant = "primary") => theme.components.header[variant],

    // Icon container styles
    iconContainer: (variant = "primary") => theme.components.iconContainer[variant],

    // Status styles
    status: (variant = "success") => theme.components.status[variant],

    // Gradient background
    gradientBg: (color = "primary") => ({
      background: theme.gradients[color],
    }),

    // Shadow
    shadow: (size = "md") => ({
      boxShadow: theme.shadows[size],
    }),

    // Border radius
    rounded: (size = "md") => ({
      borderRadius: theme.borderRadius[size],
    }),

    // Spacing
    spacing: (size) => theme.spacing[size],
  }
}

export default useAppleTheme
