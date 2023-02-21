import { expect, test } from '@playwright/test';
import { SignInPage } from '@pages/signIn.page';

test.describe('Spec file for dashboard tests for customers', async () => {
  test('SAAS-T248 - Verify incorrect links are redirected to login page for unauthorized users @routes @auth', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);

    await page.goto(signInPage.routes.instances);
    await signInPage.elements.signInContainer.waitFor({ state: 'visible', timeout: 10000 });
    expect(page.url()).toContain(signInPage.routes.login);
    await page.goto('/123');
    await signInPage.elements.signInContainer.waitFor({ state: 'visible', timeout: 10000 });
    expect(page.url()).toContain(signInPage.routes.login);
  });
});
