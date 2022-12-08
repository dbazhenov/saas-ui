/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import ModalWindow from './modalWindow';

export default class OrganizationDeleteModal extends ModalWindow {
  constructor(page: Page) {
    super(page);
  }


  // Elements
  message = this.page.locator('//p[@data-testid="delete-org-message"]');
  confirm = this.page.locator('//p[@data-testid="delete-org-confirm"]');
  orgNameInput = this.page.locator('//input[@data-testid="orgName-text-input"]');
  cancelButton = this.page.locator('//button[@data-testid="delete-organization-cancel-button"]');
  submitButton = this.page.locator('//button[@data-testid="delete-organization-submit-button"]');

  // Messages
  headerLabel = 'Delete Organization';
  bodyMessage = (orgName: string) => `Are you sure you want to delete the "${orgName}" organization? 
    You will not be able to recover it later, and you will permanently lose all the data associated with it.
    This includes active users, PMM connections and available advisors.`;
  confirmMessage = 'To confirm this action, type the name of your organization below:';
  successMessage = 'Your organization has been deleted.';

};
