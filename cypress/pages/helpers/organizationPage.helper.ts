import { organizationPage } from 'pages/organization.page';
import { timeouts } from '../../fixtures/timeouts';

export const verifyOrganizationTab = () => {
  cy.contains(organizationPage.constants.labels.orgNameLabel).isVisible();
};

export const openMembersTab = () => {
  cy.findAllByTestId(organizationPage.locators.manageOrgTab, { timeout: timeouts.HALF_MIN })
    .contains(organizationPage.constants.labels.membersTabLabel)
    .click({ force: true });
  cy.findAllByTestId(organizationPage.locators.orgTableRow).isVisible();
};
