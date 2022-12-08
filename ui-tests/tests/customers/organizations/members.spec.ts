import { test } from '@playwright/test';
import { SignInPage } from '@pages/signIn.page';
import { OrganizationPage } from '@pages/organization.page';
import { MembersPage } from '@pages/members.page';
import { UserRoles } from '@support/enums/userRoles';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import User from '@support/types/user.interface';
import { serviceNowAPI } from '@api/serviceNow';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@helpers/portalHelper';
import {
  deleteMailosaurMessage,
  getMailosaurEmailAddress,
  getMailosaurMessage,
  getRandomMailosaurEmailAddress,
} from '@tests/api/helpers';

test.describe('Spec file for organization tests for customers', async () => {
  let serviceNowCredentials: ServiceNowResponse;
  let customerAdmin1User: User;
  let customerAdmin2User: User;
  let customerTechnicalUser: User;
  let freeUser: User;
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    serviceNowCredentials = await serviceNowAPI.createServiceNowCredentials();

    customerAdmin1User = getUser(serviceNowCredentials.contacts.admin1.email);
    customerAdmin2User = getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnicalUser = getUser(serviceNowCredentials.contacts.technical.email);
    freeUser = getUser();
    freeUser.email = getMailosaurEmailAddress(freeUser);

    await oktaAPI.createUser(customerAdmin1User, true);
    await oktaAPI.createUser(customerAdmin2User, true);
    await oktaAPI.createUser(customerTechnicalUser, true);
    await oktaAPI.createUser(freeUser, true);

    adminToken = await portalAPI.getUserAccessToken(customerAdmin1User.email, customerAdmin1User.password);
    await page.goto('/');
  });

  test.afterEach(async () => {
    const org = await portalAPI.getOrg(adminToken);

    if (org.orgs.length) {
      await portalAPI.deleteOrg(adminToken, org.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(customerAdmin1User.email);
    await oktaAPI.deleteUserByEmail(customerAdmin2User.email);
    await oktaAPI.deleteUserByEmail(customerTechnicalUser.email);
    await oktaAPI.deleteUserByEmail(freeUser.email);
  });

  test('SAAS-T174 Verify OrgAdmin can view list of Org Members @customers @members', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const membersPage = new MembersPage(page);
    const organizationPage = new OrganizationPage(page);

    const users = [
      {
        Name: `${customerAdmin1User.firstName} ${customerAdmin1User.lastName}`,
        Email: customerAdmin1User.email,
        Role: UserRoles.admin,
      },
      {
        Name: `${customerAdmin2User.firstName} ${customerAdmin2User.lastName}`,
        Email: customerAdmin2User.email,
        Role: UserRoles.admin,
      },
      {
        Name: `${customerTechnicalUser.firstName} ${customerTechnicalUser.lastName}`,
        Email: customerTechnicalUser.email,
        Role: UserRoles.technical,
      },
    ];

    users.sort((a, b) => (a.Name < b.Name ? -1 : 1));

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);

    await signInPage.toast.checkToastMessage(signInPage.customerOrgCreated);
    const org = await portalAPI.getOrg(adminToken);

    await portalAPI.inviteOrgMember(adminToken, org.orgs[0].id, {
      username: customerAdmin2User.email,
      role: UserRoles.admin,
    });
    await portalAPI.inviteOrgMember(adminToken, org.orgs[0].id, {
      username: customerTechnicalUser.email,
      role: UserRoles.technical,
    });
    await page.reload();
    await signInPage.sideMenu.mainMenu.organization.click();

    await organizationPage.membersTab.click();

    await membersPage.membersTable.verifyMembersTable(users);
  });

  test('SAAS-T223 Verify Percona Customer user can see list of members for his organization @customers @members', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T168 Verify OrgAdmin can invite members to organization success flow',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T250 Verify confirmation message appears when the invitation was sent',
      },
    );

    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    await organizationPage.toast.checkToastMessage(organizationPage.customerOrgCreated);
    await organizationPage.sideMenu.mainMenu.organization.click();
    await organizationPage.membersTab.click();

    await membersPage.membersTable.verifyUserMembersTable(customerAdmin1User, UserRoles.admin);
    await membersPage.membersTable.inviteMembers.inviteMember(customerAdmin2User.email);
    await membersPage.toast.checkToastMessage(
      membersPage.membersTable.inviteMembers.memberSuccessfullyInvited,
    );
    await membersPage.membersTable.verifyUserMembersTable(customerAdmin2User, UserRoles.admin);
    await membersPage.membersTable.inviteMembers.inviteMember(
      customerTechnicalUser.email,
      UserRoles.technical,
    );
    await membersPage.toast.checkToastMessage(
      membersPage.membersTable.inviteMembers.memberSuccessfullyInvited,
    );
    await membersPage.membersTable.verifyUserMembersTable(customerTechnicalUser, UserRoles.technical);
    const org = await portalAPI.getOrg(adminToken);
    const invitedTechnicalUserEmail = getRandomMailosaurEmailAddress();

    await membersPage.membersTable.inviteMembers.inviteMember(invitedTechnicalUserEmail, UserRoles.technical);
    await membersPage.toast.checkToastMessage(
      membersPage.membersTable.inviteMembers.memberSuccessfullyInvited,
    );
    await getMailosaurMessage(invitedTechnicalUserEmail, `Welcome to ${org.orgs[0].name}`);
    const invitedAdminUserEmail = getRandomMailosaurEmailAddress();

    await membersPage.membersTable.inviteMembers.inviteMember(invitedAdminUserEmail);
    await membersPage.toast.checkToastMessage(
      membersPage.membersTable.inviteMembers.memberSuccessfullyInvited,
    );
    await getMailosaurMessage(invitedAdminUserEmail, `Welcome to ${org.orgs[0].name}`);
  });

  test('SAAS-T229 Verify admin can invite other members to organization (percona customer account) @customers @members', async ({
    page,
  }) => {
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    let org;

    await test.step('1. Login to the portal and navigate to the members tab', async () => {
      await oktaAPI.loginByOktaApi(customerAdmin1User, page);
      await organizationPage.toast.checkToastMessage(organizationPage.customerOrgCreated);
      org = await portalAPI.getOrg(adminToken);

      await organizationPage.sideMenu.mainMenu.organization.click();
      await organizationPage.membersTab.click();
    });

    await test.step(
      '2. Invite registered user to the org and verify that him/her receives the email notification that admin invited him/her to the specific org',
      async () => {
        await membersPage.membersTable.inviteMembers.inviteMember(freeUser.email, UserRoles.admin);
        const message = await getMailosaurMessage(freeUser.email, `Welcome to ${org.orgs[0].name}`);

        await deleteMailosaurMessage(message.id);
      },
    );
    await test.step('3. Verify members table invited user is present with correct role', async () => {
      await membersPage.membersTable.verifyUserMembersTable(freeUser, UserRoles.admin);
    });
  });
});
