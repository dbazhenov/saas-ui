import {User} from 'pages/common/interfaces/Auth';
import signUpPage from '../signUp.page';

export const fillOutSignUpForm = (user: User) => {
  if (user.email) cy.get(signUpPage.locators.inputEmail)
    .children().focus().click()
    .type(user.email);

  if (user.password) cy.get(signUpPage.locators.inputPassword)
    .children(signUpPage.locators.inputPasswordChildren).focus().click()
    .type(user.password);

  if (user.firstName) cy.get(signUpPage.locators.inputFirstName)
    .children().focus().click()
    .type(user.firstName);

  if (user.lastName) cy.get(signUpPage.locators.inputLastName)
    .children().focus().click()
    .type(user.lastName);
};

export const getMailosaurEmailAddress = (user: User): string => `${user.firstName + user.lastName}@${Cypress.env('mailosaur_ui_tests_server_id')}.mailosaur.net`;

export interface SignUpFormErrors {
  email?: boolean,
  password?: boolean,
  firstName?: boolean,
  lastName?: boolean,
}

export const verifyValidationSignUp = (errorFields: SignUpFormErrors = {
  email: false,
  password: false,
  firstName: false,
  lastName: false,
}) => {
  cy.get(signUpPage.locators.formErrorContainer).then((element) => {
    cy.get(signUpPage.locators.registrationAlert, {withinSubject: element})
      .hasText(signUpPage.constants.messages.validationErrorAlert);
  });
  if (errorFields.email) {
    cy.get(signUpPage.locators.inputEmail)
      .next()
      .hasText(signUpPage.constants.messages.blankFieldError);
  }

  if (errorFields.password) {
    cy.get(signUpPage.locators.inputPassword)
      .next()
      .hasText(signUpPage.constants.messages.blankFieldError);
  }

  if (errorFields.firstName) {
    cy.get(signUpPage.locators.inputFirstName)
      .next()
      .hasText(signUpPage.constants.messages.blankFieldError);
  }

  if (errorFields.lastName) {
    cy.get(signUpPage.locators.inputLastName)
      .next()
      .hasText(signUpPage.constants.messages.blankFieldError);
  }
};
