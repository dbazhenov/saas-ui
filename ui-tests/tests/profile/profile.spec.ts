import { expect, test } from '@playwright/test';
import ProfilePage from '@pages/profile.page';
import { DashboardPage } from '@pages//dashboard.page';
import { SignInPage } from '@pages//signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';
import LandingPage from '@tests/pages/landing.page';

test.describe('Spec file for dashboard tests for customers', async () => {
  let newAdmin1User: User;
  const firstName = 'John';
  const lastName = 'Doe';

  test.beforeEach(async ({ page }) => {
    newAdmin1User = getUser();
    await oktaAPI.createUser(newAdmin1User, true);
    await page.goto('/');
  });

  test.afterEach(async () => {
    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
  });

  test.skip('SAAS-T128 should be able to open profile page and see change profile link @profile', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.userDropdown.openUserProfile();
    expect(page.url()).toContain(dashboardPage.routes.profile);
    await expect(profilePage.profileHeader).toHaveText(profilePage.profileSettingsTitle);

    await expect(profilePage.emailInput).toBeDisabled();
    await expect(profilePage.emailInputLabel).toHaveText('Email');
    await expect(profilePage.emailInput).toHaveValue(newAdmin1User.email);

    await expect(profilePage.firstNameInput).toHaveValue(newAdmin1User.firstName);
    await expect(profilePage.firstNameInputLabel).toHaveText('First name');

    await expect(profilePage.lastNameInput).toHaveValue(newAdmin1User.lastName);
    await expect(profilePage.lastNameInputLabel).toHaveText('Last name');

    await expect(profilePage.saveProfileButton).toBeDisabled();
    await expect(profilePage.editProfileButton).toHaveAttribute('href', profilePage.editUser);
    await expect(profilePage.editProfileButton).toHaveAttribute('target', '_blank');
    await expect(profilePage.editProfileButton).toHaveText('Edit profile');
  });

  test.skip('SAAS-T130 should have validation for user profile fields @profile', async ({ page }) => {
    const longInput = 'this is 51 character string for negative inputs test!!!!!!!';
    const profilePage = new ProfilePage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.userDropdown.openUserProfile();

    await profilePage.waitForEnabled(profilePage.firstNameInput);
    await expect(profilePage.firstNameInput).toHaveValue(newAdmin1User.firstName);
    await expect(profilePage.lastNameInput).toHaveValue(newAdmin1User.lastName);

    await profilePage.firstNameInput.fill('');
    await profilePage.lastNameInput.fill('');
    await profilePage.firstNameInput.focus();
    await expect(profilePage.firstNameValidationError).toHaveText(profilePage.requiredField('First name'));
    await expect(profilePage.lastNameValidationError).toHaveText(profilePage.requiredField('Last name'));
    await expect(profilePage.saveProfileButton).toBeDisabled();

    await profilePage.firstNameInput.fill(longInput);
    await expect(profilePage.firstNameValidationError).toHaveText(profilePage.toLongString('First name'));
    await profilePage.lastNameInput.fill(longInput);
    await expect(profilePage.lastNameValidationError).toHaveText(profilePage.toLongString('Last name'));

    await profilePage.firstNameInput.fill(longInput.slice(0, 50));
    await profilePage.firstNameValidationError.waitFor({ state: 'detached' });
    await profilePage.lastNameInput.fill(longInput.slice(0, 50));
    await profilePage.lastNameValidationError.waitFor({ state: 'detached' });

    await profilePage.firstNameInput.fill(firstName);
    await profilePage.firstNameValidationError.waitFor({ state: 'detached' });
    await profilePage.lastNameInput.fill(lastName);
    await profilePage.lastNameValidationError.waitFor({ state: 'detached' });
    expect(await profilePage.saveProfileButton.isEnabled()).toBeTruthy();
  });

  test.skip('SAAS-T129 should be able to update user profile @profile', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const landingPage = new LandingPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.userDropdown.openUserProfile();

    await profilePage.waitForEnabled(profilePage.firstNameInput);
    await profilePage.firstNameInput.fill(firstName);
    await profilePage.lastNameInput.fill(lastName);

    await expect(profilePage.saveProfileButton).toBeEnabled();

    await profilePage.saveProfileButton.click();
    await profilePage.toast.checkToastMessage(profilePage.profileUpdated);

    await profilePage.userDropdown.logoutUser();

    await landingPage.landingPageContainer.waitFor({ state: 'visible' });
    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.userDropdown.openUserProfile();
    await profilePage.waitForEnabled(profilePage.firstNameInput);

    await expect(profilePage.firstNameInput).toHaveValue(firstName);
    await expect(profilePage.lastNameInput).toHaveValue(lastName);
  });
});
