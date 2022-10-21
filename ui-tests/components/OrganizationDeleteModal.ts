/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import IPage from '@tests/pages/page.interface';
import ModalWindow from './modalWindow';

export default class OrganizationDeleteModal extends ModalWindow implements IPage {
  constructor(page: Page) {
    super(page);
  }

  messages = {
    header: 'Delete Organization',
    body: (orgName: string) => `Are you sure you want to delete the "${orgName}" organization? 
    You will not be able to recover it later, and you will permanently lose all the data associated with it.
    This includes active users, PMM connections and available advisors.`,
    confirm: 'To confirm this action, type the name of your organization below:',
    success: 'Your organization has been deleted.',
  };

  elements = {
    ...this.elements,
    message: this.page.locator('//p[@data-testid="delete-org-message"]'),
    confirm: this.page.locator('//p[@data-testid="delete-org-confirm"]'),
  };

  fields = {
    orgNameInput: this.page.locator('//input[@data-testid="orgName-text-input"]'),
  };

  buttons = {
    ...this.buttons,
    cancel: this.page.locator('//button[@data-testid="delete-organization-cancel-button"]'),
    submit: this.page.locator('//button[@data-testid="delete-organization-submit-button"]'),
  };
}
