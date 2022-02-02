export const createOrgAndAddUsers = (adminUser, users = []) => {
  cy.getUserAccessToken(adminUser.email, adminUser.password).then((token) =>
    cy.apiCreateOrg(token).then((res) => {
      users.forEach((user) => {
        cy.apiInviteOrgMember(token, res.org.id, {
          username: user.email,
          role: user.role,
        });
      });
    }),
  );
};

export const getOrgAndAddUsers = (adminUser, users) => {
  cy.getUserAccessToken(adminUser.email, adminUser.password).then((token) =>
    cy.apiGetOrg(token).then((res) => {
      users.forEach((user) => {
        cy.apiInviteOrgMember(token, res.body.orgs[0].id, {
          username: user.email,
          role: user.role,
        });
      });
    }),
  );
};
