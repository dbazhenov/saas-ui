import { activateUser } from './helpers/activation.helper';

const activationPage = {
  constants: {
    labels: {},
    messages: {},
    links: {},
  },
  locators: {
    newPassword: '[id="loginForm.newPassword"]',
    verifyPassword: '[id="loginForm.verifyPassword"]',
    submitButton: '[id="next-button"]',
  },
  links: {},
  methods: {
    activateUser: (password: string) => activateUser(password),
  },
};

export default activationPage;
