import { expect, test } from '@playwright/test';
import { SignUpPage } from '@pages/signUp.page';
import User from '@support/types/user.interface';
import { SignInPage } from '@pages/signIn.page';
import { getRandomMailosaurEmailAddress, getVerificationLink } from '@api/helpers/mailosaurApiHelper';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';
import LandingPage from '@tests/pages/landing.page';
import Duration from '@tests/helpers/Duration';

test.describe('Spec file for Sign Up tests', async () => {
  let adminUser: User;
  let casualUser: User;
  let successUser: User;
  let firstUserWithoutMarketingConsent: User;
  let secondUserWithoutMarketingConsent: User;

  test.beforeEach(async ({ page }) => {
    casualUser = getUser();
    adminUser = getUser();
    successUser = getUser(getRandomMailosaurEmailAddress());
    firstUserWithoutMarketingConsent = getUser();
    secondUserWithoutMarketingConsent = getUser();
    await oktaAPI.createUser(casualUser, true);
    await page.goto('/');
  });

  test.afterEach(async () => {
    await oktaAPI.deleteUserByEmail(casualUser.email);

    if (await oktaAPI.getUser(adminUser.email)) {
      await oktaAPI.deleteUserByEmail(adminUser.email);
    }

    if (await oktaAPI.getUser(successUser.email)) {
      await oktaAPI.deleteUserByEmail(successUser.email);
    }

    if (await oktaAPI.getUser(firstUserWithoutMarketingConsent.email)) {
      await oktaAPI.deleteUserByEmail(firstUserWithoutMarketingConsent.email);
    }

    if (await oktaAPI.getUser(secondUserWithoutMarketingConsent.email)) {
      await oktaAPI.deleteUserByEmail(secondUserWithoutMarketingConsent.email);
    }
  });

  test('SAAS-T115 - Verify validation for email on Sign Up @signUp @auth', async ({ page, baseURL }) => {
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);
    const invalidUser = { ...adminUser };

    invalidUser.email = 'Test3#gmail.c0m';
    // Verify URL
    await landingPage.buttons.login.click();
    await expect(page).toHaveURL(`${baseURL + signUpPage.routes.login}`);
    await signUpPage.createOneLink.click();
    await signUpPage.inputEmail.type(invalidUser.email);
    // trigger Email field validation s
    await signUpPage.inputPassword.click();
    await expect(signUpPage.emailFieldValidator).toHaveText(signUpPage.invalidEmail);
    // Empty Email input & fill it properly.
    await signUpPage.inputEmail.fill('');
    await signUpPage.fillOutSignUpUserDetails(adminUser);
    await expect(signUpPage.emailFieldValidator).not.toContain(signUpPage.invalidEmail);
    await expect(signUpPage.registerButton).toBeEnabled();
  });

  test('SAAS-T85 - Verify Sign Up if user already has Percona account @signUp @auth', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);

    await landingPage.buttons.createAccount.click();
    await signUpPage.fillOutSignUpUserDetails(casualUser);
    await signUpPage.registerButton.click();

    await expect(signUpPage.registrationAlertMessage).toHaveText(signUpPage.emailAlreadyRegistered, {
      timeout: 15000,
    });
  });

  test('SAAS-T121 - Verify Sign Up to Platform is not possible without Last Name and First Name @signUp @auth', async ({
    page,
  }) => {
    // prepare test data
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);

    casualUser.firstName = '';
    casualUser.lastName = '';

    // fill signUp form with required object - empty firstName & lastName.
    await landingPage.buttons.createAccount.click();
    await signUpPage.inputEmail.fill(casualUser.email);
    await signUpPage.inputPassword.fill(casualUser.password);
    await signUpPage.tosCheckbox.check({ force: true });
    await signUpPage.registerButton.click();
    // Verify error message toast message.
    await expect(signUpPage.registrationAlertMessage).toHaveText(signUpPage.validationErrorAlert, {
      timeout: 15000,
    });
    // Verify number of errors from input fields and verify the error message.
    const inputErrorMessagesTexts = await signUpPage.fieldFormValidator.evaluateAll(
      (inputErrorMessagesText) => inputErrorMessagesText.map((element) => element.textContent),
    );

    expect(inputErrorMessagesTexts).toHaveLength(2);
    inputErrorMessagesTexts.forEach((message) => {
      expect(message).toEqual(signUpPage.blankFieldError);
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
        description: 'SAAS-T274 - Verify the message appears after registration of the user',
      },
    );

    const signUpPage = new SignUpPage(page);
    const signInPage = new SignInPage(page);
    const landingPage = new LandingPage(page);

    await test.step('1. Select create new account and fill out credentials', async () => {
      await landingPage.buttons.createAccount.click();
      await signUpPage.fillOutSignUpUserDetails(successUser);
    });

    await test.step('2. Verify terms of service displayed on sign in widget.', async () => {
      await expect(signUpPage.elements.marketingLabel).toHaveText(signInPage.messages.tosAgree);
      await expect(signUpPage.elements.tosLabel).toHaveText(signUpPage.messages.tosAgree);
      await signUpPage.tosCheckbox.waitFor({ state: 'visible' });
    });

    await test.step('3. Click register and verify message about email being sent', async () => {
      await signUpPage.registerButton.click();
      await expect(signUpPage.verificationEmailSentTitleLoc).toHaveText(
        signUpPage.verificationEmailSentTitle,
      );
      await expect(signUpPage.registrationCompleteDesc).toHaveText(
        signUpPage.verificationEmailSentDesc(successUser.email),
      );
    });

    let activationLink;

    await test.step('4. Verify Activation email was sent.', async () => {
      activationLink = await getVerificationLink(successUser);
    });

    await test.step('5. Activate user with the link in the email.', async () => {
      await page.goto(activationLink);
      expect(page.url()).toContain('https://portal-dev.percona.com/');
      await page.goto('/');
    });

    await test.step('6. Verify user able to sign in via verified account.', async () => {
      await landingPage.buttons.login.click();
      await signInPage.fillOutSignInUserDetails(successUser.email, successUser.password);
      await signInPage.buttons.signIn.click();
      await signInPage.waitForPortalLoaded();
      expect(page.url()).toContain(baseURL);
      await signInPage.waitForPortalLoaded();
    });

    await test.step('7. Verify user has marketing and tos set to true.', async () => {
      const userDetails = await oktaAPI.getUser(successUser.email);

      expect(userDetails.profile.marketing).toBeTruthy();
      expect(userDetails.profile.tos).toBeTruthy();
    });
  });

  test.skip('SAAS-T268 - Verify all user can agree with receiving emails from Percona @signUp @auth', async ({
    page,
  }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T269 - Verify all users can disagree with receiving emails from Percona',
    });
    const signUpPage = new SignUpPage(page);

    await test.step(
      'Login to Portal with the new user (with any roles) and Verify thew next window appears "Welcome to Percona Portal"',
      async () => {
        await oktaAPI.createUserWithoutMarketingConsent(firstUserWithoutMarketingConsent);
        await oktaAPI.loginByOktaApi(firstUserWithoutMarketingConsent, page);
        await signUpPage.marketingBanner.elements.banner.waitFor({ state: 'visible' });
        await expect(signUpPage.marketingBanner.elements.title).toHaveText(
          signUpPage.marketingBanner.messages.title,
        );
        await expect(signUpPage.marketingBanner.elements.description).toHaveText(
          signUpPage.marketingBanner.messages.description,
        );
      },
    );

    await test.step('Click on "No, thank you" button and Verify the window is closed', async () => {
      await signUpPage.marketingBanner.buttons.reject.click();
      await signUpPage.marketingBanner.elements.banner.waitFor({
        state: 'detached',
        timeout: Duration.ThreeMinutes,
      });
    });

    await test.step(
      'Open id.percona.com profile and verify Marketing consent field has "false" value',
      async () => {
        const userDetails = await oktaAPI.getUser(firstUserWithoutMarketingConsent.email);
        const userSpecification = await oktaAPI.getUserDetails(userDetails.id);

        expect(userSpecification.data.profile.marketing).toBeFalsy();
        await signUpPage.userDropdown.logoutUser();
      },
    );

    await test.step(
      'Login to Portal with the new user (with any roles) and Verify thew next window appears "Welcome to Percona Portal"',
      async () => {
        await oktaAPI.createUserWithoutMarketingConsent(secondUserWithoutMarketingConsent);
        await oktaAPI.loginByOktaApi(secondUserWithoutMarketingConsent, page);
        await signUpPage.marketingBanner.elements.banner.waitFor({ state: 'visible' });
        await expect(signUpPage.marketingBanner.elements.title).toHaveText(
          signUpPage.marketingBanner.messages.title,
        );
        await expect(signUpPage.marketingBanner.elements.description).toHaveText(
          signUpPage.marketingBanner.messages.description,
        );
      },
    );

    await test.step(
      'Click on "Yes, please keep me posted" button and Verify the window is closed',
      async () => {
        await signUpPage.marketingBanner.buttons.accept.click();
        await signUpPage.marketingBanner.elements.banner.waitFor({ state: 'detached' });
      },
    );

    await test.step('Open id.percona.com and verify that Marketing field has "Yes" value', async () => {
      const userDetails = await oktaAPI.getUser(secondUserWithoutMarketingConsent.email);
      const userSpecification = await oktaAPI.getUserDetails(userDetails.id);

      expect(userSpecification.data.profile.marketing).toBeTruthy();
    });
  });

  test("SAAS-T257 - Verify it's possible to create account with unchecked/Default consent(without checkbox) with info sending from Percona @signUp @auth", async ({
    page,
  }) => {
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);

    await test.step('Open Portal and click on "Create one" link', async () => {
      await landingPage.buttons.createAccount.click();
    });

    await test.step(
      'Fill in all fields, select  required "consent with TOS" checkbox and Removed "consent to send emails from Percona" checkbox',
      async () => {
        await signUpPage.fillOutSignUpUserDetails(adminUser, { tos: true });
      },
    );

    await test.step('Click on "Create" button and Verify the account successfully created', async () => {
      await signUpPage.registerButton.click();
      await expect(signUpPage.verificationEmailSentTitleLoc).toHaveText(
        signUpPage.verificationEmailSentTitle,
      );
      const userDetails = await oktaAPI.getUser(adminUser.email);

      expect(userDetails.profile.marketing).toBeTruthy();
      expect(userDetails.profile.tos).toBeTruthy();
    });
  });

  test("SAAS-T120 - Verify Sign in not possible if user doesn't confirm Portal registration @signUp @auth", async ({
    page,
    baseURL,
  }) => {
    const signInPage = new SignInPage(page);
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);

    await test.step('1. Navigate to Percona Platform and click on Sign Up', async () => {
      await landingPage.buttons.createAccount.click();
    });

    await test.step('2. Fill in required fields for Sign Up and click on the Register button', async () => {
      await signUpPage.fillOutSignUpUserDetails(adminUser);
      await signUpPage.registerButton.click();
      await expect(signUpPage.verificationEmailSentTitleLoc).toHaveText(
        signUpPage.verificationEmailSentTitle,
      );
    });

    await test.step(
      '3. Do not complete the registration by following a link from Okta and try to login',
      async () => {
        await page.reload();

        await signUpPage.backToSingIn.click();
        await signInPage.fields.email.waitFor({ state: 'visible' });
        await signInPage.fillOutSignInUserDetails(adminUser.email, adminUser.password);
        await signInPage.buttons.signIn.click();
        await expect(signInPage.elements.signInErrorContainer).toHaveText(signInPage.labels.unableToSignIn);
        await expect(page).toHaveURL(`${baseURL}/login`);
      },
    );
  });
});
