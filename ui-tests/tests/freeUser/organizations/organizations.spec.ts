import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@helpers/portalHelper';
import { MembersPage } from '@tests/pages/members.page';
import LandingPage from '@tests/pages/landing.page';
import { SignInPage } from '@tests/pages/signIn.page';

test.describe('Spec file for free users dashboard tests', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let adminToken: string;
  let org: any;
  let firstUserWithoutOrg: User;
  let secondUserWithoutOrg: User;
  const firstOrgName = `new test#$%_org_${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    admin1User = await oktaAPI.createTestUser();
    admin2User = await oktaAPI.createTestUser();
    technicalUser = await oktaAPI.createTestUser();
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    org = (await portalAPI.createOrg(adminToken)).org;

    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: technicalUser.email,
      role: UserRoles.technical,
    });
    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: admin2User.email,
      role: UserRoles.admin,
    });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await portalAPI.deleteUserOrgIfExists(admin1User);
    await portalAPI.deleteUserOrgIfExists(admin1User);
    await oktaAPI.deleteUsers([admin1User, admin2User, technicalUser]);

    if (firstUserWithoutOrg) {
      await portalAPI.deleteUserOrgIfExists(firstUserWithoutOrg);
      await oktaAPI.deleteUserByEmail(firstUserWithoutOrg.email);
      firstUserWithoutOrg = undefined;
    }

    if (secondUserWithoutOrg) {
      await portalAPI.deleteUserOrgIfExists(secondUserWithoutOrg);
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
      {
        type: 'Also Covers',
        description: 'SAAS-T278 Verify user without Organization cannot see Activity log',
      },
    );

    const dashboardPage = new DashboardPage(page);
    const membersPage = new MembersPage(page);
    const organizationPage = new OrganizationPage(page);
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    firstUserWithoutOrg = getUser();
    await oktaAPI.createUser(firstUserWithoutOrg);

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(firstUserWithoutOrg.email, firstUserWithoutOrg.password);
    });

    await test.step(
      '2. Navigate to the organization page and verify elements  on create org page.',
      async () => {
        await dashboardPage.sideMenu.mainMenu.organization.click();

        // wait due to rerender of the page.
        await page.waitForTimeout(2000);
        await expect(organizationPage.fields.orgName).toHaveAttribute(
          'placeholder',
          organizationPage.labels.orgNamePlaceholder,
        );
        await organizationPage.fields.orgName.type('Test', { delay: 100 });
        await organizationPage.fields.orgName.fill('');
        await expect(organizationPage.buttons.createOrg).toBeDisabled();
      },
    );
    await test.step('3. Verify that user cannot see activity log menu.', async () => {
      await expect(organizationPage.organizationTabs.elements.activityLog).not.toBeVisible();
    });

    await test.step('5. Create new org.', async () => {
      await organizationPage.fields.orgName.type(firstOrgName);
      await organizationPage.buttons.createOrg.click();
      await organizationPage.toast.checkToastMessage(organizationPage.messages.orgCreatedSuccessfully);
      await expect(organizationPage.elements.orgName).toHaveText(firstOrgName, { timeout: 60000 });
    });

    await test.step('6. Verify user is automatically assigned as org admin.', async () => {
      await organizationPage.organizationTabs.elements.members.click();
      await membersPage.membersTable.verifyMembersTableUserRole(firstUserWithoutOrg.email, UserRoles.admin);
    });

    await test.step('7. Verify org creation on getting started component on the dasboard.', async () => {
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
    });

    await test.step(
      '8. Logout and login as the new user and navigate to the organization page.',
      async () => {
        await organizationPage.userDropdown.logoutUser();

        await landingPage.landingPageContainer.waitFor({ state: 'visible' });
        secondUserWithoutOrg = getUser();
        await oktaAPI.createUser(secondUserWithoutOrg);
        await signInPage.uiLogin(secondUserWithoutOrg.email, secondUserWithoutOrg.password);
        await dashboardPage.sideMenu.mainMenu.organization.click();
      },
    );

    await test.step('9 . Verify that user can create org with the same name.', async () => {
      await page.waitForTimeout(2000);
      await organizationPage.fields.orgName.type(firstOrgName);
      await organizationPage.buttons.createOrg.click();
      await organizationPage.toast.checkToastMessage(organizationPage.messages.orgCreatedSuccessfully);
      await expect(organizationPage.elements.orgName).toHaveText(firstOrgName);
    });
  });

  test('SAAS-T220 Verify free account admin user can update org name @freeUser @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: "SAAS-T255 Verify user's role is displayed on Portal",
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T260 Verify user admin is able to delete own Organization',
      },
    );
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);
    const signInPage = new SignInPage(page);
    const newOrgName = `new_test_org_${Date.now()}`;

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
    });

    await test.step("2. Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });

    await test.step('3. Navigate to the organization page and verify user can change org name.', async () => {
      await dashboardPage.sideMenu.mainMenu.organization.click();
      await organizationPage.buttons.editOrg.click();
    });

    await test.step('4. Verify user can change name of his org.', async () => {
      await organizationPage.buttons.submitEditOrg.isDisabled();
      await organizationPage.fields.orgName.fill('');
      await expect(organizationPage.elements.orgNameFieldError).toHaveText(
        organizationPage.requiredField('Organization Name'),
      );
      await organizationPage.fields.orgName.fill(newOrgName);
      await organizationPage.buttons.submitEditOrg.click();
      await organizationPage.toast.checkToastMessage(organizationPage.messages.orgEditedSuccessfully);
      await expect(organizationPage.elements.orgName).toHaveText(newOrgName);
    });

    await test.step(
      '5. Click on Delete organization icon and Verify confirmation window is displayed',
      async () => {
        await organizationPage.buttons.deleteOrg.click();
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

    await test.step('6. Confirm deletion of the org', async () => {
      await organizationPage.confirmDeleteOrgModal.orgNameInput.type(newOrgName);
      await organizationPage.confirmDeleteOrgModal.submitButton.click();
      await organizationPage.toast.checkToastMessage(organizationPage.confirmDeleteOrgModal.successMessage);
      const deletedOrg = await portalAPI.getOrg(adminToken);

      expect(deletedOrg.orgs.length).toEqual(0);
    });

    await test.step('7. Verify the form for creation organization is displayed', async () => {
      await organizationPage.fields.orgName.waitFor({ state: 'visible' });
    });
  });

  test('SAAS-T221 Verify free account technical user is not able to update his organization name @freeUser @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T261 Verify the user with Technical account cannot delete organization',
      },
      {
        type: 'Also Covers',
        description: "SAAS-T255 Verify user's role is displayed on Portal",
      },
    );
    const dashboardPage = new DashboardPage(page);
    const organizationPage = new OrganizationPage(page);
    const signInPage = new SignInPage(page);

    await test.step("1. Login to the porVerify user's role is displayed on Portal", async () => {
      signInPage.uiLogin(technicalUser.email, technicalUser.password);
    });

    await test.step("2. Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.technical, {
        timeout: 30000,
      });
    });

    await test.step('3. Verify there is Edit button, but its disabled and cannot be clicked ', async () => {
      await dashboardPage.sideMenu.mainMenu.organization.click();
      await organizationPage.buttons.editOrg.waitFor({ state: 'visible' });
      await expect(organizationPage.buttons.editOrg).toBeDisabled();
    });

    await test.step('4. Verify there is Delete button, but its disabled and cannot be clicked', async () => {
      await organizationPage.buttons.deleteOrg.waitFor({ state: 'visible' });
      await expect(organizationPage.buttons.deleteOrg).toBeDisabled();
    });
  });
});
