import { useTheme } from "@mui/material/styles";
import {
  appleColors,
  appleGradients,
  appleShadows,
  appleBorderRadius,
  appleSpacing,
  appleTypography,
} from "./apple-theme.js";
import { appleComponentStyles } from "./theme-components.js";

// Hook để sử dụng Apple theme
export const useAppleTheme = () => {
  const muiTheme = useTheme();
  // console.log("appleBorderRadius:", appleBorderRadius); // Debug

  const theme = {
    mui: muiTheme,
    colors: appleColors,
    gradients: appleGradients,
    shadows: appleShadows,
    borderRadius: appleBorderRadius,
    spacing: appleSpacing,
    typography: appleTypography,
    components: appleComponentStyles,
  };
  // console.log("useAppleTheme output:", theme); // Debug toàn bộ theme
  return theme;
};

// Hook để tạo style nhanh
export const useAppleStyles = () => {
  const theme = useAppleTheme();
  // console.log("theme in useAppleStyles:", theme); // Debug

  // if (!theme.borderRadius || !theme.colors) {
  //   console.error("theme.borderRadius or theme.colors is undefined", theme);
  // }

  return {
    ...theme, // Trả về toàn bộ theme
    card: (variant = "main") => theme.components.card[variant],
    button: (variant = "primary") => theme.components.button[variant],
    input: (variant = "default") => theme.components.input[variant],
    header: (variant = "primary") => theme.components.header[variant],
    iconContainer: (variant = "primary") =>
      theme.components.iconContainer[variant],
    status: (variant = "success") => theme.components.status[variant],
    gradientBg: (color = "primary") => theme.gradients[color],
    shadow: (size = "md") => theme.shadows[size],
    rounded: (size = "md") => theme.borderRadius[size],
    spacing: (size) => theme.spacing[size],
    color: (name = "primary") => theme.colors[name],
  };
};

export default useAppleTheme;
