import { organizationPage } from 'pages/organization.page';

export const verifyOrganizationTab = () => {
  cy.contains(organizationPage.constants.labels.orgNameLabel).isVisible();
};

export const openMembersTab = () => {
  cy.findAllByTestId(organizationPage.locators.manageOrgTab)
    .contains(organizationPage.constants.labels.membersTabLabel)
    .click();
  cy.findAllByTestId(organizationPage.locators.orgTableRow).isVisible();
};
