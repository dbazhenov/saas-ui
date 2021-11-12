import { OAUTH_HOST } from 'core/constants';

export const Routes = {
  editProfile: `https://${OAUTH_HOST}/enduser/settings`,
  help: `https://${OAUTH_HOST}/help/login`,
  login: '/login',
  loginCallback: '/login/callback',
  logout: '/logout',
  organization: '/organization',
  profile: '/profile',
  root: '/',
  resetPassword: `https://${OAUTH_HOST}/signin/forgot-password`,
  signup: `https://${OAUTH_HOST}/signin/register`,
  ui: '/ui',
  welcome: '/welcome',
};
