import { ThemeOptions } from '@mui/material';

export const perconaLightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
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
};

export const perconaDarkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
  },
};
