import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class ProfilePage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    myProfileHeader: this.page.getByTestId('profile-details-header'),
    tokenHeader: this.page.getByTestId('token-header'),
    userName: this.page.getByTestId('first-last-name'),
    userEmail: this.page.getByTestId('user-email'),
    oktaUsername: this.page.getByTestId('//dd[@id="person_info.read_only.username"]'),
  };

  fields = {};

  labels = {
    myProfileHeader: 'My Profile',
    tokenHeader: 'Percona Platform Access Token',
    editProfile: 'Edit Profile',
    copyToken: 'Copy Token',
  };

  buttons = {
    editProfile: this.page.getByTestId('edit-profile-button'),
    copyToken: this.page.getByTestId('token-copy'),
  };

  messages = {
    tokenCopied: 'Your access token has been copied to the clipboard',
  };

  links = {
    editProfile: 'https://id-dev.percona.com/enduser/settings',
    oktaUrl: 'https://id-dev.percona.com/enduser/settings',
  };
}
