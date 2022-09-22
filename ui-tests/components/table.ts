/* eslint-disable lines-between-class-members */
import { CommonPage } from '@pages/common.page';
import { Locator, Page } from '@playwright/test';

export class Table extends CommonPage {
  readonly page: Page;

  readonly table: Locator;
  readonly tableBody: Locator;
  readonly tableHeader: Locator;
  readonly tableRow: Locator;
  readonly tableCell: Locator;
  readonly tableHeaderCell: Locator;
  readonly emptyTable: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.table = page.locator('//table[@data-testid="table"]');
    this.tableBody = page.locator('//tbody[@data-testid="table-tbody"]');
    this.tableHeader = page.locator('//tr[@data-testid="table-thead-tr"]');
    this.tableRow = page.locator('//tr[@data-testid="table-tbody-tr"]');
    this.tableCell = this.tableRow.locator('//td');
    this.tableHeaderCell = this.tableHeader.locator('//th');
    this.emptyTable = page.locator('//div[@data-testid="table-no-data"]');
  }
}
