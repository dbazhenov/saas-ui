import { OktaAuth } from '@okta/okta-auth-js';
import { OAUTH_CLIENT_ID, OAUTH_ISSUER_URI, PORTAL_ORIGIN } from './constants';


export const authConfig = {
  clientId: OAUTH_CLIENT_ID,
  issuer: OAUTH_ISSUER_URI,
  pkce: true,
  postLogoutRedirectUri: `${PORTAL_ORIGIN}`,
  redirectUri: `${PORTAL_ORIGIN}/login/callback`,
  scopes: ['openid', 'profile', 'email', 'percona'],
};

// eslint-disable-next-line no-console
console.log('authConfig', authConfig);

export const oktaAuth = new OktaAuth(authConfig);
