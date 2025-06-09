import { colors } from './themes/colors';
import { gradients } from './themes/gradients';
import { shadows } from './themes/shadows';
import { typography } from './themes/typography';
import { animations } from './themes/animations';
import { spacing } from './themes/spacing';
import { borderRadius } from './themes/borderRadius';
import { breakpoints } from './themes/breakpoints';
import { zIndex } from './themes/zIndex';
import {
  loginStyles,
  avatarStyles,
  menuStyles,
  buttonStyles,
  cardStyles,
  imageStyles,
  tableStyles,
  chipStyles,
  dialogStyles,
  inputStyles,
  progressStyles,
  switchStyles,
  checkboxStyles,
  boxStyles,
  textStyles,
} from './components';

// Unified theme object
export const theme = {
  colors,
  gradients,
  shadows,
  typography,
  animations,
  spacing,
  borderRadius,
  breakpoints,
  zIndex,
  components: {
    login: loginStyles,
    avatar: avatarStyles,
    menu: menuStyles,
    button: buttonStyles,
    card: cardStyles,
    image: imageStyles,
    table: tableStyles,
    chip: chipStyles,
    dialog: dialogStyles,
    input: inputStyles,
    progress: progressStyles,
    switch: switchStyles,
    checkbox: checkboxStyles,
    box: boxStyles,
    text: textStyles,
  },
};

// Individual exports for convenience
export {
  colors,
  gradients,
  shadows,
  typography,
  animations,
  spacing,
  borderRadius,
  breakpoints,
  zIndex,
  loginStyles,
  avatarStyles,
  menuStyles,
  buttonStyles,
  cardStyles,
  imageStyles,
  tableStyles,
  chipStyles,
  dialogStyles,
  inputStyles,
  progressStyles,
  switchStyles,
  checkboxStyles,
  boxStyles,
  textStyles,
};