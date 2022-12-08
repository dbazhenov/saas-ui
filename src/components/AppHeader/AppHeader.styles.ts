import { SIDE_MENU_WIDTH } from 'components/Layouts/PrivateLayout/PrivateLayout.constants';

export const styles = {
  appBar: {
    width: `calc(100% - ${SIDE_MENU_WIDTH}px)`,
    zIndex: 1000,
  },
  menu: {
    zIndex: 10000,
  },
};
