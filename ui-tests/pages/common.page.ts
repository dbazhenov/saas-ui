/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import MarketingBanner from '@tests/components/MarketingBanner';
import { UserDropDown } from '@tests/components/UserDropdown';
import SideMenu from '../components/sideMenu';
import Toast from '../components/toast';

interface UserRoles {
  admin: string;
  technical: string;
}

export class CommonPage {
  // eslint-disable-next-line no-empty-function
  constructor(readonly page: Page) { }
  // Components
  sideMenu = new SideMenu(this.page);
  toast = new Toast(this.page);
  marketingBanner = new MarketingBanner(this.page);
  userDropdown = new UserDropDown(this.page);

  // Locators
  perconaLogo = this.page.locator('//a[@data-testid="menu-bar-home-link"]');

  // Messages
  customerOrgCreated = 'We found your organization on Percona Customer Portal and used it';
  requiredField = (field: string) => `${field} is a required field`;

  userRoles: UserRoles = { admin: 'Admin', technical: 'Technical' };

  routes = {
    instances: '/pmm-instances',
    login: '/login',
    loginCallback: '/login/callback',
    logout: '/logout',
    organization: '/organization',
    profile: '/profile',
    activation: '/activation',
    root: '/',
    welcome: '/welcome',
    dashboard: '/home',
    dbaas: '/pmm-demo',
  };

  waitForPortalLoaded = async () => {
    await this.perconaLogo.waitFor({ state: 'visible', timeout: 60000 });
    await this.userDropdown.toggle.waitFor({ state: 'visible', timeout: 60000 });
  };

  waitForEnabled = async (locator: Locator, retries = 5) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < retries; index++) {
      // eslint-disable-next-line no-await-in-loop
      if (await locator.isEnabled()) break;

      // eslint-disable-next-line no-await-in-loop
      await this.page.waitForTimeout(1000);
    }
  };
}
