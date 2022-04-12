import {
  commonPageLoaded,
  leftMainMenuClick,
  LeftMainMenuLinks,
  uiLogoutUser,
} from 'pages/helpers/commonPage.helper';

const commonPage = {
  constants: {
    labels: {},
    messages: {},
    links: {},
  },
  locators: {
    logoutButton: 'menu-bar-profile-dropdown-logout',
    sideMenuLink: 'nav-link',
    perconaLogo: 'menu-bar-home-link',
    profileToggle: 'menu-bar-profile-dropdown-toggle',
  },
  methods: {
    leftMainMenuClick: (target: LeftMainMenuLinks) => leftMainMenuClick(target),
    commonPageLoaded: () => commonPageLoaded(),
    uiLogoutUser: () => uiLogoutUser(),
  },
};

export default commonPage;
