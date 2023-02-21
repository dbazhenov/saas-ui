import { OAUTH_HOST } from 'core/constants';

export const Routes = {
  editProfile: `https://${OAUTH_HOST}/enduser/settings`,
  help: `https://${OAUTH_HOST}/help/login`,
  instances: '/pmm-instances',
  login: '/login',
  signup: '/signup',
  loginCallback: '/login/callback',
  logout: '/logout',
  organization: '/organization',
  profile: '/profile',
  activation: '/activation',
  root: '/',
  resetPassword: `https://${OAUTH_HOST}/signin/forgot-password`,
  home: '/home',
  welcome: '/welcome',
  dashboard: '/dashboard',
  kubernetes: '/kubernetes',
};

export const RouteNames = {
  [Routes.home]: 'Home',
  [Routes.organization]: 'My Organization',
  [Routes.instances]: 'PMM Instances',
  [Routes.kubernetes]: 'Free Kubernetes Cluster',
  [Routes.profile]: 'Percona Account',
};
