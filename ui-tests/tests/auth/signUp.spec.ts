import { expect, test } from '@playwright/test';
import { getUser } from '@cypress/pages/auth/getUser';
import { SignUpPage } from '@pages/signUp.page';
import User from '@support/types/user.interface';
import { SignInPage } from '@pages/signIn.page';
import { getMailosaurEmailAddress, getVerificationLink } from '@api/helpers/mailosaurApiHelper';
import { oktaAPI } from '@api/okta';

test.describe('Spec file for Sign Up tests', async () => {
  let adminUser: User;
  let casualUser: User;
  let successUser: User;

  test.beforeAll(async () => {
    casualUser = await getUser();
    adminUser = await getUser();
    successUser = await getUser();
    await oktaAPI.createUser(casualUser, true);
  });

  test.afterAll(async () => {
    await oktaAPI.deleteUserByEmail(casualUser.email);
    await oktaAPI.deleteUserByEmail(successUser.email);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SAAS-T115 - Verify validation for email on Sign Up @signUp @auth', async ({ page, baseURL }) => {
    const signUpPage = new SignUpPage(page);
    const invalidUser = { ...adminUser };

    invalidUser.email = 'Test3#gmail.c0m';
    // Verify URL
    await expect(page).toHaveURL(`${baseURL + signUpPage.links.loginAddressLink}`);
    await signUpPage.locators.createOneLink.click();
    await signUpPage.locators.inputEmail.type(invalidUser.email);
    // trigger Email field validation s
    await signUpPage.locators.inputPassword.click();
    await expect(signUpPage.locators.emailFieldValidator).toHaveText(signUpPage.messages.invalidEmail);
    // Empty Email input & fill it properly.
    await signUpPage.locators.inputEmail.fill('');
    await signUpPage.fillOutSignUpUserDetails(adminUser);
    await expect(signUpPage.locators.emailFieldValidator).not.toContain(signUpPage.messages.invalidEmail);
    await expect(signUpPage.locators.registerButton).toBeEnabled();
  });

  test('SAAS-T85 - Verify Sign Up if user already has Percona account @signUp @auth', async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.locators.createOneLink.click();
    await signUpPage.fillOutSignUpUserDetails(casualUser);
    await signUpPage.locators.registerButton.click();

    await expect(signUpPage.locators.registrationAlertMessage).toHaveText(
      signUpPage.messages.emailAlreadyRegistered,
      { timeout: 15000 },
    );
  });

  test('SAAS-T121 - Verify Sign Up to Platform is not possible without Last Name and First Name @signUp @auth', async ({
    page,
  }) => {
    // prepare test data
    const signUpPage = new SignUpPage(page);

    casualUser.firstName = '';
    casualUser.lastName = '';

    // fill signUp form with required object - empty firstName & lastName.
    await signUpPage.locators.createOneLink.click();
    await signUpPage.locators.inputEmail.fill(casualUser.email);
    await signUpPage.locators.inputFirstName.fill('');
    await signUpPage.locators.inputPassword.fill(casualUser.password);
    await signUpPage.locators.inputLastName.fill('');
    await signUpPage.locators.marketingCheckbox.check();
    await signUpPage.locators.tosCheckbox.check();
    await signUpPage.locators.registerButton.click();
    // Verify error message toast message.
    await expect(signUpPage.locators.registrationAlertMessage).toHaveText(
      signUpPage.messages.validationErrorAlert,
      { timeout: 15000 },
    );
    // Verify number of errors from input fields and verify the error message.
    const inputErrorMessagesTexts = await signUpPage.locators.fieldFormValidator.evaluateAll(
      (inputErrorMessagesText) => inputErrorMessagesText.map((element) => element.textContent),
    );

    expect(inputErrorMessagesTexts).toHaveLength(2);
    inputErrorMessagesTexts.forEach((message) => {
      expect(message).toEqual(signUpPage.messages.blankFieldError);
    });
  });

  test('SAAS-T78 - Verify Sign Up on Percona Portal @signUp @auth', async ({ page, baseURL }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T124 - Verify user can see notification about Account confirmation email sent.',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T122 - Verify confirmation email is sent during Portal registration.',
      },
    );

    // Prepare data
    const signUpPage = new SignUpPage(page);
    const signInPage = new SignInPage(page);

    successUser.email = getMailosaurEmailAddress(successUser);
    // Fulfill the sign up form and register
    await signUpPage.locators.createOneLink.click();
    await signUpPage.fillOutSignUpUserDetails(successUser);
    await signUpPage.locators.registerButton.click();
    await expect(signUpPage.locators.verificationEmailSentTitleLoc).toHaveText(
      signUpPage.messages.verificationEmailSentTitle,
    );
    await expect(signUpPage.locators.registrationCompleteDesc).toHaveText(
      signUpPage.messages.verificationEmailSentDesc,
    );
    // Verify that mailosaur have that email in the box.
    const activationLink = await getVerificationLink(successUser);

    // // visit an emailed link
    await page.goto(activationLink);
    expect(page.url()).toContain('https://portal-dev.percona.com/login');
    await page.goto('/');
    // Verify user able to sign in via verified account from previous sign up stages
    await signInPage.fillOutSignInUserDetails(successUser.email, successUser.password);
    await signInPage.signInButton.click();
    await signInPage.waitForPortalLoaded();
    expect(page.url()).toContain(baseURL);
    await signInPage.waitForPortalLoaded();
  });
});
