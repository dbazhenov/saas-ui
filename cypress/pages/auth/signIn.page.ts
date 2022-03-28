import { fillOutSignInUserDetails } from './helpers/signIn.helper';

const signInPage = {
    constants: {
      labels: {},
      messages: {},
      links: {},
    },
    locators: {
        emailInput: '[id=idp-discovery-username]',
        passwordInput: '[id=okta-signin-password]',
        signInButton: '[id=okta-signin-submit]',
    },
    links: {},
    methods: {
        fillOutSignInUserDetails: (email?: string, password?: string) => {
          fillOutSignInUserDetails(email, password);
        },
    },
  };

export default signInPage;
