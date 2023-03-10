/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { OrganizationPage } from '@pages/organization.page';
import { MembersTable } from '@tests/components/membersTable';
import OrganizationTabs from '@tests/components/organizationTabs';

export class MembersPage extends OrganizationPage {
  constructor(page: Page) {
    super(page);
  }

  membersTable = new MembersTable(this.page);
  organizationTabs = new OrganizationTabs(this.page);

  container = this.page.locator('//div[@data-testid="manage-organization-members-tab"]');
}
