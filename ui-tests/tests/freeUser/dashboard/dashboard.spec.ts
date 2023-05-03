import { expect, test } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { DashboardPage } from '@pages/dashboard.page';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { SignInPage } from '@tests/pages/signIn.page';

test.describe('Spec file for free users dashboard tests', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let adminToken: string;
  let org: any;

  test.beforeAll(async () => {
    admin1User = await oktaAPI.createTestUser();
    admin2User = await oktaAPI.createTestUser();
    technicalUser = await oktaAPI.createTestUser();
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    org = (await portalAPI.createOrg(adminToken)).org;

    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: technicalUser.email,
      role: UserRoles.technical,
    });
    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: admin2User.email,
      role: UserRoles.admin,
    });
  });

  test.afterAll(async () => {
    await portalAPI.deleteOrg(adminToken, org.id);
    await oktaAPI.deleteUsers([admin1User, admin2User, technicalUser]);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SAAS-T198 - Verify free account user is not able to get organization tickets @freeUser @dashboard', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
    });

    await test.step('2. Verify that tickets are not displayed.', async () => {
      await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
      await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });
      await dashboardPage.elements.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
    });
  });

  test('SAAS-T290 - Verify there is Advisors widget on Home dashboard @freeUser @dashboard @advisors', async ({
    page,
    baseURL,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
    });

    await test.step('2. Verify that advisors widget is displayed.', async () => {
      await dashboardPage.elements.advisorsWidget.waitFor({ state: 'visible' });
    });

    await test.step('3. Verify navigation to the advisors using button on the widget.', async () => {
      await dashboardPage.buttons.advisorsButton.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.advisors}`);
    });
  });

  test('SAAS-T225 Verify Free account user is able to view Contacts (static) @freeUser @dashboard', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
    });

    await test.step('2. Verify Percona contact email.', async () => {
      await dashboardPage.contacts.perconaContactsHeader.waitFor({ state: 'visible' });
      await expect(dashboardPage.contacts.emailContactLink).toHaveText(
        dashboardPage.contacts.contactsHelpEmail,
      );
      await expect(dashboardPage.contacts.emailContactLink).toHaveAttribute(
        'href',
        dashboardPage.contacts.mailtoPerconaHelpEmail,
      );
    });

    await test.step('3. Verify percona community links.', async () => {
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

      await expect(dashboardPage.contacts.contactPageLink).toHaveText(
        dashboardPage.contacts.contactPageLabel,
      );
      await expect(dashboardPage.contacts.contactPageLink).toHaveAttribute('target', '_blank');
      await expect(dashboardPage.contacts.contactPageLink).toHaveAttribute(
        'href',
        dashboardPage.contacts.contactPageLinkAddress,
      );
    });
  });
});
