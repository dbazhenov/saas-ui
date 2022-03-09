import { User } from 'pages/common/interfaces/Auth';
import {
  fillOutSignUpForm,
  getMailosaurEmailAddress,
  SignUpFormErrors,
  verifyValidationSignUp,
} from './helpers/signUp.helper';

const signUpPage = {
    constants: {
      labels: {
        emailPlaceholder: 'Work or Professional email *',
        passwordPlaceholder: 'Password *',
        firstNamePlaceholder: 'First name *',
        lastNamePlaceholder:  'Last name *',
        activateAccount: 'Activate Account',
        activateEmailSubject: 'Percona Account Activation',
        activateEmailHeader: 'Welcome to Percona Platform!',
        activateEmailVerifyAccount: 'To verify your email address and activate your account, please click the following link:',
        activateEmailFooter: 'This is an automatically generated message by Okta. Replies are not monitored or answered.',
      },
      messages: {
        emailAlreadyRegistered: 'An account with that Work or Professional email already exists',
        termsOfServiceText: 'I have read and agree to the Terms of Service and Privacy Policy',
        invalidEmail: 'This value is not a valid email address',
        verificationEmailSentTitle: 'Verification email sent',
        verificationEmailSentDesc: 'To finish signing in, check your email.',
        verificationEmailBackToSignIn: 'Back to sign in',
        blankFieldError: 'This field cannot be left blank',
        validationErrorAlert: 'We found some errors. Please review the form and make corrections.',
      },
      links: {
        registerAddress: 'https://id-dev.percona.com/signin/register',
        platformPrivacy: 'https://per.co.na/pmm/platform-privacy',
        platformTerms: 'https://per.co.na/pmm/platform-terms',
      },
    },
    locators: {
      inputEmail: '[data-se="o-form-input-email"]',
      inputPassword: '[data-se="o-form-input-password"]',
      inputPasswordChildren: '[type="password"]',
      inputFirstName: '[data-se="o-form-input-firstName"]',
      inputLastName: '[data-se="o-form-input-lastName"]',
      registerButton: '[type="submit"]',
      termsOfService: '[name="tos"]',
      termsOfServiceLabel: '[data-se-for-name="tos"]',
      signInLink: '[name="back-link]',
      registrationAlert: '[role="alert"]',
      registrationCompleteContainer: '[data-se="o-form-content"]',
      registrationCompleteTitle: '.title',
      registrationCompleteDesc: '.desc',
      registrationCompleteBackLink: '[data-se="back-link"]',
      formErrorContainer: '[data-se="o-form-error-container"]',
    },
    methods: {
      fillOutSignUpForm: (user: User) => fillOutSignUpForm(user),
      getMailosaurEmailAddress: (user: User) => getMailosaurEmailAddress(user),
      verifyValidationSignUp: (errorFields: SignUpFormErrors) => verifyValidationSignUp(errorFields),
    },
  };

export default signUpPage;
