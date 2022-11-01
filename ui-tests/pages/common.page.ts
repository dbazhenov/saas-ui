/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import MarketingBanner from '@tests/components/MarketingBanner';
import SideMenu from '../components/sideMenu';
import Toast from '../components/toast';

interface UserRoles {
  admin: string;
  technical: string;
}

export class CommonPage {
  readonly page: Page;
  readonly sideMenu: SideMenu;

  readonly customerOrgCreated: string;
  readonly requiredField: string;

  readonly documentationLink: string;

  readonly modalCloseButton: Locator;
  readonly userDropdownToggle: Locator;
  readonly userDropdownMenuLogout: Locator;
  readonly userDropdownContainer: Locator;
  readonly perconaLogo: Locator;

  readonly userRoles: UserRoles;
  readonly userDropdownProfile: Locator;
  readonly themeSwitch: Locator;

  readonly toast: Toast;
  readonly marketingBanner: MarketingBanner;

  readonly routes;

  constructor(page: Page) {
    this.page = page;
    this.sideMenu = new SideMenu(page);
    this.customerOrgCreated = 'We found your organization on Percona Customer Portal and used it';
    this.requiredField = 'Required field';

    this.modalCloseButton = this.page.locator('//div[@role="modal-close-button"]');
    this.userDropdownToggle = this.page.locator('//div[@data-testid="menu-bar-profile-dropdown-toggle"]');
    this.userDropdownContainer = this.page.locator('//div[@data-testid="dropdown-menu-container"]');
    this.userDropdownMenuLogout = this.page.locator(
      '//span[@data-testid="menu-bar-profile-dropdown-logout"]',
    );
    this.perconaLogo = page.locator('//a[@data-testid="menu-bar-home-link"]');
    this.userDropdownProfile = this.userDropdownContainer.locator(
      '// span[@data-testid="menu-bar-profile-dropdown-profile"]',
    );
    this.userRoles = { admin: 'Admin', technical: 'Technical' };
    this.themeSwitch = page.locator('//div[@data-testid="theme-switch"]');

    this.toast = new Toast(page);
    this.marketingBanner = new MarketingBanner(page);
    this.routes = {
      instances: '/pmm-instances',
      login: '/login',
      loginCallback: '/login/callback',
      logout: '/logout',
      organization: '/organization',
      profile: '/profile',
      activation: '/activation',
      root: '/',
      welcome: '/welcome',
      dashboard: '/dashboard',
      kubernetes: '/kubernetes',
    };
  }

  uiUserLogout = async () => {
    await this.openUserDropdown();
    await this.userDropdownMenuLogout.click();
  };

  openUserProfile = async () => {
    await this.openUserDropdown();
    await this.userDropdownProfile.click();
  };

  waitForPortalLoaded = async () => {
    await this.perconaLogo.waitFor({ state: 'visible', timeout: 60000 });
    await this.userDropdownToggle.waitFor({ state: 'visible', timeout: 60000 });
  };

  openUserDropdown = async () => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < 5; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.userDropdownToggle.click();
      // eslint-disable-next-line no-await-in-loop
      if (await this.userDropdownContainer.isVisible()) break;

      if (index === 4) {
        throw new Error('User dropdown was not displayed');
      }
    }
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
