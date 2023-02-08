import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class LandingPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  landingPageContainer = this.page.getByTestId('landing-page-container');

  labels = {
    createAccount: 'Create Percona Account',
    signIn: 'Sign In',
    getDemo: 'Get a Demo',
    tos: 'Terms of Use',
    privacy: 'Privacy',
    copyright: 'Copyright',
    legal: 'Legal',
    securityCenter: 'Security Center',
  };

  buttons = {
    createAccount: this.landingPageContainer.getByTestId('create-account'),
    createPerconaAccount: this.landingPageContainer.getByTestId('create-percona-account'),
    login: this.landingPageContainer.getByTestId('login-button'),
    getDemo: this.landingPageContainer.getByTestId('get-demo'),
    tosFooter: this.landingPageContainer.getByTestId('Terms of Use-footer-menu-item'),
    privacyFooter: this.landingPageContainer.getByTestId('Privacy-footer-menu-item'),
    copyrightFooter: this.landingPageContainer.getByTestId('Copyright-footer-menu-item'),
    legalFooter: this.landingPageContainer.getByTestId('Legal-footer-menu-item'),
    securityCenterFooter: this.landingPageContainer.getByTestId('Security Center-footer-menu-item'),
  };
}
