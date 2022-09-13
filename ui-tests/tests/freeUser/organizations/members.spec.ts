import { APIResponse, expect, test } from '@playwright/test';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import { MembersPage } from '@pages/members.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getRequestContext, RequestParams } from '@tests/api/helpers';
import InviteUserToOrg from '@tests/support/types/inviteUser.interface';

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

    await membersPage.verifyMembersTable(usersTable);
    const membersTableRows = membersPage.membersTableRow;

    // eslint-disable-next-line no-await-in-loop, no-plusplus
    for (let i = 0; i < (await membersTableRows.count()); i++) {
      expect(
        // eslint-disable-next-line no-await-in-loop
        await membersTableRows
          .nth(i)
          .locator(membersPage.membersTableEditUser.toString().replace('Locator@', ''))
          .isDisabled(),
      ).toBeTruthy();
      expect(
        // eslint-disable-next-line no-await-in-loop
        await membersTableRows
          .nth(i)
          .locator(membersPage.membersTableDeleteUser.toString().replace('Locator@', ''))
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
    await membersPage.verifyMembersTableUserButtons(`${admin1User.firstName} ${admin1User.lastName}`, false);
    await membersPage.deleteUserMembersTabByEmail(admin2User.email);
    await membersPage.toast.toastElementContainer.waitFor({ state: 'detached' });
    await membersPage.deleteUserMembersTabByEmail(technicalUser.email);
  });

  test('SAAS-T239 Verify inviting non-registered members to the organziation failed @freeUser @members', async ({
    baseURL,
  }) => {
    const inviteMemberBeCall = async (accessToken: string, orgId: number, member: InviteUserToOrg) => {
      const params: RequestParams = { baseURL, accessToken, path: `/v1/orgs/${orgId}/members`, data: member };
      const ctx = await getRequestContext(params);

      const response: APIResponse = await ctx.post(params.path, { data: params.data });
      const responseData = await response.json();

      return { status: response.status(), data: responseData };
    };
    const newUser = getUser();
    const unauthorizedCode = 401;
    const badRequestCode = 400;
    const forbiddenCode = 403;

    const responseWrongToken = await inviteMemberBeCall('Wrong Token', org.id, {
      username: newUser.email,
      role: UserRoles.admin,
    });

    expect(responseWrongToken.status).toEqual(unauthorizedCode);
    expect(responseWrongToken.data.message).toEqual('Invalid credentials.');

    const responseNoUsername = await inviteMemberBeCall(adminToken, org.id, {
      username: '',
      role: UserRoles.admin,
    });

    expect(responseNoUsername.status).toEqual(badRequestCode);
    expect(responseNoUsername.data.message).toEqual(
      "invalid field Username: value '' must not be an empty string",
    );

    const responseNoRole = await inviteMemberBeCall(adminToken, org.id, {
      username: newUser.email,
      role: '',
    });

    expect(responseNoRole.status).toEqual(badRequestCode);
    expect(responseNoRole.data.message).toEqual('Invalid organization member role.');

    const responseWrongOrgId = await inviteMemberBeCall(adminToken, 0, {
      username: newUser.email,
      role: UserRoles.admin,
    });

    expect(responseWrongOrgId.status).toEqual(badRequestCode);
    expect(responseWrongOrgId.data.message).toEqual(
      'Incorrect organization ID',
    );

    const responseInvalidEmail = await inviteMemberBeCall(adminToken, org.id, {
      username: 'Invalid Email',
      role: UserRoles.admin,
    });

    expect(responseInvalidEmail.status).toEqual(badRequestCode);
    expect(responseInvalidEmail.data.message).toEqual('Failed to invite user');
  });
});
