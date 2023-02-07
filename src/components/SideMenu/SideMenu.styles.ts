import { SIDE_MENU_WIDTH } from 'components/Layouts/PrivateLayout/PrivateLayout.constants';

export const styles = {
  drawer: {
    width: `${SIDE_MENU_WIDTH}px`,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: `${SIDE_MENU_WIDTH}px`,
      backgroundColor: '#2c323e',
      boxSizing: 'border-box',
    },
    zIndex: 1000,
  },
  logo: {
    wrapper: { textDecoration: 'none' },
  },
};
