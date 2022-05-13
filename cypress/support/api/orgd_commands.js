/// <reference types="cypress" />

Cypress.Commands.add('apiCreateOrg', (accessToken, orgName = 'Test Organization') => {
  cy.request({
    method: 'POST',
    url: 'v1/orgs',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      name: orgName,
    },
  }).then((res) => res.body);
});

Cypress.Commands.add('apiGetOrg', (accessToken) => {
  cy.request({
    method: 'POST',
    url: 'v1/orgs:search',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
});

Cypress.Commands.add('apiDeleteOrg', (orgId, accessToken) => {
  cy.request({
    method: 'DELETE',
    url: `/v1/orgs/${orgId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
      // eslint-disable-next-line no-magic-numbers
      expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add('apiInviteOrgMember', (accessToken, orgId, member = { username: '', role: '' }) => {
  cy.request({
    method: 'POST',
    url: `v1/orgs/${orgId}/members`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: member,
  });
});
