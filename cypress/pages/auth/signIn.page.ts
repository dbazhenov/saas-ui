import { fillOutSignInUserDetails, isSignInPageDisplayed } from './helpers/signIn.helper';

const signInPage = {
  constants: {
    labels: {},
    messages: {
      forgotPassword: 'Forgot password?',
      formHeaderText: 'Sign in to Percona Platform',
      helpLink: 'Help',
      needHelp: 'Need help signing in?',
      nextButtonText: 'Next',
      signUpLink: 'Create one',
      unableToSignIn: 'Unable to sign in',
    },
    links: {},
  },
  locators: {
    emailInput: '[id=idp-discovery-username]',
    forgotPassword: '[data-se=forgot-password]',
    formHeader: '[data-se=o-form-head]',
    helpLink: '[data-se=help-link]',
    needHelp: '[data-se=needhelp]',
    nextButton: '[id=idp-discovery-submit]',
    passwordInput: '[id=okta-signin-password]',
    signInButton: '[id=okta-signin-submit]',
    signUpLink: '.registration-link',
    unableToSignIn: '[data-se="o-form-error-container"]',
  },
  links: {},
  methods: {
    fillOutSignInUserDetails: (email?: string, password?: string) =>
      fillOutSignInUserDetails(email, password),
    isSignInPageDisplayed: () => isSignInPageDisplayed(),
  },
};

export default signInPage;
