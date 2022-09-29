import { expect, test } from '@playwright/test';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import { MembersPage } from '@pages/members.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';

test.describe('Spec file for free users members tests', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let adminToken: string;
  let org: any;

  test.beforeEach(async ({ page }) => {
    admin1User = await getUser();
    admin2User = await getUser();
    technicalUser = await getUser();

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
  });

  test('SAAS-T158 Verify organization admin is able to edit member roles @freeUser @members', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    await oktaAPI.loginByOktaApi(admin1User, page);

    await dashboardPage.locators.viewOrgLink.click();
    await organizationPage.locators.membersTab.click();
    await organizationPage.isMemberTableEditButtonDisabled(admin1User.email);
    await organizationPage.changeMemberRoleAndVerify(admin2User.email, UserRoles.admin, UserRoles.technical);
    await organizationPage.changeMemberRoleAndVerify(
      technicalUser.email,
      UserRoles.technical,
      UserRoles.admin,
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
    const membersTableRows = membersPage.membersTable.tableRow;

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

  test('SAAS-T169 Verify Technical User can not invite Org members @freeUser @members', async ({
    page,
    baseURL,
  }) => {
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await page.goto('');
    await oktaAPI.loginByOktaApi(technicalUser, page);

    await organizationPage.sideMenu.mainMenu.organization.click();
    await organizationPage.locators.membersTab.click();
    await membersPage.membersTable.table.waitFor({ state: 'visible' });
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

      await membersPage.membersTable.inviteMembers.modalWindow.closeModalButton.click();
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
});
