import { expect, test } from '@playwright/test';
import { NotFoundPage } from '@pages/notFound.page';
import { DashboardPage } from '@pages/dashboard.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;
  let technicalUser: User;
  const users: User[] = [];

  test.beforeAll(async () => {
    adminUser = getUser();
    technicalUser = getUser();
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
    await notFoundPage.notFoundPageContainer.waitFor({ state: 'visible' });
    await expect(notFoundPage.notFoundPageContainer).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    );

    await expect(notFoundPage.notFoundImage).toBeVisible();
    await notFoundPage.notFoundHomeButton.click();
    await notFoundPage.waitForPortalLoaded();
    await notFoundPage.themeSwitch.click();
    await page.goto('page1');
    await notFoundPage.notFoundPageContainer.waitFor({ state: 'visible' });
    await expect(notFoundPage.notFoundPageContainer).toHaveCSS(
      'background-color',
      'rgb(18, 18, 18)',
    );
    await expect(notFoundPage.notFoundImage).toBeVisible();
    await notFoundPage.notFoundHomeButton.click();
    await notFoundPage.waitForPortalLoaded();
  });

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 2; i++) {
    test(`SAAS-T203 - Verify Percona Portal Resources menu tab content and links ${i} @pages`, async ({
      page,
      baseURL,
    }) => {
      const dashboardPage = new DashboardPage(page);

      await oktaAPI.loginByOktaApi(users[i], page);
      await expect(dashboardPage.sideMenu.resourceMenu.documentationLink).toHaveAttribute('target', '_blank');
      await expect(dashboardPage.sideMenu.resourceMenu.documentationLink).toHaveAttribute('href', dashboardPage.sideMenu.documentationLink);

      await expect(dashboardPage.sideMenu.resourceMenu.blogLink).toHaveAttribute('target', '_blank');
      await expect(dashboardPage.sideMenu.resourceMenu.blogLink).toHaveAttribute(
        'href',
        dashboardPage.sideMenu.blogLink,
      );

      await expect(dashboardPage.sideMenu.resourceMenu.forumLink).toHaveAttribute('target', '_blank');
      await expect(dashboardPage.sideMenu.resourceMenu.forumLink).toHaveAttribute(
        'href',
        dashboardPage.sideMenu.forumLink,
      );

      await expect(dashboardPage.sideMenu.resourceMenu.portalHelpLink).toHaveAttribute('target', '_blank');
      await expect(dashboardPage.sideMenu.resourceMenu.portalHelpLink).toHaveAttribute(
        'href',
        dashboardPage.sideMenu.portalHelpLink,
      );

      expect(await dashboardPage.sideMenu.mainMenu.dashboard.isVisible()).toBeTruthy();
      await dashboardPage.sideMenu.mainMenu.dashboard.click();
      await expect(page).toHaveURL(baseURL);

      await expect(dashboardPage.sideMenu.mainMenu.organization).toBeVisible();
      await dashboardPage.sideMenu.mainMenu.organization.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.organization}`);

      expect(await dashboardPage.sideMenu.mainMenu.pmmInstances.isVisible()).toBeTruthy();
      await dashboardPage.sideMenu.mainMenu.pmmInstances.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.instances}`);

      await expect(dashboardPage.sideMenu.mainMenu.freeKubernetes).toBeVisible();
      await dashboardPage.sideMenu.mainMenu.freeKubernetes.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.kubernetes}`);
    });
  }
});
