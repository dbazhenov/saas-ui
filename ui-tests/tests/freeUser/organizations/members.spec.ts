import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { MembersPage } from '@pages/members.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import {
  deleteMailosaurMessage,
  getMailosaurMessage,
  getRandomMailosaurEmailAddress,
} from '@tests/api/helpers';
import { ActivationPage } from '@tests/pages/activation.page';
import { SignInPage } from '@tests/pages/signIn.page';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for free users members tests', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let notRegisteredUser: User;
  let secondNotRegisteredUser: User;
  let adminToken: string;
  let org: any;

  test.beforeEach(async ({ page }) => {
    admin1User = getUser();
    admin2User = getUser();
    technicalUser = getUser();
    notRegisteredUser = getUser(getRandomMailosaurEmailAddress());
    secondNotRegisteredUser = getUser(getRandomMailosaurEmailAddress());

    await oktaAPI.createUser(admin1User, true);
    await oktaAPI.createUser(admin2User, true);
    await oktaAPI.createUser(technicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    const newOrg = await portalAPI.createOrg(adminToken);

    org = newOrg.org;

    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: technicalUser.email,
      role: UserRoles.technical,
    });
    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: admin2User.email,
      role: UserRoles.admin,
    });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await portalAPI.deleteOrg(adminToken, org.id);
    await oktaAPI.deleteUserByEmail(admin1User.email);
    await oktaAPI.deleteUserByEmail(admin2User.email);
    await oktaAPI.deleteUserByEmail(technicalUser.email);
    if (await oktaAPI.getUser(notRegisteredUser.email)) {
      await oktaAPI.deleteUserByEmail(notRegisteredUser.email);
    }
  });

  test('SAAS-T158 Verify organization admin is able to edit member roles @freeUser @members', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    await test.step('Navigate to the Members tab and edit user roles as admin', async () => {
      await oktaAPI.loginByOktaApi(admin1User, page);
      await dashboardPage.locators.viewOrgLink.click();
      await organizationPage.locators.membersTab.click();
      await organizationPage.isMemberTableEditButtonDisabled(admin1User.email);
      await organizationPage.changeMemberRoleAndVerify(
        admin2User.email,
        UserRoles.admin,
        UserRoles.technical,
      );
      await organizationPage.changeMemberRoleAndVerify(
        technicalUser.email,
        UserRoles.technical,
        UserRoles.admin,
      );
    });
  });

  // Un-skip when https://jira.percona.com/browse/SAAS-1176 is fixed
  test.skip('SAAS-T267 Verify resend confirmation emails for organization members. @freeUser @members @tempTest', async ({
    page,
    context,
    baseURL,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const signInPage = new SignInPage(page);
    let message;

    await test.step('Invite previously not registered new member to the organization.', async () => {
      await oktaAPI.loginByOktaApi(admin1User, page);
      await dashboardPage.locators.viewOrgLink.click();
      await organizationPage.locators.membersTab.click();
      await membersPage.membersTable.inviteMembers.inviteMember(notRegisteredUser.email);
      message = await getMailosaurMessage(notRegisteredUser.email, `Welcome to ${org.name}`);
      await deleteMailosaurMessage(message.id);
    });

    await test.step(
      'In members tab click link Resend Email for the new user and verify email and activation',
      async () => {
        await membersPage.membersTable.resetEmailLink(notRegisteredUser.email).click();
        const secondMessage = await getMailosaurMessage(notRegisteredUser.email, `Welcome to ${org.name}`);

        expect(message.id === secondMessage.id).toBeFalsy();
        const secondTab = await context.newPage();
        const activationPage = new ActivationPage(secondTab);
        const signInPageSecondTabs = new SignInPage(secondTab);

        await secondTab.goto(message.html.links.find((link) => link.text.includes('Activate')).href);
        // Skipped due to bug: https://jira.percona.com/browse/SAAS-1140
        // await activationPage.activationTitle.waitFor({ state: 'visible' });
        // await expect(activationPage.activationTitle).toHaveText(activationPage.expiredTokenTitle);

        await secondTab.goto(secondMessage.html.links.find((link) => link.text.includes('Activate')).href);
        await activationPage.firstNameInput.type(notRegisteredUser.firstName);
        await activationPage.lastNameInput.type(notRegisteredUser.lastName);
        await activationPage.passwordInput.type(notRegisteredUser.password);
        await activationPage.repeatPasswordInput.type(notRegisteredUser.password);
        await activationPage.tosCheckboxLabel.check();
        await activationPage.activateAccountButton.click();
        await signInPageSecondTabs.emailInput.waitFor({ state: 'visible' });
        await secondTab.close();

        await deleteMailosaurMessage(secondMessage.id);
      },
    );

    await test.step('In members tab click link Resend Email for the new user.', async () => {
      await membersPage.membersTable.inviteMembers.inviteMember(secondNotRegisteredUser.email);
      message = await getMailosaurMessage(secondNotRegisteredUser.email, `Welcome to ${org.name}`);
      await deleteMailosaurMessage(message.id);
      await membersPage.membersTable
        .resetEmailLink(secondNotRegisteredUser.email)
        .waitFor({ state: 'visible' });
      await membersPage.uiUserLogout();
      await signInPage.emailInput.waitFor({ state: 'visible' });
    });

    await test.step(
      'Login as technical user and verify that technical user can not resend activation email',
      async () => {
        await oktaAPI.loginByOktaApi(technicalUser, page);
        await dashboardPage.sideMenu.mainMenu.organization.click();
        await organizationPage.locators.membersTab.click();
        await membersPage.membersTable.elements
          .rowByText(secondNotRegisteredUser.email)
          .waitFor({ state: 'visible' });
        await membersPage.membersTable
          .resetEmailLink(secondNotRegisteredUser.email)
          .waitFor({ state: 'detached' });
        await membersPage.membersTable.resetEmailLink(notRegisteredUser.email).waitFor({ state: 'detached' });
      },
    );
  });

  test('SAAS-T175 Verify Technical User can view list of Org members in read-only mode @freeUser @members', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T176 Verify sorting of Org Members by First name',
    });
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const usersTable = [
      {
        Name: `${admin1User.firstName} ${admin1User.lastName}`,
        Email: admin1User.email,
        Role: organizationPage.userRoles.admin,
      },
      {
        Name: `${admin2User.firstName} ${admin2User.lastName}`,
        Email: admin2User.email,
        Role: organizationPage.userRoles.admin,
      },
      {
        Name: `${technicalUser.firstName} ${technicalUser.lastName}`,
        Email: technicalUser.email,
        Role: organizationPage.userRoles.technical,
      },
    ];

    usersTable.sort((a, b) => (a.Name < b.Name ? -1 : 1));

    await oktaAPI.loginByOktaApi(technicalUser, page);
    await dashboardPage.locators.viewOrgLink.click();
    await organizationPage.locators.membersTab.click();

    await membersPage.membersTable.verifyMembersTable(usersTable);
    const membersTableRows = membersPage.membersTable.elements.row;

    // eslint-disable-next-line no-await-in-loop, no-plusplus
    for (let i = 0; i < (await membersTableRows.count()); i++) {
      expect(
        // eslint-disable-next-line no-await-in-loop
        await membersTableRows
          .nth(i)
          .locator(membersPage.membersTable.membersTableEditUser.toString().replace('Locator@', ''))
          .isDisabled(),
      ).toBeTruthy();
      expect(
        // eslint-disable-next-line no-await-in-loop
        await membersTableRows
          .nth(i)
          .locator(membersPage.membersTable.membersTableDeleteUser.toString().replace('Locator@', ''))
          .isDisabled(),
      ).toBeTruthy();
    }
  });

  test('SAAS-T215 Verify admin is able to remove users from organization @freeUser @members', async ({
    page,
  }) => {
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(admin1User, page);

    await dashboardPage.locators.viewOrgLink.click();
    await organizationPage.locators.membersTab.click();

    await membersPage.membersTable.verifyMembersTableUserButtons(
      `${admin1User.firstName} ${admin1User.lastName}`,
      false,
    );

    await membersPage.membersTable.deleteUserMembersTabByEmail(admin2User.email);
    await membersPage.toast.toastElementContainer.waitFor({ state: 'detached' });
    await membersPage.membersTable.deleteUserMembersTabByEmail(technicalUser.email);
  });

  test('SAAS-T169 Verify Technical User can not invite Org members @freeUser @members', async ({ page }) => {
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await page.goto('');
    await oktaAPI.loginByOktaApi(technicalUser, page);

    await organizationPage.sideMenu.mainMenu.organization.click();
    await organizationPage.locators.membersTab.click();
    await membersPage.membersTable.elements.table.waitFor({ state: 'visible' });
    await membersPage.membersTable.inviteMembers.inviteMemberButton.waitFor({ state: 'detached' });
  });

  test('SAAS-T249 Verify user can invite more than 1 person at once @freeUser @members', async ({ page }) => {
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const dashboardPage = new DashboardPage(page);
    let invitedUsers = [];

    await test.step(
      '1. Open Portal navigate to the Members page and click on  Invite members button',
      async () => {
        await oktaAPI.loginByOktaApi(admin1User, page);
        await dashboardPage.sideMenu.mainMenu.organization.click();
        await organizationPage.locators.membersTab.click();
        await membersPage.membersTable.inviteMembers.inviteMemberButton.click();
        await membersPage.membersTable.inviteMembers.getUsernameLocator(0).waitFor({ state: 'visible' });

        await membersPage.membersTable.inviteMembers.getUsernameLocator(1).waitFor({ state: 'detached' });
      },
    );

    await test.step('2. Click on "Add another user"', async () => {
      await membersPage.membersTable.inviteMembers.inviteMemberAddRow.click();
      await membersPage.membersTable.inviteMembers.getUsernameLocator(1).waitFor({ state: 'visible' });
    });

    await test.step(
      "3. Verify that's it's not possible to add more than 10 lines and warning message appears",
      async () => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 9; i++) {
          // eslint-disable-next-line no-await-in-loop
          await membersPage.membersTable.inviteMembers.inviteMemberAddRow.click();
        }

        await membersPage.toast.checkToastMessage(membersPage.membersTable.inviteMembers.inviteMembersLimit);
      },
    );

    await test.step('4. Invite 10 users, with mixed admin and technical roles roles.', async () => {
      invitedUsers = await membersPage.membersTable.inviteMembers.getRandomUserEmailsWithRoles(10);

      await membersPage.membersTable.inviteMembers.buttons.close.click();
      await membersPage.membersTable.inviteMembers.inviteMemberButton.click();
      await membersPage.membersTable.inviteMembers.inviteMembers(invitedUsers);
      await membersPage.membersTable.inviteMembers.verifySuccessfullyInvitedMessage(invitedUsers.length);
    });

    await test.step('5. Try to invite user with the email already invited', async () => {
      await membersPage.membersTable.inviteMembers.inviteMember(invitedUsers[0].email);
      await membersPage.toast.checkToastMessage(membersPage.membersTable.inviteMembers.errorInviteMessage);

      await membersPage.membersTable.inviteMembers.getUsernameErrorLocator(0).waitFor({ state: 'visible' });
      await expect(membersPage.membersTable.inviteMembers.getUsernameErrorLocator(0)).toHaveText(
        membersPage.membersTable.inviteMembers.alreadyMemberMessage,
      );
    });
  });

  test('SAAS-T216 Verify free account user that was removed from an org is able to create another org @freeUser @members', async ({
    page,
  }) => {
    const orgName = 'Test Org Second User';
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await test.step('1. Go to Members tab and remove some user from the organization', async () => {
      await oktaAPI.loginByOktaApi(admin1User, page);
      await organizationPage.sideMenu.mainMenu.organization.click();
      await organizationPage.locators.membersTab.click();
      await membersPage.membersTable.elements.table.waitFor({ state: 'visible' });
      await membersPage.membersTable.deleteUserMembersTabByEmail(admin2User.email);
      await membersPage.membersTable.verifyUserNotPresent(admin2User.email);
      await membersPage.uiUserLogout();
      await signInPage.emailInput.waitFor({ state: 'visible' });
    });

    await test.step(
      '2. Login as user removed in the step 1 and try to create a new organization',
      async () => {
        await oktaAPI.loginByOktaApi(admin2User, page);
        await organizationPage.sideMenu.mainMenu.organization.click();
        await organizationPage.locators.organizationNameInput.type(orgName);
        await organizationPage.locators.createOrgButton.click();
        await organizationPage.toast.checkToastMessage(organizationPage.messages.orgCreatedSuccessfully);
        await expect(organizationPage.locators.organizationName).toHaveText(orgName);
      },
    );
  });
});
