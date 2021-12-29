import { getUser } from 'pages/auth/getUser';

const newUser = getUser();

context('Free user', () => {
  beforeEach(() => {
    cy.oktaCreateUser(newUser);
    cy.loginByOktaApi(newUser.email, newUser.password);
  });

  it('getting started', () => {
    cy.contains('Add Organization').isVisible().click();
    cy.findByTestId('create-organization-form')
      .isVisible()
      .findByTestId('organizationName-text-input')
      .hasAttr('placeholder', 'Your organization name')
      .type('test')
      .clear();
    cy.findByTestId('create-organization-submit-button').isDisabled();
    cy.findByTestId('organizationName-field-error-message').hasText('Required field');
  });
});
