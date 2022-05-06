import { getUser } from 'pages/auth/getUser';
import dashboardPage from 'pages/dashboard.page';
import { MESSAGES } from 'pages/common/constants';
import { organizationPage } from 'pages/organization.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { timeouts } from '../../../fixtures/timeouts';

context('Organization Tests for Free user', () => {
  const orgName = `test_org_${Date.now()}`;
  let adminUserWithOrg;
  let adminUser;
  let technicalUser;

  beforeEach(() => {
    adminUserWithOrg = getUser();
    adminUser = getUser();
    technicalUser = getUser();
    cy.oktaCreateUser(adminUserWithOrg);
    cy.oktaCreateUser(adminUser);
    cy.oktaCreateUser(technicalUser);
    // create org by admin
    cy.getUserAccessToken(adminUserWithOrg.email, adminUserWithOrg.password).then((accessToken) => {
      cy.apiCreateOrg(accessToken, orgName).then((org) => {
        cy.apiInviteOrgMember(accessToken, org.org.id, { username: technicalUser.email, role: 'Technical' });
      });
    });
  });

  it('SAAS-T136 SAAS-T139 SAAS-T159 create organization', () => {
    const date = new Date().toLocaleDateString();

    cy.loginByOktaApi(adminUser.email, adminUser.password);
    dashboardPage.methods.waitForDashboardToLoad();
    cy.contains(gettingStartedPage.constants.labels.addOrganization).isVisible().click({ force: true });
    cy.findByTestId(organizationPage.locators.createOrgForm).isVisible();
    cy.findByTestId(organizationPage.locators.orgNameInput);
    cy.findByTestId(organizationPage.locators.orgNameInput)
      .as('orgNameField')
      .hasAttr('placeholder', organizationPage.constants.labels.orgNamePlaceholder)
      .isEnabled()
      .type('test')
      .clear();
    cy.findByTestId(organizationPage.locators.createOrgSubmitButton).as('createButton').isDisabled();
    cy.findByTestId(organizationPage.locators.orgNameInputError).hasText(MESSAGES.REQUIRED_FIELD);

    cy.get('@orgNameField').type(orgName);
    cy.get('@createButton').click();
    cy.checkPopUpMessage(organizationPage.constants.messages.orgCreatedSuccessfully);

    cy.contains(organizationPage.constants.labels.orgNameLabel, { timeout: timeouts.TWENTY_SEC })
      .find('strong')
      .should('have.text', orgName);
    cy.contains(organizationPage.constants.labels.creationDateLabel).find('strong').should('have.text', date);
  });

  it('SAAS-T220 Verify free account admin user can update org name', () => {
    const newOrgName = `new_test_org_${Date.now()}`;

    cy.loginByOktaApi(adminUserWithOrg.email, adminUserWithOrg.password);
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });

    cy.findAllByTestId(organizationPage.locators.editOrgButton).should('be.visible').click();
    cy.findByTestId(organizationPage.locators.editOrgSubmitButton).isDisabled();

    cy.findByTestId(organizationPage.locators.orgNameInput).clear({ force: true });
    cy.findByTestId(organizationPage.locators.orgNameInputError).contains(
      organizationPage.constants.labels.requiredField,
    );
    cy.findByTestId(organizationPage.locators.orgNameInput).type(newOrgName);

    cy.findByTestId(organizationPage.locators.editOrgSubmitButton).isEnabled().click();
    cy.checkPopUpMessage(organizationPage.constants.messages.orgEditedSuccessfully);
    cy.findAllByTestId(organizationPage.locators.manageOrgTab)
      .contains(organizationPage.constants.labels.organizationTabLabel)
      .should('be.visible')
      .click({ force: true });
    cy.contains(newOrgName).should('be.visible');
  });

  it.skip('SAAS-T221 Verify free account technical user is not able to update his organization name', () => {
    cy.loginByOktaApi(technicalUser.email, technicalUser.password);
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    cy.findAllByTestId(organizationPage.locators.manageOrgTab)
      .contains(organizationPage.constants.labels.organizationTabLabel)
      .should('be.visible')
      .click({ force: true });
    cy.findAllByTestId(organizationPage.locators.organizationContainer).then(() => {
      cy.findAllByTestId(organizationPage.locators.editOrgButton).should('not.exist');
    });
  });
});
