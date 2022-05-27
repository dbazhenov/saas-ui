import commonPage from 'pages/common.page';
import { timeouts } from '../../fixtures/timeouts';

export const leftMenuNavigation = (target: LeftMainMenuLinks) => {
  cy.findAllByTestId(commonPage.locators.sideMenuLink).get(target).click();
};

export const commonPageLoaded = () => {
  cy.findByTestId(commonPage.locators.perconaLogo, { timeout: timeouts.ONE_MIN });
  cy.findByTestId(commonPage.locators.profileToggle, { timeout: timeouts.ONE_MIN });
};

export const uiLogoutUser = () => {
  clickAndVerifyProfileMenu();
  cy.findByTestId(commonPage.locators.logoutButton).click();
};

// eslint-disable-next-line no-magic-numbers
const clickAndVerifyProfileMenu = async (attempts: number = 0) => {
  const logoutButtonSelector = 'span[data-testid=menu-bar-profile-dropdown-logout]';

  // eslint-disable-next-line no-magic-numbers
  if (attempts > 4) {
    throw new Error('User dropdown was not displayed after 5 retries');
  }

  cy.findByTestId(commonPage.locators.profileToggle)
    .click({ force: true })
    .then(() => {
      // eslint-disable-next-line no-magic-numbers
      if (Cypress.$(logoutButtonSelector).length < 1) {
        // eslint-disable-next-line no-plusplus, no-param-reassign
        clickAndVerifyProfileMenu(++attempts);
      }
    });
};

export enum LeftMainMenuLinks {
  dashboard = 'a[href="/"][data-testid="nav-link"]',
  organization = 'a[href="/organization"][data-testid="nav-link"]',
  pmmInstances = 'a[href="/pmm-instances"][data-testid="nav-link"]',
}
