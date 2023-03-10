import { Page } from '@playwright/test';

export default class OrganizationTabs {
  constructor(readonly page: Page) {}

  elements = {
    members: this.page.locator('//button[@data-testid="manage-organization-tab"]', { hasText: 'Members' }),
    organization: this.page.locator('//button[@data-testid="manage-organization-tab"]', {
      hasText: 'Organization',
    }),
    activityLog: this.page.locator('//button[@data-testid="manage-organization-tab"]', {
      hasText: 'Activity Log',
    }),
  };

  fields = {};

  labels = {};

  buttons = {};

  messages = {};

  links = {};
}
