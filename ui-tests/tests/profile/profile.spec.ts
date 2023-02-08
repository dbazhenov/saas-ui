import { expect, test } from '@playwright/test';
import ProfilePage from '@pages/profile.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';
import pageHelper from '@tests/helpers/pageHelper';

test.describe('Spec file for dashboard tests for customers', async () => {
  let newAdmin1User: User;

  test.beforeEach(async ({ page }) => {
    newAdmin1User = getUser();
    await oktaAPI.createUser(newAdmin1User, true);
    await page.goto('/');
  });

  test.afterEach(async () => {
    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
  });

  test('SAAS-T128 - Verify Percona Portal Profile page @profile', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-write', 'clipboard-read']);
    const profilePage = new ProfilePage(page);

    await test.step('1. Login to the portal and navigate to the profile section', async () => {
      await oktaAPI.loginByOktaApi(newAdmin1User, page);
      await profilePage.userDropdown.openUserProfile();
    });

    await test.step('2. Check "My Profile" elements', async () => {
      await expect(profilePage.elements.myProfileHeader).toHaveText(profilePage.labels.myProfileHeader);
      await expect(profilePage.elements.userName).toContainText(
        `${newAdmin1User.firstName} ${newAdmin1User.lastName}`,
      );
      await expect(profilePage.elements.userEmail).toContainText(newAdmin1User.email);
      await expect(profilePage.buttons.editProfile).toHaveText(profilePage.labels.editProfile);

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        profilePage.buttons.editProfile.click(),
      ]);

      expect(newPage.url()).toEqual(profilePage.links.oktaUrl);
      await newPage.close();
    });

    await test.step('3. Check Percona Platform Access Token', async () => {
      const bearerToken = await pageHelper.getAccessToken(page);

      await expect(profilePage.elements.tokenHeader).toHaveText(profilePage.labels.tokenHeader);
      await expect(profilePage.buttons.copyToken).toHaveText(profilePage.labels.copyToken);
      await profilePage.buttons.copyToken.click();
      await profilePage.toast.checkToastMessage(profilePage.messages.tokenCopied);
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

      expect(clipboardContent).toEqual(bearerToken);
    });
  });
});
