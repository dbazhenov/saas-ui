import { OktaAuth } from '@okta/okta-auth-js';
import { profileIcon } from 'pages/main/selectors';

const token = `SSWS ${Cypress.env('okta_token')}`;
const url = `https://${Cypress.env('oauth_host')}`;

Cypress.Commands.add('loginByOktaApi', (username, password) =>
  cy
    .request({
      method: 'POST',
      url: `${url}/api/v1/authn`,
      body: {
        username,
        password,
      },
    })
    .then(({ body }) => {
      // eslint-disable-next-line no-underscore-dangle
      const { user } = body._embedded;
      const config = {
        issuer: `${url}/oauth2/default`,
        clientId: Cypress.env('oauth_client_id'),
        pkce: true,
        redirectUri: `${Cypress.config('baseUrl')}/login/callback`,
        scope: ['percona', 'openid', 'email', 'profile'],
      };
      const authClient = new OktaAuth(config);

      return authClient.token.getWithoutPrompt({ sessionToken: body.sessionToken }).then(({ tokens }) => {
        const userToken = {
          token: tokens.accessToken.accessToken,
          user: {
            sub: user.id,
            email: user.profile.login,
            given_name: user.profile.firstName,
            family_name: user.profile.lastName,
            preferred_username: user.profile.login,
          },
        };

        window.localStorage.setItem('okta-token-storage', JSON.stringify(userToken));

        cy.visit('/');
        profileIcon().isVisible();
      });
    }),
);

Cypress.Commands.add('retrieveCurrentUserAccessToken', () => {
  return JSON.parse(window.localStorage.getItem('okta-token-storage')).accessToken.accessToken;
});

Cypress.Commands.add('removeCurrentUserAccessToken', () => {
  window.localStorage.removeItem('okta-token-storage');
});

Cypress.Commands.add('getUserAccessToken', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/v1/auth/SignIn',
    body: {
      email: username,
      password,
    },
  }).then(({ body: { access_token } }) => cy.wrap(access_token));
});

Cypress.Commands.add('oktaCreateUser', ({ email, password, firstName, lastName }, activate=true) =>
  cy
    .task('oktaRequest', {
      baseUrl: url,
      urlSuffix: `/api/v1/users?activate=${activate}`,
      method: 'post',
      token,
      data: {
        profile: {
          firstName,
          lastName,
          email,
          login: email,
        },
        credentials: {
          password: { value: password },
        },
      },
    })
    .then((response) => {
      // eslint-disable-next-line no-magic-numbers
      expect(response.status).to.equal(200);
    }),
);

Cypress.Commands.add('oktaGetUser', (userId = '') =>
  cy
    .task('oktaRequest', {
      baseUrl: url,
      urlSuffix: `/api/v1/users?q=${userId}`,
      method: 'get',
      token,
    })
    .then((response) => {
      // eslint-disable-next-line no-magic-numbers
      expect(response.status).to.equal(200);
      if (response.data && response.data.length) {
        return cy.wrap(response.data[0]);
      }

      return cy.wrap(null);
    }),
);

Cypress.Commands.add('oktaDeleteUserById', (userId = '') => {
  cy.task('oktaRequest', {
    baseUrl: url,
    urlSuffix: `/api/v1/users/${userId}`,
    method: 'delete',
    token,
  }).then((response) => {
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).to.equal(204);
    expect(response.data).is.empty;
  });
});

Cypress.Commands.add('oktaDeleteUserByEmail', (email) => {
  expect(email).to.not.be.undefined;
  cy.oktaGetUser(email).then((data) => {
    cy.oktaDeleteUserById(data.id);
  });
});
