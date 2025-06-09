"use client"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { createAppleTheme } from "./apple-theme.js"

export function AppleThemeProvider({ children }) {
  const appleTheme = createTheme(createAppleTheme())

  return (
    <MuiThemeProvider theme={appleTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export default AppleThemeProvider
