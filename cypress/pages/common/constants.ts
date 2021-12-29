/// <reference types="cypress" />

// eslint-disable-next-line no-shadow
export enum Pages {
  Login = 'Login',
  SignUp = 'SignUp',
  Profile = 'Profile',
}

export const pageDetailsMap = {
  [Pages.Login]: {
    url: '/login',
  },
  [Pages.SignUp]: {
    url: '/signup',
  },
  [Pages.Profile]: {
    url: '/profile',
  },
};

export const MESSAGES = {
  REQUIRED_FIELD: 'Required field',
};
