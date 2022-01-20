import { User } from 'pages/common/interfaces/Auth';

declare namespace Cypress {
  interface Chainable {
    /**
     * Get User object by email.
     *
     * @example
     *   const email = 'email@example.com';
     *   cy.oktaGetUser(email).then((data) => {
     *     cy.log(data);
     *   });
     * @param userEmail
     */
    oktaGetUser(userEmail): Chainable;

    /**
     * Creates and activates a user in Okta.
     *
     * @param user
     */
    oktaCreateUser(user: User): Chainable;

    /**
     * Delete user by userID.
     *
     * @example
     *   cy.oktaGetUser('email@example.com').then((data) => {
     *       cy.oktaDeleteUser(data.id);
     *     });
     * @param userId
     */
    oktaDeleteUserById(userId): Chainable;

    /**
     * Delete user by email.
     * @example
     *   cy.oktaDeleteUserByEmail('email@example.com');
     * @param email
     */
    oktaDeleteUserByEmail(email): Chainable;

    /**
     * SSO Okta login, set a token in a browser local storage and open Getting started page.
     *
     * @param email
     * @param password
     */
    loginByOktaApi(email, password): Chainable;

    /**
     * Perform /v1/auth/SignIn API request and return user access_token.
     *
     * @param email
     * @param password
     */
    getUserAccessToken(email, password): Chainable;
  }
}
