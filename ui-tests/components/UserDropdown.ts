import { Locator, Page } from '@playwright/test';

export class UserDropDown {
  constructor(readonly page: Page) { }
  // Components

  // Locators
  toggle = this.page.locator('//button[@data-testid="menu-bar-profile-dropdown-toggle"]');
  container = this.page.locator('//div[@data-testid="dropdown-menu-container"]');
  logoutOption = this.container.locator('//li[@data-testid="menu-bar-profile-dropdown-logout"]');
  profileOption = this.container.locator('//a[@data-testid="menu-bar-profile-dropdown-profile"]');
  themeSwitch = this.container.getByTestId('theme-switch');

  logoutUser = async () => {
    await this.openUserDropdown();
    await this.logoutOption.click();
  };

  openUserProfile = async () => {
    await this.openUserDropdown();
    await this.profileOption.click();
  };

  switchTheme = async () => {
    await this.openUserDropdown();
    await this.themeSwitch.click()
  }

  openUserDropdown = async () => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < 5; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.toggle.click();
      // eslint-disable-next-line no-await-in-loop
      if (await this.container.isVisible()) break;

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
