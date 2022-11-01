import { expect, test } from '@playwright/test';
import ProfilePage from '@pages/profile.page';
import { DashboardPage } from '@pages//dashboard.page';
import { SignInPage } from '@pages//signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';

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

  test('SAAS-T128 should be able to open profile page and see change profile link @profile', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.openUserDropdown();
    await dashboardPage.userDropdownProfile.click();
    expect(page.url()).toContain(dashboardPage.routes.profile);
    await expect(profilePage.locators.profileHeader).toHaveText(profilePage.labels.profileSettingsTitle);

    await expect(profilePage.locators.emailInput).toBeDisabled();
    await expect(profilePage.locators.emailInputLabel).toHaveText('Email');
    await expect(profilePage.locators.emailInput).toHaveValue(newAdmin1User.email);

    await expect(profilePage.locators.firstNameInput).toHaveValue(newAdmin1User.firstName);
    await expect(profilePage.locators.firstNameInputLabel).toHaveText('First name');

    await expect(profilePage.locators.lastNameInput).toHaveValue(newAdmin1User.lastName);
    await expect(profilePage.locators.lastNameInputLabel).toHaveText('Last name');

    await expect(profilePage.locators.saveProfileButton).toBeDisabled();
    await expect(profilePage.locators.editProfileButton).toHaveAttribute('href', profilePage.links.editUser);
    await expect(profilePage.locators.editProfileButton).toHaveAttribute('target', '_blank');
    await expect(profilePage.locators.editProfileButton).toHaveText('Edit profile');
  });

  test('SAAS-T130 should have validation for user profile fields @profile', async ({ page }) => {
    const longInput = 'this is 51 character string for negative inputs test!!!!!!!';
    const profilePage = new ProfilePage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();

    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);
    await expect(profilePage.locators.firstNameInput).toHaveValue(newAdmin1User.firstName);
    await expect(profilePage.locators.lastNameInput).toHaveValue(newAdmin1User.lastName);

    await profilePage.locators.firstNameInput.fill('');
    await profilePage.locators.lastNameInput.fill('');
    await profilePage.locators.firstNameInput.focus();
    await expect(profilePage.locators.firstNameValidationError).toHaveText(profilePage.requiredField);
    await expect(profilePage.locators.lastNameValidationError).toHaveText(profilePage.requiredField);

    await expect(profilePage.locators.saveProfileButton).toBeDisabled();

    await profilePage.locators.firstNameInput.fill(longInput);
    await expect(profilePage.locators.firstNameValidationError).toHaveText(profilePage.messages.toLongString);
    await profilePage.locators.lastNameInput.fill(longInput);
    await expect(profilePage.locators.lastNameValidationError).toHaveText(profilePage.messages.toLongString);

    await profilePage.locators.firstNameInput.fill(longInput.slice(0, 50));
    await expect(profilePage.locators.firstNameValidationError).toHaveText('');
    await profilePage.locators.lastNameInput.fill(longInput.slice(0, 50));
    await expect(profilePage.locators.lastNameValidationError).toHaveText('');

    await profilePage.locators.firstNameInput.fill(firstName);
    await expect(profilePage.locators.firstNameValidationError).toHaveText('');
    await profilePage.locators.lastNameInput.fill(lastName);
    await expect(profilePage.locators.lastNameValidationError).toHaveText('');

    await expect(profilePage.locators.saveProfileButton).toBeEnabled();
  });

  test('SAAS-T129 should be able to update user profile @profile', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const signInPage = new SignInPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();

    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);
    await profilePage.locators.firstNameInput.fill(firstName);
    await profilePage.locators.lastNameInput.fill(lastName);

    await expect(profilePage.locators.saveProfileButton).toBeEnabled();

    await profilePage.locators.saveProfileButton.click();
    await profilePage.toast.checkToastMessage(profilePage.messages.profileUpdated);

    await profilePage.uiUserLogout();

    await signInPage.emailInput.waitFor({ state: 'visible' });
    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();
    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);

    await expect(profilePage.locators.firstNameInput).toHaveValue(firstName);
    await expect(profilePage.locators.lastNameInput).toHaveValue(lastName);
  });
});
