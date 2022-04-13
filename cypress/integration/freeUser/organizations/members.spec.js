import { getUser } from 'pages/auth/getUser';
import dashboardPage from 'pages/dashboard.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { organizationPage } from 'pages/organization.page';
import { timeouts } from '../../../fixtures/timeouts';
import { createOrgAndAddUsers } from '../../customer/dashboard/helper';

context('Members tests for the Free Users', () => {
    let admin1User;
    let admin2User;
    let technical1User;

    beforeEach(() => {
        admin1User = getUser();
        admin2User = getUser();
        technical1User = getUser();
        cy.oktaCreateUser(admin1User);
        cy.oktaCreateUser(admin2User);
        cy.oktaCreateUser(technical1User);
        createOrgAndAddUsers(admin1User, [
            { email: admin2User.email, role: 'Admin' },
            { email: technical1User.email, role: 'Technical' },
        ]);
    });

    it('SAAS-T158 Verify organization admin is able to edit member roles', () => {
        cy.loginByOktaApi(admin1User.email, admin1User.password);
        dashboardPage.methods.waitForDashboardToLoad();
        // Navigate to the members page
        cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
            .should('be.visible')
            .click();
        // Edit button for logged-in user should be disabled
        organizationPage.methods.verifyOrganizationTab();
        organizationPage.methods.openMembersTab();
        cy.contains('td', admin1User.email)
            .parent()
            .within(() => cy.findByTestId(organizationPage.locators.editMemberIcon).should('be.disabled'));
        const emails = [technical1User.email, admin2User.email];
        const oldValues = ['Technical', 'Admin'];
        const newValues = ['Admin', 'Technical'];

        // Change user roles from Technical to Admin and Admin to Technical
        emails.forEach((email, index) => {
            cy.log(`Changing from ${oldValues[index]} to ${newValues[index]}`);
            cy.contains('td', email)
                .parent()
                .within(() => cy.findByTestId(organizationPage.locators.editMemberIcon).click());
            cy.contains('div', oldValues[index]).click();
            cy.contains('div', newValues[index]).click();
            cy.findByTestId(organizationPage.locators.ediMemberSubmitButton).click();
            cy.checkPopUpMessage(organizationPage.constants.messages.memberEditedSuccessfully);
            // eslint-disable-next-line cypress/no-unnecessary-waiting, no-magic-numbers
            cy.wait(1000);  // Due to bug SAAS-873, should be removed when bug is fixed.
            cy.contains('td', email)
                .parent()
                .then((row) => {
                    expect(row).to.deep.contain(newValues[index]);
                });
        });
    });

    it('SAAS-T175 Verify Technical User can view list of Org members in read-only mode', () => {
        cy.loginByOktaApi(technical1User.email, technical1User.password);
        dashboardPage.methods.waitForDashboardToLoad();
        // Navigate to the members page
        cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
            .should('be.visible')
            .click();
        organizationPage.methods.verifyOrganizationTab();
        organizationPage.methods.openMembersTab();
        const usersTable = [
            {
                Name: `${admin1User.firstName} ${admin1User.lastName}`,
                Email: admin1User.email,
                Role: 'Admin',
            },
            {
                Name: `${admin2User.firstName} ${admin2User.lastName}`,
                Email: admin2User.email,
                Role: 'Admin',
            },
            {
                Name: `${technical1User.firstName} ${technical1User.lastName}`,
                Email: technical1User.email,
                Role: 'Technical',
            },
        ];

        // Verify users info in members table
        cy.findByTestId('table')
            .getTable({ onlyColumns: ['Name', 'Email', 'Role'] })
            .then((table) => {
                expect(table.length).to.be.equal(usersTable.length);
                usersTable.forEach((tableUser) => expect(table).to.deep.include(tableUser));
            });

        usersTable.forEach((user) => {
            // Edit button for Technical user in user should be disabled for all users.
            cy.contains('td', user.Email)
                .parent()
                .within(() => {
                    cy.findByTestId(organizationPage.locators.editMemberIcon).should('be.disabled');
                    cy.findByTestId(organizationPage.locators.deleteMemberIcon).should('be.disabled');
                });
        });
    });

    it('SAAS-T215 Verify admin is able to remove users from organization', () => {
        cy.loginByOktaApi(admin1User.email, admin1User.password);
        dashboardPage.methods.waitForDashboardToLoad();
        // Navigate to the members page
        cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
          .should('be.visible')
          .click();
        organizationPage.methods.verifyOrganizationTab();
        organizationPage.methods.openMembersTab();
        // Edit button for logged in user should be disabled
        cy.contains('td', admin1User.email)
          .parent()
          .within(() => cy.findByTestId(organizationPage.locators.deleteMemberIcon).should('be.disabled'));
        const emails = [technical1User.email, admin2User.email];
        // Delete all types of users (Admin and Technical)

        emails.forEach((email, index) => {
            cy.contains('td', email)
                .parent()
                .within(() => cy.findByTestId(organizationPage.locators.deleteMemberIcon).click());
            cy.findByTestId(organizationPage.locators.deleteMemberModalContent).should((modalContent) =>
                expect(modalContent).to.contain(emails[index]),
            );
            cy.findByTestId(organizationPage.locators.deleteMemberSubmitButton).click();
            cy.checkPopUpMessage(organizationPage.constants.messages.memberDeletedSuccessfully);
            cy.findByTestId('table')
                .getTable({ onlyColumns: ['Email'] })
                .then((table) => expect(table).to.not.include(emails[index]));
        });
    });
});
