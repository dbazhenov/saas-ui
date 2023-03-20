import { expect, test } from '@playwright/test';
import { serviceNowAPI } from '@api/serviceNow';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import User from '@support/types/user.interface';
import { DashboardPage } from '@tests/pages/dashboard.page';
import PMMInstances from '@tests/pages/pmmInstances.page';
import { SignInPage } from '@tests/pages/signIn.page';
import { pmmAPI } from '@tests/api/pmmApi';
import { UserRoles } from '@tests/support/enums/userRoles';
import Timeout from '@tests/helpers/timeout';

test.describe('Spec file for PMM instances list tests for customers', async () => {
  test.describe.configure({ mode: 'serial' });
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let adminToken: string;
  const serverName = `Test Name ${new Date().getTime()}`;

  test.beforeAll(async () => {
    [admin1User, admin2User, technicalUser] = await serviceNowAPI.createServiceNowUsers();
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    const { org } = await portalAPI.createOrg(adminToken, `Connecting PMM Org ${new Date().getTime()}`);

    await portalAPI.inviteUserToOrg(adminToken, org.id, admin2User.email, UserRoles.admin);
    await portalAPI.inviteUserToOrg(adminToken, org.id, technicalUser.email, UserRoles.technical);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterAll(async () => {
    await portalAPI.deleteUserOrgIfExists(admin1User);
    await oktaAPI.deleteUserByEmail(admin1User.email);
    await oktaAPI.deleteUserByEmail(admin2User.email);
    await oktaAPI.deleteUserByEmail(technicalUser.email);
  });

  test('SAAS-T232 Verify Read-more for Connecting PMM and portal @customers @pmmInstances', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const pmmInstances = new PMMInstances(page);

    await test.step(
      'Login to the portal, navigate to the pmm instances page. and click on Read-more for Connect your PMM item',
      async () => {
        await oktaAPI.loginByOktaApi(admin1User, page);
        await dashboardPage.sideMenu.mainMenu.pmmInstances.click();
        await pmmInstances.elements.tableContainer.waitFor({ state: 'visible' });
      },
    );

    await test.step('Verify Read-more for Connect your PMM item', async () => {
      await expect(pmmInstances.elements.readMore).toHaveAttribute('href', pmmInstances.links.readMore);
      await expect(pmmInstances.elements.readMore).toHaveText(pmmInstances.messages.readMore);
    });
  });

  test('SAAS-T227 Verify user is able to see list of connected pmm instances @customers @pmmInstances', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const pmmInstances = new PMMInstances(page);
    let serverInfo;

    await test.step('1. Connect PMM to the Portal.', async () => {
      serverInfo = await pmmAPI.serverInfo();
      await pmmAPI.changePublicAddress();
      await pmmAPI.connectToPortal(serverName, adminToken);
    });

    await test.step('2. Login to the portal, navigate to the pmm instances page.', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await pmmInstances.sideMenu.mainMenu.pmmInstances.click();
    });

    await test.step('3. Verify PMM Instances table shows connected PMM', async () => {
      await pmmInstances.instancesTable.elements.rowByText(serverName).waitFor({ state: 'visible' });
      await pmmInstances.instancesTable.verifyInstanceInTable(
        serverName,
        serverInfo.pmm_server_id,
        'https://pmm.local/graph',
      );
    });
  });

  test('SAAS-T230 Verify content for view for connected PMM instances @customers @pmmInstances', async ({
    page,
    context,
  }) => {
    const signInPage = new SignInPage(page);
    const pmmInstances = new PMMInstances(page);

    await test.step('1. Login to the portal, navigate to the pmm instances page.', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await pmmInstances.sideMenu.mainMenu.pmmInstances.click();
    });

    await test.step('2. Verify headers in pmm instances table.', async () => {
      await expect(pmmInstances.instancesTable.elements.headerCell.nth(0)).toHaveText(
        pmmInstances.instancesTable.labels.serverName,
      );
      await expect(pmmInstances.instancesTable.elements.headerCell.nth(1)).toHaveText(
        pmmInstances.instancesTable.labels.serverId,
      );
      await expect(pmmInstances.instancesTable.elements.headerCell.nth(2)).toHaveText(
        pmmInstances.instancesTable.labels.serverUrl,
      );
    });

    await test.step('3. Click on server url and verify pmm is loaded.', async () => {
      const [pmmPage] = await Promise.all([
        context.waitForEvent('page'),
        pmmInstances.elements.serverUrl('pmm.local').click(),
      ]);

      await pmmPage
        .locator('//*[contains(@class, "login-content-box")]')
        .waitFor({ state: 'visible', timeout: Timeout.ThreeMinutes });
      await pmmPage.waitForFunction(() => document.title === 'Percona Monitoring and Management', {
        timeout: Timeout.OneMinute,
      });
      await pmmPage.close();
    });
  });

  test('SAAS-T244 Verify user with Org Technical role can NOT remove PMM instance form the list @customers @pmmInstances', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const pmmInstances = new PMMInstances(page);

    await test.step('1. Login as technical user and navigate to the PMM Instances page.', async () => {
      await signInPage.uiLogin(technicalUser.email, technicalUser.password);
      await pmmInstances.sideMenu.mainMenu.pmmInstances.click();
    });

    await test.step('2. Verify user cannot remove PMM Instance.', async () => {
      await pmmInstances.instancesTable.elements.removePmm(serverName).waitFor({ state: 'visible' });
      await expect(pmmInstances.instancesTable.elements.removePmm(serverName)).toBeDisabled();
    });
  });

  test('SAAS-T243 Verify user with Org Amin role can remove PMM instance form the list @customers @pmmInstances', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const pmmInstances = new PMMInstances(page);

    await test.step('1. Login as admin user and navigate to the PMM Instances page.', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await pmmInstances.sideMenu.mainMenu.pmmInstances.click();
    });

    await test.step('2. Verify user can remove PMM Instance.', async () => {
      await pmmInstances.instancesTable.elements.removePmm(serverName).waitFor({ state: 'visible' });
      await pmmInstances.instancesTable.elements.removePmm(serverName).click();
      await expect(pmmInstances.elements.modal.header).toHaveText(pmmInstances.labels.removePmmHeader);
      await expect(pmmInstances.elements.modal.body).toContainText(
        pmmInstances.messages.removePmmBody(serverName),
      );
      await pmmInstances.buttons.submitRemovePmm.click();
      await expect(pmmInstances.instancesTable.elements.table).not.toContainText(serverName);
    });
  });
});
