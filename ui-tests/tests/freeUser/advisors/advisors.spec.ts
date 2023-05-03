import { expect, test } from '@playwright/test';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { SignInPage } from '@tests/pages/signIn.page';
import { AdvisorsPage } from '@tests/pages/advisors.page';

test.describe('Spec file for free user activity log tests', async () => {
  let adminUser: User;

  test.beforeAll(async () => {
    adminUser = await oktaAPI.createTestUser();
    const adminToken = await portalAPI.getUserAccessToken(adminUser.email, adminUser.password);

    await portalAPI.createOrg(adminToken);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterAll(async () => {
    await portalAPI.deleteUserOrgIfExists(adminUser);
    await oktaAPI.deleteUserByEmail(adminUser.email);
  });

  test('SAAS-T291 Verify there is a new page "Advisors" log @freeUser @advisors', async ({ page }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T292 Verify Advanced Advisors for users with free account',
    });

    const signInPage = new SignInPage(page);
    const advisorsPage = new AdvisorsPage(page);

    await test.step('1. Login to portal and verify that advisors menu link is visible.', async () => {
      await signInPage.uiLogin(adminUser.email, adminUser.password);
      await advisorsPage.sideMenu.buttons.advisors.waitFor({ state: 'visible' });
    });

    await test.step('2. Navigate to the Advisors page and verify advisors types', async () => {
      await advisorsPage.sideMenu.buttons.advisors.click();
      await advisorsPage.buttons.start.click();
      await advisorsPage.buttons.securityAdvisors.waitFor({ state: 'visible' });
      await advisorsPage.buttons.configurationAdvisors.waitFor({ state: 'visible' });
      await advisorsPage.buttons.queryAdvisors.waitFor({ state: 'visible' });
      await advisorsPage.buttons.performanceAdvisors.waitFor({ state: 'visible' });
    });

    await test.step('3. Verify security advisors tab', async () => {
      await advisorsPage.buttons.securityAdvisors.click();
      await advisorsPage.buttons.advancedAdvisors.waitFor({ state: 'visible' });
      await expect(advisorsPage.elements.expandedAccordion).toBeHidden();
      await advisorsPage.buttons.advancedAdvisors.click();
      await expect(advisorsPage.elements.advancedAdvisorsAccordions.first()).toBeVisible();
      await expect(advisorsPage.buttons.contactSales).toHaveAttribute(
        'href',
        advisorsPage.links.contactSales,
      );
    });

    await test.step('4. Verify configuration advisors tab', async () => {
      await advisorsPage.buttons.configurationAdvisors.click();
      await advisorsPage.buttons.advancedAdvisors.waitFor({ state: 'visible' });
      await expect(advisorsPage.elements.expandedAccordion).toBeHidden();
      await advisorsPage.buttons.advancedAdvisors.click();
      await expect(advisorsPage.elements.advancedAdvisorsAccordions.first()).toBeVisible();
      await expect(advisorsPage.buttons.contactSales).toHaveAttribute(
        'href',
        advisorsPage.links.contactSales,
      );
    });

    await test.step('5. Verify query advisors tab', async () => {
      await advisorsPage.buttons.queryAdvisors.click();
      await advisorsPage.buttons.advancedAdvisors.waitFor({ state: 'visible' });
      await expect(advisorsPage.elements.expandedAccordion).toBeHidden();
      await advisorsPage.buttons.advancedAdvisors.click();
      await expect(advisorsPage.elements.advancedAdvisorsAccordions.first()).toBeVisible();
      await expect(advisorsPage.buttons.contactSales).toHaveAttribute(
        'href',
        advisorsPage.links.contactSales,
      );
    });

    await test.step('6. Verify all query advisors have their items collapsed', async () => {
      await advisorsPage.buttons.performanceAdvisors.click();
      await advisorsPage.buttons.advancedAdvisors.waitFor({ state: 'visible' });
      await expect(advisorsPage.elements.expandedAccordion).toBeHidden();
      await advisorsPage.buttons.advancedAdvisors.click();
      await expect(advisorsPage.elements.advancedAdvisorsAccordions.first()).toBeVisible();
      await expect(advisorsPage.buttons.contactSales).toHaveAttribute(
        'href',
        advisorsPage.links.contactSales,
      );
    });

    await test.step('7. Verify more info button', async () => {
      await expect(advisorsPage.buttons.moreInfo).toHaveText(advisorsPage.labels.moreInfo);
      await advisorsPage.buttons.moreInfo.click();
      await expect(advisorsPage.modal.elements.modalHeader).toHaveText(advisorsPage.messages.welcome);
      await expect(advisorsPage.modal.elements.modalContent).toHaveText(advisorsPage.messages.welcomeBody);
      await advisorsPage.buttons.start.click();
      await expect(advisorsPage.modal.elements.modalHeader).toBeHidden();
    });
  });
});
