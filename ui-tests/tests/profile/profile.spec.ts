import { expect, test } from '@playwright/test';
import ProfilePage from '@pages/profile.page';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages//dashboard.page';
import { SignInPage } from '@pages//signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';

test.describe('Spec file for dashboard tests for customers', async () => {
  let newAdmin1User: User;
  const firstName = 'John';
  const lastName = 'Doe';

  test.beforeEach(async ({ page }) => {
    newAdmin1User = await getUser();
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
    expect(page.url()).toContain('/profile');
    expect(await profilePage.locators.profileHeader.textContent()).toEqual(
      profilePage.labels.profileSettingsTitle,
    );
    expect(await profilePage.locators.emailInput.isDisabled()).toBeTruthy();
    expect(await profilePage.locators.emailInputLabel.textContent()).toEqual('Email');
    expect(await profilePage.locators.emailInput.getAttribute('value')).toEqual(newAdmin1User.email);
    expect(await profilePage.locators.firstNameInput.getAttribute('value')).toEqual(newAdmin1User.firstName);
    expect(await profilePage.locators.firstNameInputLabel.textContent()).toEqual('First name');
    expect(await profilePage.locators.lastNameInput.getAttribute('value')).toEqual(newAdmin1User.lastName);
    expect(await profilePage.locators.firstNameInputLabel.textContent()).toEqual('First name');
    expect(await profilePage.locators.saveProfileButton.isDisabled()).toBeTruthy();
    expect(await profilePage.locators.editProfileButton.getAttribute('href')).toEqual(
      profilePage.links.editUser,
    );
    expect(await profilePage.locators.editProfileButton.getAttribute('target')).toEqual('_blank');
    expect(await profilePage.locators.editProfileButton.textContent()).toEqual('Edit profile');
  });

  test('SAAS-T130 should have validation for user profile fields @profile', async ({ page }) => {
    const longInput = 'this is 51 character string for negative inputs test!!!!!!!';
    const profilePage = new ProfilePage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();

    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);
    expect(await profilePage.locators.firstNameInput.getAttribute('value')).toEqual(newAdmin1User.firstName);
    expect(await profilePage.locators.lastNameInput.getAttribute('value')).toEqual(newAdmin1User.lastName);

    await profilePage.locators.firstNameInput.fill('');
    await profilePage.locators.lastNameInput.fill('');
    await profilePage.locators.firstNameInput.focus();
    expect(await profilePage.locators.firstNameValidationError.textContent()).toEqual(
      profilePage.requiredField,
    );
    expect(await profilePage.locators.lastNameValidationError.textContent()).toEqual(
      profilePage.requiredField,
    );
    expect(await profilePage.locators.saveProfileButton.isDisabled()).toBeTruthy();

    await profilePage.locators.firstNameInput.fill(longInput);
    expect(await profilePage.locators.firstNameValidationError.textContent()).toEqual(
      profilePage.messages.toLongString,
    );
    await profilePage.locators.lastNameInput.fill(longInput);
    expect(await profilePage.locators.lastNameValidationError.textContent()).toEqual(
      profilePage.messages.toLongString,
    );

    await profilePage.locators.firstNameInput.fill(longInput.slice(0, 50));
    expect(await profilePage.locators.firstNameValidationError.textContent()).toEqual('');
    await profilePage.locators.lastNameInput.fill(longInput.slice(0, 50));
    expect(await profilePage.locators.lastNameValidationError.textContent()).toEqual('');

    await profilePage.locators.firstNameInput.fill(firstName);
    expect(await profilePage.locators.firstNameValidationError.textContent()).toEqual('');
    await profilePage.locators.lastNameInput.fill(lastName);
    expect(await profilePage.locators.lastNameValidationError.textContent()).toEqual('');
    expect(await profilePage.locators.saveProfileButton.isEnabled()).toBeTruthy();
  });

  test('SAAS-T129 should be able to update user profile @profile', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const signInPage = new SignInPage(page);

    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();

    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);
    await profilePage.locators.firstNameInput.fill(firstName);
    await profilePage.locators.lastNameInput.fill(lastName);
    expect(await profilePage.locators.saveProfileButton.isEnabled()).toBeTruthy();
    await profilePage.locators.saveProfileButton.click();
    await profilePage.toast.checkToastMessage(profilePage.messages.profileUpdated);
    expect(await profilePage.locators.firstNameInput.getAttribute('value')).toEqual(firstName);
    expect(await profilePage.locators.lastNameInput.getAttribute('value')).toEqual(lastName);
    await profilePage.uiUserLogout();

    await signInPage.emailInput.waitFor({ state: 'visible' });
    await oktaAPI.loginByOktaApi(newAdmin1User, page);
    await profilePage.openUserProfile();
    await profilePage.waitForEnabled(profilePage.locators.firstNameInput);
    expect(await profilePage.locators.firstNameInput.getAttribute('value')).toEqual(firstName);
    expect(await profilePage.locators.lastNameInput.getAttribute('value')).toEqual(lastName);
  });
});
