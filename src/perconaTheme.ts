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
      },
    },
  },
  commonTheme,
);
