import { colors } from './colors';

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[300]} 100%)`,
  success: `linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[300]} 100%)`,
  error: `linear-gradient(135deg, ${colors.error[500]} 0%, ${colors.error[400]} 100%)`,
  warning: `linear-gradient(135deg, ${colors.warning[500]} 0%, ${colors.warning[300]} 100%)`,
  info: `linear-gradient(135deg, ${colors.info[500]} 0%, ${colors.info[300]} 100%)`,
  neutral: `linear-gradient(135deg, ${colors.neutral[100]} 0%, ${colors.neutral[200]} 100%)`,
  card: `linear-gradient(135deg, ${colors.white} 0%, ${colors.neutral[50]} 100%)`,
  dialog: `linear-gradient(135deg, ${colors.white} 0%, ${colors.neutral[50]} 100%)`,
  dialogHeader: `linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(0, 113, 227, 0.12) 100%)`,
  dialogHeaderError: `linear-gradient(135deg, rgba(255, 59, 48, 0.08) 0%, rgba(255, 59, 48, 0.12) 100%)`,
  dialogHeaderSuccess: `linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(52, 199, 89, 0.12) 100%)`,
  primaryHover: `linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(0, 113, 227, 0.12) 100%)`,
};