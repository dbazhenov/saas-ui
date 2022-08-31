import { expect, test } from '@playwright/test';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import { OrganizationPage } from '@pages/organization.page';
import { SignInPage } from '@pages/signIn.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';

test.describe('Spec file for free users dashboard tests', async () => {
  let newAdmin1User: User;
  let newAdmin2User: User;
  let newTechnicalUser: User;
  let adminToken: string;
  let org: any;
  let firstUserWithoutOrg: User;
  let secondUserWithoutOrg: User;
  const firstOrgName = `new test#$%_org_${Date.now()}`;

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

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterAll(async () => {
    await portalAPI.deleteOrg(adminToken, org.id);
    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
    await oktaAPI.deleteUserByEmail(newAdmin2User.email);
    await oktaAPI.deleteUserByEmail(newTechnicalUser.email);
    if (firstUserWithoutOrg) {
      await oktaAPI.deleteUserByEmail(firstUserWithoutOrg.email);
    }

    if (secondUserWithoutOrg) {
      await oktaAPI.deleteUserByEmail(secondUserWithoutOrg.email);
    }
  });

  test('SAAS-T136 Verify portal free account user can create organization @freeUser @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also covers',
        description: 'Also covers: SAAS-T159 Verify user can create Org with special characters and spaces',
      },
      {
        type: 'Also covers',
        description: 'SAAS-T139 Verify portal user can create organization with already existing name',
      },
    );
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);
    const signInPage = new SignInPage(page);

    firstUserWithoutOrg = getUser();
    secondUserWithoutOrg = getUser();
    await oktaAPI.createUser(firstUserWithoutOrg);

    await oktaAPI.loginByOktaApi(firstUserWithoutOrg, page);
    await dashboardPage.locators.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.locators.addOrganizationLocator.click();

    // wait due to rerender of the page.
    await page.waitForTimeout(2000);
    expect(await organizationPage.locators.organizationNameInput.getAttribute('placeholder')).toEqual(
      organizationPage.labels.orgNamePlaceholder,
    );
    await organizationPage.locators.organizationNameInput.type('Test', { delay: 100 });
    await organizationPage.locators.organizationNameInput.fill('');
    expect(await organizationPage.locators.organizationNameInputError.textContent()).toEqual(
      organizationPage.messages.requiredField,
    );
    await organizationPage.locators.organizationNameInput.type(firstOrgName);
    await organizationPage.locators.createOrgButton.click();
    await organizationPage.toast.checkToastMessage(organizationPage.messages.orgCreatedSuccessfully);
    expect(await organizationPage.locators.organizationName.textContent()).toEqual(firstOrgName);
    await organizationPage.uiUserLogout();

    await signInPage.signInContainer.waitFor({ state: 'visible' });
    secondUserWithoutOrg = getUser();
    await oktaAPI.createUser(secondUserWithoutOrg);
    await oktaAPI.loginByOktaApi(secondUserWithoutOrg, page);
    await dashboardPage.locators.addOrganizationLocator.click();
    await page.waitForTimeout(2000);
    await organizationPage.locators.organizationNameInput.type(firstOrgName);
    await organizationPage.locators.createOrgButton.click();
    await organizationPage.toast.checkToastMessage(organizationPage.messages.orgCreatedSuccessfully);
    expect(await organizationPage.locators.organizationName.textContent()).toEqual(firstOrgName);
  });

  test('SAAS-T220 Verify free account admin user can update org name @freeUser @organizations', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    const newOrgName = `new_test_org_${Date.now()}`;

    await oktaAPI.loginByOktaApi(newAdmin1User, page);

    await dashboardPage.locators.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.locators.viewOrgLink.click();

    await organizationPage.locators.editOrgButton.click();
    await organizationPage.locators.editOrgSubmit.isDisabled();
    await organizationPage.locators.organizationNameInput.fill('');
    expect(await organizationPage.locators.organizationNameInputError.textContent()).toEqual(
      organizationPage.messages.requiredField,
    );
    await organizationPage.locators.organizationNameInput.fill(newOrgName);
    await organizationPage.locators.editOrgSubmit.click();
    await organizationPage.toast.checkToastMessage(organizationPage.messages.orgEditedSuccessfully);
    expect(await organizationPage.locators.organizationName.textContent()).toEqual(newOrgName);
  });

  test('SAAS-T221 Verify free account technical user is not able to update his organization name @freeUser @organizations', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    await oktaAPI.loginByOktaApi(newTechnicalUser, page);

    await dashboardPage.locators.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.locators.viewOrgLink.click();
    await organizationPage.locators.editOrgButton.waitFor({ state: 'visible' });
    expect(await organizationPage.locators.editOrgButton.isDisabled()).toBeTruthy();
  });
});
