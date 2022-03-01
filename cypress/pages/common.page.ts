import {leftMainMenuClick, LeftMainMenuLinks} from 'pages/helpers/commonPage.helper';

export const commonPage = {
  constants: {
    labels: {},
    messages: {},
    links: {},
  },
  locators: {
    sideMenuLink: 'nav-link',
  },
  methods: {
    leftMainMenuClick: (target: LeftMainMenuLinks) => leftMainMenuClick(target),
  },
};
