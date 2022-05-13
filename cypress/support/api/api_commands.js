Cypress.Commands.add('cleanUpAfterTest', (users, orgAdminUser) => {
  if (orgAdminUser !== undefined) {
    cy.getUserAccessToken(orgAdminUser.email, orgAdminUser.password).then((token) =>
      cy.oktaGetUser(orgAdminUser.email)
        .then((res) => {res.profile.portalAdminOrgs.forEach((org) => {
          cy.apiDeleteOrg(org, token);
        });
      }),
    );
  }

  users.forEach((user) => cy.oktaDeleteUserByEmail(user.email));
});
