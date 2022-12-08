export const Messages = {
  title: 'Welcome to Percona Portal!',
  subtitle: "Let's set you up",
  createYourAccount: {
    title: 'Create your account',
    description: 'Create your account in order to get access to Percona Portal.',
    name: 'First name',
    surname: 'Last name',
    yourPassword: 'Your password',
    verifyYourPassword: 'Verify your password',
  },
  passwordList: {
    title: 'Your password should',
    rules: [
      'Contain at least 10 characters',
      'Contain a lowercase letter',
      'Contain an uppercase letter',
      'Contain a number',
      /* 'Not contain parts of your username', */
      'Not include your first or last name',
      'Not be one of your last 4 passwords',
    ],
  },
  labels: {
    tos: 'Terms of Service checkbox',
    marketing: 'Marketing checkbox',
  },
  errors: {
    password: {
      lowerCase: 'Password needs to contain a lowercase letter',
      upperCase: 'Password needs to contain an uppercase letter',
      number: 'Password needs to contain a number',
      names: 'Password must not contain your first or last name',
    },
    passwordsMustMatch: 'Passwords must match',
  },
  help: 'Help Center',
  activateAccount: 'Activate Account',
  successfulActivation: 'Your account has been successfully activated.',
  somethingWentWrong: 'We are sorry, but something went wrong.',
  tokenExpired: {
    title: 'Token expired',
    description:
      'Your account activation link is not valid. This can happen if you click on the activation link after creating the account, the activation link has expired or the link URL is wrong.\nTo request a new token, contact your administrator.',
  },
  goToHome: 'Go to the Homepage',
};
