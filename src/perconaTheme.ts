import { ThemeOptions } from '@mui/material';
import merge from 'lodash.merge';

const commonTheme: ThemeOptions = {
  components: {
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
        main: '#0e5fb5',
      },
      secondary: {
        main: '#f3c25e',
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
        main: '#93c6fc',
      },
      secondary: {
        main: '#f8dca3',
      },
    },
  },
  commonTheme,
);
