import { createTheme, alpha } from '@mui/material/styles';

// Matrix-inspired color palette
const matrixColors = {
  primary: '#00ff00', // Bright green
  secondary: '#003300', // Dark green
  background: '#000000', // Black
  text: '#00ff00', // Bright green
  cardBg: '#001100', // Very dark green
  chipBg: '#002200', // Dark green
  error: '#ff0000', // Red for errors
  warning: '#ffff00', // Yellow for warnings
  success: '#00ff00', // Green for success
};

export const matrixTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: matrixColors.primary,
      light: alpha(matrixColors.primary, 0.7),
      dark: matrixColors.secondary,
    },
    background: {
      default: matrixColors.background,
      paper: matrixColors.cardBg,
    },
    text: {
      primary: matrixColors.text,
      secondary: alpha(matrixColors.text, 0.7),
    },
    error: {
      main: matrixColors.error,
    },
    warning: {
      main: matrixColors.warning,
    },
    success: {
      main: matrixColors.success,
    },
  },
  typography: {
    fontFamily: '"Courier New", monospace',
    h1: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: matrixColors.cardBg,
          border: `1px solid ${alpha(matrixColors.primary, 0.3)}`,
          boxShadow: `0 0 10px ${alpha(matrixColors.primary, 0.2)}`,
          '&:hover': {
            boxShadow: `0 0 20px ${alpha(matrixColors.primary, 0.4)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: matrixColors.chipBg,
          border: `1px solid ${alpha(matrixColors.primary, 0.3)}`,
          '& .MuiChip-label': {
            fontFamily: '"Courier New", monospace',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Courier New", monospace',
          textTransform: 'none',
          border: `1px solid ${alpha(matrixColors.primary, 0.3)}`,
          '&:hover': {
            background: alpha(matrixColors.primary, 0.1),
            border: `1px solid ${matrixColors.primary}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(matrixColors.primary, 0.3),
            },
            '&:hover fieldset': {
              borderColor: matrixColors.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: matrixColors.primary,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(matrixColors.primary, 0.1),
        },
        bar: {
          background: `linear-gradient(90deg, ${matrixColors.primary} 0%, ${alpha(matrixColors.primary, 0.7)} 100%)`,
        },
      },
    },
  },
}); 