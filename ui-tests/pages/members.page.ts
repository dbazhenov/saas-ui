/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { OrganizationPage } from '@pages/organization.page';
import { MembersTable } from '@tests/components/membersTable';

export class MembersPage extends OrganizationPage {
  readonly page: Page;

  readonly membersTable: MembersTable;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.membersTable = new MembersTable(page);
  }
}
