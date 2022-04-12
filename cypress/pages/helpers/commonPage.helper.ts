import {commonPage} from 'pages/common.page';

export const leftMainMenuClick = (target: LeftMainMenuLinks) => {
  cy.findAllByTestId(commonPage.locators.sideMenuLink).get(target).click();
};

export enum LeftMainMenuLinks {
  gettingStarted = 'a[href*="/"]',
  dashboard = 'a[href*="/dashboard"]',
}

export const commonPageLoaded = () => {
  cy.findByTestId(commonPage.locators.perconaLogo);
  cy.findByTestId(commonPage.locators.profileToggle);
};
