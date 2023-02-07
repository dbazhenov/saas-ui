import { OktaAuth } from '@okta/okta-auth-js';
import {
  OAUTH_CLIENT_ID,
  OAUTH_HOST,
  OAUTH_ISSUER_URI,
  PORTAL_ORIGIN,
  GOOGLE_IDP_ID,
  GITHUB_IDP_ID,
  TERMS_OF_SERVICE_URL,
  PRIVACY_PMM_URL,
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
      'password.forgot.email.or.username.placeholder': Messages.workEmail,
      'password.forgot.email.or.username.tooltip': Messages.workEmail,
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
  scopes: ['openid', 'profile', 'email', 'percona', 'offline_access'],
  postLogoutRedirectUri: `${PORTAL_ORIGIN}`,
  idpDiscovery: {
    requestContext: `${PORTAL_ORIGIN}/login/callback`,
  },
  idps: [
    { type: 'GOOGLE', id: GOOGLE_IDP_ID },
    { type: 'GITHUB', id: GITHUB_IDP_ID },
  ],
  tokenManager: {
    autoRenew: true,
    secure: true,
    storage: 'localStorage',
  },
};

export const oktaAuth = new OktaAuth(authConfig);
