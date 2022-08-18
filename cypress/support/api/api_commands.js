Cypress.Commands.add('cleanUpAfterTest', (users, orgAdminUser) => {
  if (orgAdminUser !== undefined) {
    cy.getUserAccessToken(orgAdminUser.email, orgAdminUser.password).then((token) =>
      cy.oktaGetUser(orgAdminUser.email).then((res) => {
        res.profile.portalAdminOrgs.forEach((org) => {
          cy.apiDeleteOrg(org, token);
        });
      }),
    );
  }

  users.forEach((user) => cy.oktaDeleteUserByEmail(user.email));
});

Cypress.Commands.add(
  'apiUpdateUserProfile',
  ({ accessToken, firstName, lastName, marketing = false, tos = true }) => {
    cy.request({
      method: 'POST',
      url: '/v1/auth/UpdateProfile',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        firstName,
        lastName,
        marketing,
        tos,
      },
    });
  },
);
