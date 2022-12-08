import { SIDE_MENU_WIDTH } from 'components/Layouts/PrivateLayout/PrivateLayout.constants';

export const styles = {
  drawer: {
    width: `${SIDE_MENU_WIDTH}px`,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: `${SIDE_MENU_WIDTH}px`,
      boxSizing: 'border-box',
    },
    zIndex: 1000,
  },
  logo: {
    wrapper: { textDecoration: 'none' },
    typography: { display: 'inline-block' },
  },
};
