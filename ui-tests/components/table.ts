import { Page } from '@playwright/test';
import { TablePagination } from './tablePagination';

export class Table {
  constructor(readonly page: Page) {}

  pagination = new TablePagination(this.page, this);
  tableData = this.page.locator("//div[contains(@class, 'MuiDataGrid-virtualScroller')]");

  private tableElements = {
    table: this.page.locator('//div[@role="grid"]'),
    emptyTable: this.page.locator('//div[@data-testid="table-no-data"]'),
    body: this.page.locator('//tbody[@data-testid="table-tbody"]'),
    header: this.page.getByRole('rowgroup'),
    headerCell: this.page.getByRole('columnheader'),
    row: this.tableData.getByRole('row'),
    rowCell: (position: number) =>
      this.page.locator('//*[contains(@data-id, "row")]').nth(position).locator('//div[@role="cell"]'),
    rowByText: (text: string) =>
      this.page.locator(`//div[contains(text(), "${text}")]//ancestor::div[@role="row"]`),
    bodyCell: this.page.locator('//tr[@data-testid="table-tbody-tr"]//td'),
    headerSort: this.page.locator('//tr[@data-testid="table-thead-tr"]//th//i'),
  };

  private tableFields = {};

  private tableLabels = {};

  private tableButtons = {};

  private tableMessages = {};

  private tableLinks = {};

  protected getTableElements() {
    return this.tableElements;
  }

  protected getTableFields() {
    return this.tableFields;
  }

  protected getTableLabels() {
    return this.tableLabels;
  }

  protected getTableButtons() {
    return this.tableButtons;
  }

  protected getTableMessages() {
    return this.tableMessages;
  }

  protected getTableLinks() {
    return this.tableLinks;
  }
}
