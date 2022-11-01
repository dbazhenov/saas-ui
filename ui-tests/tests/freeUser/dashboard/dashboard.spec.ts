import { expect, test } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { DashboardPage } from '@pages/dashboard.page';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for free users dashboard tests', async () => {
  let newAdmin1User: User;
  let newAdmin2User: User;
  let newTechnicalUser: User;
  let adminToken: string;
  let org: any;

  test.beforeAll(async () => {
    newAdmin1User = getUser();
    newAdmin2User = getUser();
    newTechnicalUser = getUser();

    await oktaAPI.createUser(newAdmin1User, true);
    await oktaAPI.createUser(newAdmin2User, true);
    await oktaAPI.createUser(newTechnicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(newAdmin1User.email, newAdmin1User.password);
    const newOrg = await portalAPI.createOrg(adminToken);

    org = newOrg.org;

    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: newTechnicalUser.email,
      role: UserRoles.technical,
    });
    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: newAdmin2User.email,
      role: UserRoles.admin,
    });
  });

  test.afterAll(async () => {
    await portalAPI.deleteOrg(adminToken, org.id);
    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
    await oktaAPI.deleteUserByEmail(newAdmin2User.email);
    await oktaAPI.deleteUserByEmail(newTechnicalUser.email);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SAAS-T198 - Verify free account user is not able to get organization tickets @freeUser @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);

    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.locators.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
  });

  test('SAAS-T225 Verify Free account user is able to view Contacts (static) @freeUser @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);

    await dashboardPage.contacts.perconaContactsHeader.waitFor({ state: 'visible' });
    await expect(dashboardPage.contacts.emailContactLink).toHaveText(
      dashboardPage.contacts.contactsHelpEmail,
    );
    await expect(dashboardPage.contacts.emailContactLink).toHaveAttribute(
      'href',
      dashboardPage.contacts.mailtoPerconaHelpEmail,
    );

    await expect(dashboardPage.contacts.forumContactLink).toHaveText(
      dashboardPage.contacts.contactsHelpForums,
    );
    await expect(dashboardPage.contacts.forumContactLink).toHaveAttribute('target', '_blank');
    await expect(dashboardPage.contacts.forumContactLink).toHaveAttribute(
      'href',
      dashboardPage.contacts.contactsHelpForumsLink,
    );

    await expect(dashboardPage.contacts.discordContactLink).toHaveText(
      dashboardPage.contacts.contactsHelpDiscord,
    );
    await expect(dashboardPage.contacts.discordContactLink).toHaveAttribute('target', '_blank');
    await expect(dashboardPage.contacts.discordContactLink).toHaveAttribute(
      'href',
      dashboardPage.contacts.contactsHelpDiscordLink,
    );

    await expect(dashboardPage.contacts.contactPageLink).toHaveText(dashboardPage.contacts.contactPageLabel);
    await expect(dashboardPage.contacts.contactPageLink).toHaveAttribute('target', '_blank');
    await expect(dashboardPage.contacts.contactPageLink).toHaveAttribute(
      'href',
      dashboardPage.contacts.contactPageLinkAddress,
    );
  });
});
