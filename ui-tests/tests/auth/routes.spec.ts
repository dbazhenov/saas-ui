import { expect, test } from '@playwright/test';
import { SignInPage } from '@pages/signIn.page';

test.describe('Spec file for dashboard tests for customers', async () => {
  test('SAAS-T248 - Verify incorrect links are redirected to login page for unauthorised users @routes @auth', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);

    await page.goto('/pmm-instances');
    await signInPage.signInContainer.waitFor({ state: 'visible', timeout: 10000 });
    expect(page.url()).toContain('/login');
    await page.goto('/123');
    await signInPage.signInContainer.waitFor({ state: 'visible', timeout: 10000 });
    expect(page.url()).toContain('/login');
  });
});
