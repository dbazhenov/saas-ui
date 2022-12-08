import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { OrganizationPage } from '@pages/organization.page';
import { SignInPage } from '@pages/signIn.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@helpers/portalHelper';
import { MembersPage } from '@tests/pages/members.page';

test.describe('Spec file for free users dashboard tests', async () => {
  let newAdmin1User: User;
  let newAdmin2User: User;
  let newTechnicalUser: User;
  let adminToken: string;
  let org: any;
  let firstUserWithoutOrg: User;
  let secondUserWithoutOrg: User;
  const firstOrgName = `new test#$%_org_${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    newAdmin1User = getUser();
    newAdmin2User = getUser();
    newTechnicalUser = getUser();

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
    await page.goto('/');
  });

  test.afterEach(async () => {
    const afterTestOrg = await portalAPI.getOrg(adminToken);

    if (afterTestOrg.orgs.length) {
      await portalAPI.deleteOrg(adminToken, afterTestOrg.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
    await oktaAPI.deleteUserByEmail(newAdmin2User.email);
    await oktaAPI.deleteUserByEmail(newTechnicalUser.email);
    if (firstUserWithoutOrg) {
      await oktaAPI.deleteUserByEmail(firstUserWithoutOrg.email);
      firstUserWithoutOrg = undefined;
    }

    if (secondUserWithoutOrg) {
      await oktaAPI.deleteUserByEmail(secondUserWithoutOrg.email);
      secondUserWithoutOrg = undefined;
    }
  });

  test('SAAS-T136 Verify portal free account user can create organization @freeUser @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T140 Verify portal user is automatically OrgAdmin for created organisation',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T159 Verify user can create Org with special characters and spaces',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T139 Verify portal user can create organization with already existing name',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T180 Verify user can view created Organization',
      },
    );

    const dashboardPage = new DashboardPage(page);
    const membersPage = new MembersPage(page);
    const organizationPage = new OrganizationPage(page);
    const signInPage = new SignInPage(page);

    firstUserWithoutOrg = getUser();
    await oktaAPI.createUser(firstUserWithoutOrg);

    await oktaAPI.loginByOktaApi(firstUserWithoutOrg, page);

    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await page.waitForTimeout(60000);
    await dashboardPage.addOrganizationLocator.click();

    // wait due to rerender of the page.
    await page.waitForTimeout(2000);
    await expect(organizationPage.organizationNameInput).toHaveAttribute(
      'placeholder',
      organizationPage.orgNamePlaceholder,
    );
    await organizationPage.organizationNameInput.type('Test', { delay: 100 });
    await organizationPage.organizationNameInput.fill('');

    await expect(organizationPage.createOrgButton).toBeDisabled();

    await organizationPage.organizationNameInput.type(firstOrgName);
    await organizationPage.createOrgButton.click();
    await organizationPage.toast.checkToastMessage(organizationPage.orgCreatedSuccessfully);
    await expect(organizationPage.organizationName).toHaveText(firstOrgName, { timeout: 60000 });

    await organizationPage.membersTab.click();
    await membersPage.membersTable.verifyMembersTableUserRole(firstUserWithoutOrg.email, UserRoles.admin);
    await membersPage.sideMenu.mainMenu.dashboard.click();

    await dashboardPage.gettingStarted.doneImageOrganizationSection.waitFor({ state: 'visible' });
    await expect(dashboardPage.gettingStarted.gettingStartedOrganizationLink).toHaveText(
      dashboardPage.gettingStarted.viewOrganization,
    );
    await expect(dashboardPage.gettingStarted.gettingStartedOrganizationLink).toHaveAttribute(
      'href',
      dashboardPage.routes.organization,
    );

    // wait due to rerender of the page.
    await page.waitForTimeout(2000);
    await expect(dashboardPage.gettingStarted.doneImageOrganizationSection).toHaveCSS('opacity', '1');

    await organizationPage.userDropdown.logoutUser();

    await signInPage.signInContainer.waitFor({ state: 'visible' });
    secondUserWithoutOrg = getUser();
    await oktaAPI.createUser(secondUserWithoutOrg);
    await oktaAPI.loginByOktaApi(secondUserWithoutOrg, page);
    await dashboardPage.addOrganizationLocator.click();
    await page.waitForTimeout(2000);
    await organizationPage.organizationNameInput.type(firstOrgName);
    await organizationPage.createOrgButton.click();
    await organizationPage.toast.checkToastMessage(organizationPage.orgCreatedSuccessfully);
    await expect(organizationPage.organizationName).toHaveText(firstOrgName);
  });

  test('SAAS-T220 Verify free account admin user can update org name @freeUser @organizations', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    const newOrgName = `new_test_org_${Date.now()}`;

    await oktaAPI.loginByOktaApi(newAdmin1User, page);

    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });

    await test.step("SAAS-T255 Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });

    await dashboardPage.sideMenu.mainMenu.organization.click();

    await organizationPage.editOrgButton.click();
    await organizationPage.editOrgSubmit.isDisabled();
    await organizationPage.organizationNameInput.fill('');
    await expect(organizationPage.organizationNameInputError).toHaveText(
      organizationPage.requiredField('Organization Name'),
    );
    await organizationPage.organizationNameInput.fill(newOrgName);
    await organizationPage.editOrgSubmit.click();
    await organizationPage.toast.checkToastMessage(organizationPage.orgEditedSuccessfully);
    await expect(organizationPage.organizationName).toHaveText(newOrgName);

    await test.step('SAAS-T260 Verify user admin is able to delete own Organization', async () => {
      await test.step(
        'Click on Delete organization icon and Verify confirmation window is displayed',
        async () => {
          await organizationPage.deleteOrgButton.click();
          await organizationPage.confirmDeleteOrgModal.body.waitFor({ state: 'visible' });

          await expect(organizationPage.confirmDeleteOrgModal.header).toHaveText(
            organizationPage.confirmDeleteOrgModal.headerLabel,
          );
          await expect(organizationPage.confirmDeleteOrgModal.message).toHaveText(
            organizationPage.confirmDeleteOrgModal.bodyMessage(newOrgName),
          );

          await expect(organizationPage.confirmDeleteOrgModal.confirm).toHaveText(
            organizationPage.confirmDeleteOrgModal.confirmMessage,
          );
        },
      );

      await test.step('Confirm deletion of the org', async () => {
        await organizationPage.confirmDeleteOrgModal.orgNameInput.type(newOrgName);
        await organizationPage.confirmDeleteOrgModal.submitButton.click();
        await organizationPage.toast.checkToastMessage(organizationPage.confirmDeleteOrgModal.successMessage);
        const deletedOrg = await portalAPI.getOrg(adminToken);

        expect(deletedOrg.orgs.length).toEqual(0);
      });

      await test.step('Verify the form for creation organization is displayed', async () => {
        await organizationPage.organizationNameInput.waitFor({ state: 'visible' });
      });
    });
  });

  test('SAAS-T221 Verify free account technical user is not able to update his organization name @freeUser @organizations', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T261 Verify the user with Technical account cannot delete organization',
    });
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);

    await oktaAPI.loginByOktaApi(newTechnicalUser, page);

    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });

    await test.step("SAAS-T255 Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.technical, {
        timeout: 30000,
      });
    });

    await dashboardPage.sideMenu.mainMenu.organization.click();
    await organizationPage.editOrgButton.waitFor({ state: 'visible' });
    await expect(organizationPage.editOrgButton).toBeDisabled();
    await test.step('Verify there is Delete button, but its disabled and cannot be clicked', async () => {
      await organizationPage.deleteOrgButton.waitFor({ state: 'visible' });
      await expect(organizationPage.deleteOrgButton).toBeDisabled();
    });
  });
});
