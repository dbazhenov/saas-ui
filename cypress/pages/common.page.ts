import {
  commonPageLoaded,
  leftMenuNavigation,
  LeftMainMenuLinks,
  uiLogoutUser,
} from 'pages/helpers/commonPage.helper';

const commonPage = {
  constants: {
    labels: {
      dashboardLink: 'Dashboard',
      organizationLink: 'Organization',
      pmmInstancesLink: 'PMM Instances',
      resourcesHeader: 'Resources',
      mainHeader: 'Main',
      documentationLink: 'Documentation',
      blogLink: 'Blogs',
      forumsLink: 'Forum',
      portalHelpLink: 'Portal Help',
    },
    messages: {},
    links: {},
  },
  locators: {
    logoutButton: 'menu-bar-profile-dropdown-logout',
    sideMenuLink: 'nav-link',
    perconaLogo: 'menu-bar-home-link',
    profileToggle: 'menu-bar-profile-dropdown-toggle',
    themeSwitch: 'theme-switch',
    resourcesHeader: 'resources-header',
    mainHeader: 'main-header',
    documentationLink: 'a[href="https://www.percona.com/software/documentation"]',
    blogLink: 'a[href="https://www.percona.com/blog/"]',
    forumsLink: 'a[href="https://forums.percona.com/"]',
    portalHelpLink: 'a[href="https://docs.percona.com/percona-platform/index.html"]',
    navLink: '[data-testid="nav-link"]',
  },
  methods: {
    leftMenuNavigation: (target: LeftMainMenuLinks) => leftMenuNavigation(target),
    commonPageLoaded: () => commonPageLoaded(),
    uiLogoutUser: () => uiLogoutUser(),
  },
};

export default commonPage;
