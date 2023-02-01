/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import ConfirmDeleteOrgModal from '@tests/components/OrganizationDeleteModal';
import { CommonPage } from './common.page';

export class OrganizationPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  // Components
  confirmDeleteOrgModal = new ConfirmDeleteOrgModal(this.page);
  manageOrganizationContainer = this.page.locator(
    '//div[@data-testid="manage-organization-organization-tab"]',
  );

  // Locators
  membersTab = this.page.locator('//button[@data-testid="manage-organization-tab"]', { hasText: 'Members' });
  organizationTab = this.page.locator('//button[@data-testid="manage-organization-tab"]', {
    hasText: 'Organization',
  });
  activityLogTab = this.page.locator('//button[@data-testid="manage-organization-tab"]', {
    hasText: 'Activity Log',
  });

  editOrgButton = this.page.locator('//button[@data-testid="member-actions-edit"]');
  deleteOrgButton = this.page.locator('//button[@data-testid="member-actions-delete"]');
  editOrgSubmit = this.page.locator('//button[@data-testid="edit-organization-submit-button"]');
  organizationName = this.page.locator('//strong[@data-testid="organization-name"]');
  organizationNameInput = this.page.locator('//input[@data-testid="organizationName-text-input"]');
  organizationNameInputError = this.page.locator('//p[@id="organizationName-text-error"]');
  createOrgButton = this.page.locator('//button[@data-testid="create-organization-submit-button"]');

  // Messages
  orgCreatedSuccessfully = 'Your organization has been created.';
  orgEditedSuccessfully = 'Your organization has been updated.';
  memberEditedSuccessfully = "The user's role has been successfully updated";

  // Labels
  orgNamePlaceholder = 'Your organization name';
  requiredFieldLabel = 'Required field';
}
