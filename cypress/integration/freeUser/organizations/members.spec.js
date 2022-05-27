import { getUser, getUserWithMailosaurEmail } from 'pages/auth/getUser';
import dashboardPage from 'pages/dashboard.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { organizationPage } from 'pages/organization.page';
import activationPage from 'pages/auth/activation.page';
import signInPage from 'pages/auth/signIn.page';
import signUpPage from 'pages/auth/signUp.page';
import { timeouts } from '../../../fixtures/timeouts';
import { createOrgAndAddUsers } from '../../customer/dashboard/helper';

context('Members tests for the Free Users', () => {
  const mailosaurServerId = Cypress.env('mailosaur_ui_tests_server_id');
  let admin1User;
  let admin2User;
  let technical1User;
  let newAdminUser; 
  let newTechnicalUser;
  
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

  afterEach(() => {
    cy.cleanUpAfterTest([admin1User, admin2User, technical1User], admin1User);
    if(newAdminUser) {
      cy.oktaDeleteUserByEmail(newAdminUser.email);
      newAdminUser = undefined;
    }

    if(newTechnicalUser) {
      cy.oktaDeleteUserByEmail(newTechnicalUser.email);
      newTechnicalUser = undefined;
    }
  });

  it('SAAS-T158 Verify organization admin is able to edit member roles', () => {
    cy.loginByOktaApi(admin1User.email, admin1User.password);
    dashboardPage.methods.waitForDashboardToLoad();
    // Navigate to the members page
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    // Edit button for logged-in user should be disabled
    organizationPage.methods.verifyOrganizationTab();
    organizationPage.methods.openMembersTab();
    cy.contains('td', admin1User.email)
      .parent()
      .within(() => cy.findByTestId(organizationPage.locators.editMemberIcon).should('be.disabled'));
    const emails = [technical1User.email, admin2User.email];
    const oldValues = [
      organizationPage.constants.userRoles.technical,
      organizationPage.constants.userRoles.admin,
    ];
    const newValues = [
      organizationPage.constants.userRoles.admin,
      organizationPage.constants.userRoles.technical,
    ];

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
      cy.wait(1000); // Due to bug SAAS-873, should be removed when bug is fixed.
      cy.contains('td', email)
        .parent()
        .then((row) => {
          expect(row).to.deep.contain(newValues[index]);
        });
    });
  });

  it.skip('SAAS-T169 Verify Technical User can not invite Org members', () => {
    cy.loginByOktaApi(admin1User.email, admin1User.password);
    // cy.loginByOktaApi(technical1User.email, technical1User.password);
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click();
    cy.findByTestId('table').then(() =>
      cy.findByTestId(organizationPage.locators.inviteMemberButton).should('not.exist'),
    );
  });

  it.skip('SAAS-T170 Verify email validation on Invite Member modal', () => {
    const emailAddresses = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      // '.email@example.com',
      // 'email.@example.com',
      // 'email..email@example.com',
      'あいうえお@example.com',
      'email@example.com (Joe Smith)',
      'email@example',
      'email@-example.com',
      // 'email@example.web',
      // 'email@111.222.333.44444',
      'email@example..com',
      // 'Abc..123@example.com',
    ];

    cy.loginByOktaApi(admin1User.email, admin1User.password);
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click();
    cy.findByTestId('table').then(() =>
      cy.findByTestId(organizationPage.locators.inviteMemberButton).should('be.visible'),
    );
    cy.findByTestId(organizationPage.locators.inviteMemberButton).click();
    emailAddresses.forEach((emailAddress) => {
      cy.findByTestId(organizationPage.locators.modalEmailInput).clear().type(emailAddress);
      cy.findByTestId(organizationPage.locators.modalEmailError).hasText(
        organizationPage.constants.messages.emailValidationError,
      );
      cy.findByTestId(organizationPage.locators.inviteMemberSubmitButton).isDisabled();
    });
  });

  it('SAAS-T149 - Verify admin can invite other members to organization (free account)', () => {
    newAdminUser = getUserWithMailosaurEmail();
    newTechnicalUser = getUserWithMailosaurEmail();
    cy.oktaCreateUser(newAdminUser);
    cy.oktaCreateUser(newTechnicalUser);
    cy.loginByOktaApi(admin1User.email, admin1User.password);

    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.openMembersTab();

    cy.findByTestId(organizationPage.locators.inviteMemberButton).click({force: true});
    cy.findByTestId(organizationPage.locators.modalEmailInput).type(newAdminUser.email);
    cy.contains('div', organizationPage.constants.userRoles.technical).click();
    cy.contains('div', organizationPage.constants.userRoles.admin).click();
    cy.findByTestId(organizationPage.locators.inviteMemberSubmitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.userSuccessfullyInvited);

    cy.findByTestId(organizationPage.locators.inviteMemberButton).click({force: true});
    cy.findByTestId(organizationPage.locators.modalEmailInput).type(newTechnicalUser.email);
    cy.findByTestId(organizationPage.locators.inviteMemberSubmitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.userSuccessfullyInvited);

    cy.mailosaurGetMessage(mailosaurServerId, { sentTo: newAdminUser.email }, { timeout: 20000 }).then(
      (message) => {
        expect(message.metadata.headers.find(({ field }) => field === 'Subject').value).to.be.equal(
          'Welcome to Test Organization',
        );
        cy.mailosaurDeleteMessage(message.id);
      },
    );

    cy.mailosaurGetMessage(mailosaurServerId, { sentTo: newTechnicalUser.email }, { timeout: 20000 }).then(
      (message) => {
        expect(message.metadata.headers.find(({ field }) => field === 'Subject').value).to.be.equal(
          'Welcome to Test Organization',
        );
        cy.mailosaurDeleteMessage(message.id);
      },
    );

    const usersTable = [
      {
        Name: `${admin1User.firstName} ${admin1User.lastName}`,
        Email: admin1User.email,
        Role: organizationPage.constants.userRoles.admin,
      },
      {
        Name: `${admin2User.firstName} ${admin2User.lastName}`,
        Email: admin2User.email,
        Role: organizationPage.constants.userRoles.admin,
      },
      {
        Name: `${technical1User.firstName} ${technical1User.lastName}`,
        Email: technical1User.email,
        Role: organizationPage.constants.userRoles.technical,
      },
      {
        Name: `${newAdminUser.firstName} ${newAdminUser.lastName}`,
        Email: newAdminUser.email,
        Role: organizationPage.constants.userRoles.admin,
      },
      {
        Name: `${newTechnicalUser.firstName} ${newTechnicalUser.lastName}`,
        Email: newTechnicalUser.email,
        Role: organizationPage.constants.userRoles.technical,
      },
    ];

    cy.findByTestId('table')
      .getTable({ onlyColumns: ['Name', 'Email', 'Role'] })
      .then((table) => {
        // eslint-disable-next-line no-magic-numbers
        expect(table.length).to.be.equal(usersTable.length);
        usersTable.forEach((tableUser) => expect(table).to.deep.include(tableUser));
      });
  });

  it('SAAS-T175 Verify Technical User can view list of Org members in read-only mode', () => {
    cy.loginByOktaApi(technical1User.email, technical1User.password);
    dashboardPage.methods.waitForDashboardToLoad();
    // Navigate to the members page
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.verifyOrganizationTab();
    organizationPage.methods.openMembersTab();
    const usersTable = [
      {
        Name: `${admin1User.firstName} ${admin1User.lastName}`,
        Email: admin1User.email,
        Role: organizationPage.constants.userRoles.admin,
      },
      {
        Name: `${admin2User.firstName} ${admin2User.lastName}`,
        Email: admin2User.email,
        Role: organizationPage.constants.userRoles.admin,
      },
      {
        Name: `${technical1User.firstName} ${technical1User.lastName}`,
        Email: technical1User.email,
        Role: organizationPage.constants.userRoles.technical,
      },
    ];

    cy.log('Covers Test: SAAS-T176 Verify sorting of Org Members by First name');
    cy.findByTestId('table')
      .getTable({ onlyColumns: ['Name', 'Email', 'Role'] })
      .then((table) => {
        // eslint-disable-next-line no-magic-numbers
        let previousNameCharNumber = 0;

        table.forEach((row) => {
          expect(row.Name.charCodeAt() >= previousNameCharNumber).to.be.true;
          previousNameCharNumber = row.Name.charCodeAt();
        });
      });
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
      .click({ force: true });
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

  it('SAAS-T173 Verify OrgAdmin can not invite member of other organization', () => {
    const otherOrgUser = getUser();

    cy.oktaCreateUser(otherOrgUser);
    cy.getUserAccessToken(otherOrgUser.email, otherOrgUser.password).then((token) => cy.apiCreateOrg(token));
    cy.loginByOktaApi(admin1User.email, admin1User.password);
    dashboardPage.methods.waitForDashboardToLoad();
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.verifyOrganizationTab();
    organizationPage.methods.openMembersTab();
    cy.findByTestId(organizationPage.locators.inviteMemberButton).click();
    cy.findByTestId(organizationPage.locators.modalEmailInput).type(otherOrgUser.email);
    cy.findByTestId(organizationPage.locators.inviteMemberSubmitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.userAlreadyMemberOfAnotherOrg);

    cy.log('Covers Test: SAAS-T172 Verify OrgAdmin can not invite member of his organization again');
    cy.findByTestId(organizationPage.locators.inviteMemberButton).click();
    cy.findByTestId(organizationPage.locators.modalEmailInput).type(admin2User.email);
    cy.findByTestId(organizationPage.locators.inviteMemberSubmitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.userAlreadyMemberOfOrg);
  });

  it('SAAS-T238 Verify inviting non-registered users to the organziation', () => {
    cy.log(
      'Also covers: SAAS-T240 Verify non-registered user invited to the org is appearing in the members list',
    );
    const newUser = getUser();

    newUser.email = signUpPage.methods.getMailosaurEmailAddress(newUser);
    cy.loginByOktaApi(admin1User.email, admin1User.password);
    dashboardPage.methods.waitForDashboardToLoad();
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.verifyOrganizationTab();
    organizationPage.methods.openMembersTab();
    cy.findByTestId(organizationPage.locators.inviteMemberButton).click({ force: true });
    cy.findByTestId(organizationPage.locators.inviteMemberModal.emailInput).type(newUser.email);
    cy.contains('div', organizationPage.constants.userRoles.technical).click();
    cy.contains('div', organizationPage.constants.userRoles.admin).click();
    cy.findByTestId(organizationPage.locators.inviteMemberModal.submitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.userSuccessfullyInvited);
    cy.findByTestId(organizationPage.locators.userNotActivated).isVisible();
    cy.logoutUser();
    cy.mailosaurGetMessage(
      mailosaurServerId,
      { sentTo: newUser.email, subject: 'Welcome to Test Organization' },
      { timeout: 20000 },
    ).then((message) => cy.mailosaurDeleteMessage(message.id));
    cy.mailosaurGetMessage(
      mailosaurServerId,
      { sentTo: newUser.email, subject: organizationPage.constants.labels.inviteEmailSubject },
      { timeout: 20000 },
    ).then((message) => {
      const activateLink = message.html.links.find((link) => link.text.trim() === 'Activate');

      cy.document().then((doc) => doc.location.replace(activateLink.href));
      cy.mailosaurDeleteMessage(message.id);
    });
    activationPage.methods.activateUser(newUser.password);
    cy.url().should('contain', signUpPage.constants.links.loginAddress);
    cy.visit('');
    signInPage.methods.fillOutSignInUserDetails(newUser.email, newUser.password);
    cy.get(signInPage.locators.signInButton).isEnabled().click();
    const usersTable = [
      { Email: newUser.email },
      { Email: admin1User.email },
      { Email: admin2User.email },
      { Email: technical1User.email },
    ];

    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.openMembersTab();
    cy.findByTestId('table')
      .getTable({ onlyColumns: ['Email'] })
      .then((table) => {
        expect(table.length).to.be.equal(usersTable.length);
        usersTable.forEach((tableUser) => expect(table).to.deep.include(tableUser));
      });
    cy.logoutUser();
    cy.loginByOktaApi(admin1User.email, admin1User.password);
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    organizationPage.methods.verifyOrganizationTab();
    organizationPage.methods.openMembersTab();
    cy.contains('td', newUser.email)
      .parent()
      .within(() => cy.findByTestId(organizationPage.locators.editMemberIcon).click({ force: true }));
    cy.contains('div', organizationPage.constants.userRoles.admin).click();
    cy.contains('div', organizationPage.constants.userRoles.technical).click();
    cy.findByTestId(organizationPage.locators.ediMemberSubmitButton).click();
    cy.checkPopUpMessage(organizationPage.constants.messages.memberEditedSuccessfully);
    cy.contains('td', newUser.email)
      .parent()
      .within(() => cy.findByTestId(organizationPage.locators.deleteMemberIcon).click({ force: true }));
    cy.findByTestId(organizationPage.locators.deleteMemberSubmitButton).click();
    cy.findByTestId(organizationPage.locators.inviteMemberButton).click({ force: true });
    cy.findByTestId(organizationPage.locators.inviteMemberModal.emailInput).type(newUser.email);
    cy.findByTestId(organizationPage.locators.inviteMemberModal.submitButton).click();
  });

  it('SAAS-T239 Verify inviting non-registered members to the organziation failed', () => {
    const newUser = getUser();
    const unauthorizedCode = 401;
    const badRequestCode = 400;
    const forbiddenCode = 403;

    Cypress.Commands.add(
      'apiInviteOrgMemberWithoutFailOnError',
      (accessToken, orgId, member = { username: '', role: '' }) => {
        cy.request({
          method: 'POST',
          url: `v1/orgs/${orgId}/members`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: member,
          failOnStatusCode: false,
        });
      },
    );
    cy.getUserAccessToken(admin1User.email, admin1User.password).then((token) => {
      cy.apiGetOrg(token).then((responseOrg) => {
        cy.apiInviteOrgMemberWithoutFailOnError('Wrong Token', responseOrg.body.orgs[0].id, {
          username: newUser.email,
          role: organizationPage.constants.userRoles.admin,
        }).then((response) => {
          expect(response.status).to.equal(unauthorizedCode);
          expect(response.body.message).to.equal('Invalid credentials.');
        });
        cy.apiInviteOrgMemberWithoutFailOnError(token, responseOrg.body.orgs[0].id, {
          role: organizationPage.constants.userRoles.admin,
        }).then((response) => {
          expect(response.status).to.equal(badRequestCode);
          expect(response.body.message).to.equal(
            /* prettier-ignore */
            'invalid field Username: value \'\' must not be an empty string',
          );
        });
        cy.apiInviteOrgMemberWithoutFailOnError(token, responseOrg.body.orgs[0].id, {
          username: newUser.email,
        }).then((response) => {
          expect(response.status).to.equal(badRequestCode);
          expect(response.body.message).to.equal('Invalid organization member role.');
        });
        cy.apiInviteOrgMemberWithoutFailOnError(token, `${responseOrg.body.orgs[0].id}InvalidId`, {
          username: newUser.email,
          role: organizationPage.constants.userRoles.admin,
        }).then((response) => {
          expect(response.status).to.equal(forbiddenCode);
          expect(response.body.message).to.equal(
            'User must belong to the requested organization to perform this action.',
          );
        });
        cy.apiInviteOrgMemberWithoutFailOnError(token, responseOrg.body.orgs[0].id, {
          username: 'Invalid Email',
          role: organizationPage.constants.userRoles.admin,
        }).then((response) => {
          expect(response.status).to.equal(badRequestCode);
          expect(response.body.message).to.equal('Failed to invite user');
        });
      });
    });
  });
});
