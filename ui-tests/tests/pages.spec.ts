import { expect, test } from '@playwright/test';
import { NotFoundPage } from '@pages/notFound.page';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;
  let technicalUser: User;
  const users: User[] = [];

  test.beforeAll(async () => {
    adminUser = await getUser();
    technicalUser = await getUser();
    await oktaAPI.createUser(adminUser, true);
    await oktaAPI.createUser(technicalUser, true);
    users.push(adminUser, technicalUser);
  });

  test.afterAll(async () => {
    await oktaAPI.deleteUserByEmail(adminUser.email);
    await oktaAPI.deleteUserByEmail(technicalUser.email);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SAAS-T118 - Verify access to a non-existent private route returns 404 page @pages', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T119 Verify user can navigate back to Homepage from 404 for private route',
    });
    const notFoundPage = new NotFoundPage(page);

    await oktaAPI.loginByOktaApi(adminUser, page);
    await notFoundPage.waitForPortalLoaded();
    await page.goto('page1');
    await notFoundPage.locators.notFoundPageContainer.waitFor({ state: 'visible' });
    const colorLightMode = await notFoundPage.locators.notFoundPageContainer.evaluate((element) =>
      window.getComputedStyle(element).getPropertyValue('background-color'),
    );

    expect(colorLightMode).toEqual('rgb(247, 248, 250)');
    expect(await notFoundPage.locators.notFoundImage.isVisible()).toBeTruthy();
    await notFoundPage.locators.notFoundHomeButton.click();
    await notFoundPage.waitForPortalLoaded();
    await notFoundPage.themeSwitch.click();
    await page.goto('page1');
    await notFoundPage.locators.notFoundPageContainer.waitFor({ state: 'visible' });
    const colorDarkMode = await notFoundPage.locators.notFoundPageContainer.evaluate((element) =>
      window.getComputedStyle(element).getPropertyValue('background-color'),
    );

    expect(colorDarkMode).toEqual('rgb(11, 12, 14)');
    expect(await notFoundPage.locators.notFoundImage.isVisible()).toBeTruthy();
    await notFoundPage.locators.notFoundHomeButton.click();
    await notFoundPage.waitForPortalLoaded();
  });

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 2; i++) {
    test(`SAAS-T203 - Verify Percona Portal Resources menu tab content and links ${i} @pages`, async ({
      page,
    }) => {
      const dashboardPage = new DashboardPage(page);

      await oktaAPI.loginByOktaApi(users[i], page);

      expect(await dashboardPage.sideMenu.resourcesHeader.textContent()).toEqual(
        dashboardPage.sideMenu.resourcesLabel,
      );

      expect(await dashboardPage.sideMenu.resourceMenu.documentationLink.getAttribute('target')).toEqual(
        '_blank',
      );
      expect(await dashboardPage.sideMenu.resourceMenu.documentationLink.getAttribute('href')).toEqual(
        dashboardPage.sideMenu.documentationLink,
      );

      expect(await dashboardPage.sideMenu.resourceMenu.blogLink.getAttribute('target')).toEqual('_blank');
      expect(await dashboardPage.sideMenu.resourceMenu.blogLink.getAttribute('href')).toEqual(
        dashboardPage.sideMenu.blogLink,
      );

      expect(await dashboardPage.sideMenu.resourceMenu.forumLink.getAttribute('target')).toEqual('_blank');
      expect(await dashboardPage.sideMenu.resourceMenu.forumLink.getAttribute('href')).toEqual(
        dashboardPage.sideMenu.forumLink,
      );

      expect(await dashboardPage.sideMenu.resourceMenu.portalHelpLink.getAttribute('target')).toEqual(
        '_blank',
      );
      expect(await dashboardPage.sideMenu.resourceMenu.portalHelpLink.getAttribute('href')).toEqual(
        dashboardPage.sideMenu.portalHelpLink,
      );

      expect(await dashboardPage.sideMenu.mainHeader.textContent()).toEqual(dashboardPage.sideMenu.mainLabel);

      expect(await dashboardPage.sideMenu.mainMenu.dashboard.isVisible()).toBeTruthy();
      expect(await dashboardPage.sideMenu.mainMenu.dashboard.getAttribute('href')).toEqual('/');

      expect(await dashboardPage.sideMenu.mainMenu.organization.isVisible()).toBeTruthy();
      expect(await dashboardPage.sideMenu.mainMenu.organization.getAttribute('href')).toEqual(
        '/organization',
      );

      expect(await dashboardPage.sideMenu.mainMenu.pmmInstances.isVisible()).toBeTruthy();
      expect(await dashboardPage.sideMenu.mainMenu.pmmInstances.getAttribute('href')).toEqual(
        '/pmm-instances',
      );
    });
  }
});
