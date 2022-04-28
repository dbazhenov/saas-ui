import commonPage from 'pages/common.page';

export const leftMenuNavigation = (target: LeftMainMenuLinks) => {
  cy.findAllByTestId(commonPage.locators.sideMenuLink).get(target).click();
};

export const commonPageLoaded = () => {
  cy.findByTestId(commonPage.locators.perconaLogo);
  cy.findByTestId(commonPage.locators.profileToggle);
};

export const uiLogoutUser = () => {
  cy.findByTestId(commonPage.locators.profileToggle).click();
  cy.findByTestId(commonPage.locators.logoutButton).click();
};

export enum LeftMainMenuLinks {
  dashboard = 'a[href="/"][data-testid="nav-link"]',
  organization = 'a[href="/organization"][data-testid="nav-link"]',
  pmmInstances = 'a[href="/pmm-instances"][data-testid="nav-link"]',
}
