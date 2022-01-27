export const createOrgAndAddUsers = (users) => {
  cy.getUserAccessToken(users[0].email, users[0].password).then((token) =>
    cy.apiCreateOrg(token).then((res) => {
      cy.apiInviteOrgMember(token, res.org.id, {
        username: users[1].email,
        role: 'Technical',
      });
    }),
  );
};
