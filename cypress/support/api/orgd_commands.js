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
  }).then((res) => {
    return res.body;
  });
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
