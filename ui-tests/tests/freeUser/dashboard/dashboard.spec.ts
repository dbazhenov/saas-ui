import { expect, test } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';

test.describe('Spec file for free users dashboard tests', async () => {
  let newAdmin1User: User;
  let newAdmin2User: User;
  let newTechnicalUser: User;
  let adminToken: string;
  let org: any;

  test.beforeAll(async () => {
    newAdmin1User = await getUser();
    newAdmin2User = await getUser();
    newTechnicalUser = await getUser();

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

    await dashboardPage.locators.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.locators.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
  });

  test('SAAS-T225 Verify Free account user is able to view Contacts (static) @freeUser @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);

    await dashboardPage.locators.perconaContactsHeader.waitFor({ state: 'visible' });

    await expect(dashboardPage.locators.emailContactLink).toHaveText(dashboardPage.labels.contactsHelpEmail);
    expect(await dashboardPage.locators.emailContactLink.getAttribute('href')).toEqual(
      `mailto:${dashboardPage.labels.contactsHelpEmail}`,
    );

    expect(await dashboardPage.locators.forumContactLink.textContent()).toEqual(
      dashboardPage.labels.contactsHelpForums,
    );
    expect(await dashboardPage.locators.forumContactLink.getAttribute('target')).toEqual('_blank');
    expect(await dashboardPage.locators.forumContactLink.getAttribute('href')).toEqual(
      dashboardPage.links.contactsHelpForumsLink,
    );

    expect(await dashboardPage.locators.discordContactLink.textContent()).toEqual(
      dashboardPage.labels.contactsHelpDiscord,
    );
    expect(await dashboardPage.locators.discordContactLink.getAttribute('target')).toEqual('_blank');
    expect(await dashboardPage.locators.discordContactLink.getAttribute('href')).toEqual(
      dashboardPage.links.contactsHelpDiscordLink,
    );

    expect(await dashboardPage.locators.contactPageLink.textContent()).toEqual(
      dashboardPage.labels.contactPage,
    );
    expect(await dashboardPage.locators.contactPageLink.getAttribute('target')).toEqual('_blank');
    expect(await dashboardPage.locators.contactPageLink.getAttribute('href')).toEqual(
      dashboardPage.links.contactPageAddress,
    );
  });
});
