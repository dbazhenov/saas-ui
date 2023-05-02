import { expect, test } from '@playwright/test';
import { NotFoundPage } from '@pages/notFound.page';
import { DashboardPage } from '@pages/dashboard.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';
import { SignInPage } from '@tests/pages/signIn.page';
import LandingPage from '@tests/pages/landing.page';
import PMMInstances from '@tests/pages/pmmInstances.page';
import PerconaDBaaS from '@tests/pages/perconaDbaas.page';

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
    await expect(notFoundPage.notFoundPageContainer).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    await expect(notFoundPage.notFoundImage).toBeVisible();
    await notFoundPage.notFoundHomeButton.click();
    await notFoundPage.waitForPortalLoaded();
    await notFoundPage.userDropdown.switchTheme();
    await page.goto('page1');
    await notFoundPage.notFoundPageContainer.waitFor({ state: 'visible' });
    await expect(notFoundPage.notFoundPageContainer).toHaveCSS('background-color', 'rgb(18, 18, 18)');
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
      await expect(dashboardPage.sideMenu.resourceMenu.documentationLink).toHaveAttribute(
        'href',
        dashboardPage.sideMenu.documentationLink,
      );

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
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.dashboard}`);

      await expect(dashboardPage.sideMenu.mainMenu.organization).toBeVisible();
      await dashboardPage.sideMenu.mainMenu.organization.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.organization}`);

      expect(await dashboardPage.sideMenu.mainMenu.pmmInstances.isVisible()).toBeTruthy();
      await dashboardPage.sideMenu.mainMenu.pmmInstances.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.instances}`);

      await expect(dashboardPage.sideMenu.mainMenu.dbaas).toBeVisible();
      await dashboardPage.sideMenu.mainMenu.dbaas.click();
      await expect(page).toHaveURL(`${baseURL}${dashboardPage.routes.dbaas}`);
    });
  }

  test.skip('SAAS-T280 - Verify documentation links on Portal @pages', async ({ page, context }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const pmmInstances = new PMMInstances(page);
    const perconaDBaaS = new PerconaDBaaS(page);

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(adminUser.email, adminUser.password);
    });

    await test.step(
      '2. Navigate to the PMM Instances page and verify How-to connect Percona Monitoring & Management link',
      async () => {
        await dashboardPage.sideMenu.mainMenu.pmmInstances.click();
        await expect(pmmInstances.elements.readMore).toHaveAttribute('href', pmmInstances.links.readMore);
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          pmmInstances.elements.readMore.click(),
        ]);

        await expect(newPage).toHaveTitle(pmmInstances.labels.readMore);
        await newPage.close();
      },
    );

    await test.step(
      '3. Navigate to the Percona Dbaas page and verify Install PMM with DBaaS link',
      async () => {
        await dashboardPage.sideMenu.mainMenu.dbaas.click();
        await expect(perconaDBaaS.buttons.readMore).toHaveAttribute('href', perconaDBaaS.links.readMore);

        await perconaDBaaS.buttons.start.click();

        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          perconaDBaaS.buttons.readMore.click(),
        ]);

        await expect(newPage).toHaveTitle(perconaDBaaS.labels.pmmWithDBaaSTitle);
        await newPage.close();
      },
    );
  });

  test('SAAS-T285 - Verify Profile Menu @pages', async ({ page, context }) => {
    const signInPage = new SignInPage(page);
    const landingPage = new LandingPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal. And Open Dropdown.', async () => {
      await signInPage.uiLogin(adminUser.email, adminUser.password);
      await dashboardPage.userDropdown.openUserDropdown();
    });

    await test.step(
      '2. Verify name and email are displayed and toggle for dark mode is visible',
      async () => {
        await dashboardPage.userDropdown.name.isVisible();
        await expect(dashboardPage.userDropdown.name).toContainText(
          `${adminUser.firstName} ${adminUser.lastName}`,
        );

        await dashboardPage.userDropdown.email.isVisible();
        await expect(dashboardPage.userDropdown.email).toContainText(adminUser.email);
        await dashboardPage.userDropdown.themeSwitch.isVisible();
      },
    );

    await test.step('3. Verify profile link and logout link', async () => {
      await dashboardPage.userDropdown.profileOption.isVisible();
      await expect(dashboardPage.userDropdown.profileOption).toHaveAttribute(
        'href',
        dashboardPage.routes.profile,
      );

      await dashboardPage.userDropdown.logoutOption.isVisible();
      await dashboardPage.userDropdown.logoutOption.click();
      await landingPage.landingPageContainer.isVisible();
    });
  });
});
