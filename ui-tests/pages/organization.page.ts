/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import ConfirmDeleteOrgModal from '@tests/components/OrganizationDeleteModal';
import OrganizationTabs from '@tests/components/organizationTabs';
import { CommonPage } from '@pages/common.page';

export class OrganizationPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  organizationTabs = new OrganizationTabs(this.page);
  confirmDeleteOrgModal = new ConfirmDeleteOrgModal(this.page);

  elements = {
    manageOrgContainer: this.page.getByTestId('manage-organization-organization-tab'),
    orgName: this.page.getByTestId('organization-name'),
    orgNameFieldError: this.page.locator('//p[@id="organizationName-text-error"]'),
  };

  fields = {
    orgName: this.page.locator('//input[@data-testid="organizationName-text-input"]'),
  };

  labels = {
    orgNamePlaceholder: 'Your organization name',
    requiredField: 'Required field',
  };

  buttons = {
    editOrg: this.page.locator('//button[@data-testid="member-actions-edit"]'),
    deleteOrg: this.page.locator('//button[@data-testid="member-actions-delete"]'),
    submitEditOrg: this.page.locator('//button[@data-testid="edit-organization-submit-button"]'),
    createOrg: this.page.locator('//button[@data-testid="create-organization-submit-button"]'),
  };

  messages = {
    orgCreatedSuccessfully: 'Your organization has been created.',
    orgEditedSuccessfully: 'Your organization has been updated.',
    memberEditedSuccessfully: "The user's role has been successfully updated",
  };

  links = {};
}
