import { OktaAuth } from '@okta/okta-auth-js';
import {
  OAUTH_CLIENT_ID,
  OAUTH_HOST,
  OAUTH_ISSUER_URI,
  PORTAL_ORIGIN,
  PRIVACY_PMM_URL,
  TERMS_OF_SERVICE_URL,
  GOOGLE_IDP_ID,
  GITHUB_IDP_ID,
} from './constants';
import { Messages } from './messages';

export const authConfig = {
  baseUrl: `https://${OAUTH_HOST}`,
  clientId: OAUTH_CLIENT_ID,
  redirectUri: `${PORTAL_ORIGIN}/login/callback`,
  issuer: OAUTH_ISSUER_URI,
  features: {
    registration: true,
    rememberMe: true,
    idpDiscovery: true,
  },
  authParams: {
    pkce: true,
  },
  colors: {
    brand: '#4c15a5',
  },
  i18n: {
    en: {
      'primaryauth.title': Messages.signIn,
      'primaryauth.username.placeholder': Messages.workEmail,
      'primaryauth.username.tooltip': Messages.workEmail,
      'registration.signup.text': Messages.registration.link,
      'registration.signup.label': Messages.registration.label,
      'registration.form.title': Messages.signUpTitle,
      'registration.form.submit': Messages.signUpButton,
      'socialauth.google.label': Messages.signInGoogle,
      'socialauth.github.label': Messages.signInGithub,
    },
  },
  helpLinks: {
    custom: [
      {
        text: 'Terms of Service',
        href: TERMS_OF_SERVICE_URL,
        target: '_blank',
      },
      {
        text: 'Privacy Policy',
        href: PRIVACY_PMM_URL,
        target: '_blank',
      },
    ],
  },
  scopes: ['openid', 'profile', 'email', 'percona'],
  postLogoutRedirectUri: `${PORTAL_ORIGIN}`,
  idpDiscovery: {
    requestContext: `${PORTAL_ORIGIN}/login/callback`,
  },
  idps: [
    { type: 'GOOGLE', id: GOOGLE_IDP_ID },
    { type: 'GITHUB', id: GITHUB_IDP_ID },
  ],
};

export const oktaAuth = new OktaAuth(authConfig);
