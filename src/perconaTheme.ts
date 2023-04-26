import { ThemeOptions } from '@mui/material';
import merge from 'lodash.merge';

const commonTheme: ThemeOptions = {
  typography: {
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === 'subtitle1' && {
            color: theme.palette.text.secondary,
            opacity: 0.75,
            fontSize: 19,
            fontWeight: 500,
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9em',
          textTransform: 'none',
        },
        outlined: {
          '&:hover': {
            borderWidth: 2,
          },
          borderWidth: 2,
        },
      },
    },
  },
};

export const perconaLightTheme: ThemeOptions = merge(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#774faa',
      },
      secondary: {
        main: '#f5cc78',
        light: '#F0F1F4',
      },
      success: {
        main: '#A0EADC',
        dark: '#1A7362',
        contrastText: '#0B322A',
      },
      error: {
        main: '#FFCCC5',
        dark: '#9F0000',
        contrastText: '#522625',
      },
      info: {
        main: '#B6D9FF',
        dark: '#0B4A8C',
        contrastText: '#0C335D',
      },
      warning: {
        main: '#FAE7C1',
        dark: '#AA7F26',
        contrastText: '#42361D',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#fff',
            color: '#000',
          },
        },
      },
    },
  },
  commonTheme,
);

export const perconaDarkTheme: ThemeOptions = merge(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#f5cc78',
      },
      secondary: {
        main: '#774faa',
        light: '#121212',
      },
      success: {
        main: '#2CBEA2',
        dark: '#2CBEA2',
        contrastText: '#000000',
      },
      error: {
        main: '#CE3C3C',
        dark: '#CE3C3C',
        contrastText: '#FFFFFF',
      },
      info: {
        main: '#127AE8',
        dark: '#127AE8',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#F0B336',
        dark: '#F0B336',
        contrastText: '#000000',
      },
    },
  },
  commonTheme,
);
