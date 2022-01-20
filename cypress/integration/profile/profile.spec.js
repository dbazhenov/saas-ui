import { MESSAGES as commonMessages, pageDetailsMap, Pages } from 'pages/common/constants';
import { getUser } from 'pages/auth/getUser';
import { dropdownMenu, logoutButton, profileButton, profileIcon } from 'pages/main/selectors';
import { profilePage } from 'pages/profile.page';
import { changeEmailLink, profileForm, updateProfileButton } from 'pages/profile/selectors';
import {
  emailField,
  emailFieldLabel,
  firstNameField,
  firstNameFieldLabel,
  firstNameValidation,
  lastNameField,
  lastNameFieldLabel,
  lastNameValidation,
} from 'pages/auth/selectors';

const firstName = 'John';
const lastName = 'Doe';
const longInput = 'this is 51 character string for negative inputs test!!!!!!!';

context('User Profile', () => {
  beforeEach(() => {
    cy.wrap(getUser())
      .as('user')
      .then((newUser) => {
        cy.oktaCreateUser(newUser);
        cy.loginByOktaApi(newUser.email, newUser.password);
      });
  });

  afterEach(() => {
    cy.get('@user').then((newUser) => {
      cy.oktaDeleteUserByEmail(newUser.email);
    });
  });

  it('SAAS-T128 should be able to open profile page and see change profile link', () => {
    // Open dropdown menu
    profileIcon().isVisible().click({ force: true });
    dropdownMenu().isVisible();

    // Select Profile option from dropdown
    profileButton().hasText('Profile').click();
    cy.url().should('be.eq', `${Cypress.config().baseUrl}${pageDetailsMap[Pages.Profile].url}`);

    // Verify Profile Settings form elements
    profileForm().find('legend').hasText(profilePage.constants.labels.profileSettingsTitle);
    emailField().isDisabled();
    emailFieldLabel().hasText(profilePage.constants.labels.emailLabel);
    cy.get('@user').then((newUser) => {
      emailField().hasAttr('value', newUser.email);
    });
    verifyFields();
    firstNameFieldLabel().hasText(profilePage.constants.labels.firstNameLabel);
    lastNameFieldLabel().hasText(profilePage.constants.labels.lastNameLabel);
    updateProfileButton().isDisabled();
    changeEmailLink()
      .hasAttr('href', profilePage.constants.links.oktaProfileSettings)
      .hasAttr('target', '_blank')
      .hasText(profilePage.constants.labels.editProfileLink);
  });

  it('SAAS-T130 should have validation for user profile fields', () => {
    cy.visit(pageDetailsMap[Pages.Profile].url);
    verifyFields();

    // Clear first name and last name fields
    firstNameField().clear();
    lastNameField().clear();
    firstNameField().focus();

    // Verify first name and last name fields can't be empty
    firstNameValidation().hasText(commonMessages.REQUIRED_FIELD);
    updateProfileButton().isDisabled();
    lastNameValidation().hasText(commonMessages.REQUIRED_FIELD);
    updateProfileButton().isDisabled();

    // Verify validation error for string length
    firstNameField().clear().type(longInput);
    firstNameValidation().hasText(profilePage.constants.messages.toLongString);
    lastNameField().clear().type(longInput);
    lastNameValidation().hasText(profilePage.constants.messages.toLongString);
    updateProfileButton().isDisabled();

    // Verify there is no validation error for a string with 50 characters
    // eslint-disable-next-line no-magic-numbers
    firstNameField().clear().type(longInput.slice(0, 50));
    firstNameValidation().hasText('');
    // eslint-disable-next-line no-magic-numbers
    lastNameField().clear().type(longInput.slice(0, 50));
    lastNameValidation().hasText('');
    updateProfileButton().isEnabled();

    // Fill in valid first and last names
    firstNameField().clear().type(firstName);
    firstNameValidation().hasText('');
    lastNameField().clear().type(lastName);
    lastNameValidation().hasText('');

    // Verify Save button is active and there are no validation errors
    updateProfileButton().isEnabled();
  });

  it('SAAS-T129 should be able to update user profile', () => {
    cy.visit(pageDetailsMap[Pages.Profile].url);
    verifyFields();

    // Fill in valid first name and last name
    firstNameField().clear().type(firstName);
    lastNameField().clear().type(lastName);

    // Save changes
    updateProfileButton().isEnabled().click();
    cy.checkPopUpMessage(profilePage.constants.messages.profileUpdated);

    // Reload page and verify that first name and last name are updated
    cy.reload();
    firstNameField().hasAttr('value', firstName);
    lastNameField().hasAttr('value', lastName);

    // Logout and login again
    // Open dropdown menu
    profileIcon().isVisible().click({ force: true });
    dropdownMenu().isVisible();

    // Select Profile option from dropdown
    logoutButton().hasText('Logout').click();
    cy.get('@user').then((newUser) => {
      cy.loginByOktaApi(newUser.email, newUser.password);
      cy.visit(pageDetailsMap[Pages.Profile].url);
    });

    // Verify that first name and last name are updated
    firstNameField().hasAttr('value', firstName);
    lastNameField().hasAttr('value', lastName);
  });
});

const verifyFields = () => {
  cy.get('@user').then((newUser) => {
    firstNameField().hasAttr('value', newUser.firstName);
    lastNameField().hasAttr('value', newUser.lastName);
  });
};
