import {commonPageLoaded, leftMainMenuClick, LeftMainMenuLinks} from 'pages/helpers/commonPage.helper';

export const commonPage = {
  constants: {
    labels: {},
    messages: {},
    links: {},
  },
  locators: {
    sideMenuLink: 'nav-link',
    perconaLogo: 'menu-bar-home-link',
    profileToggle: 'menu-bar-profile-dropdown-toggle',
  },
  methods: {
    leftMainMenuClick: (target: LeftMainMenuLinks) => leftMainMenuClick(target),
    commonPageLoaded: () => commonPageLoaded(),
  },
};
