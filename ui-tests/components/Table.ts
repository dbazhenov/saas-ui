import { Page, expect } from '@playwright/test';

export class Table {
  constructor(readonly page: Page) {}

  // Components
  pagination = this.page.locator('//div[contains(@class, "MuiTablePagination-root")]');
  tableData = this.page.locator("//div[contains(@class, 'MuiDataGrid-virtualScroller')]");

  // Elements
  table = this.page.locator('//div[@role="grid"]');
  emptyTable = this.page.locator('//div[@data-testid="table-no-data"]');
  body = this.page.locator('//tbody[@data-testid="table-tbody"]');
  header = this.page.getByRole('rowgroup');
  headerCell = this.page.getByRole('columnheader');
  row = this.tableData.getByRole('row');
  rowCell = (position: number) =>
    this.page.locator('//*[contains(@data-id, "row")]').nth(position).locator('//div[@role="cell"]');
  rowByText = (text: string) =>
    this.page.locator(`//div[contains(text(), "${text}")]//ancestor::div[@role="row"]`);
  bodyCell = this.page.locator('//tr[@data-testid="table-tbody-tr"]//td');
  headerSort = this.page.locator('//tr[@data-testid="table-thead-tr"]//th//i');

  // Pagination
  paginationComponent = {
    texts: [10, 25, 50, 100],
    interval: (start, end, total) => `${start}–${end} of ${total}`,
    select: this.pagination.locator('//*[@role="button"]'),
    sizeSelect: this.page.locator('//li[@role="option"]'),
    sizeSelectByValue: (value: number) =>
      this.page.locator(
        `//div[contains(@class, "grafana-select-option-body")]//span[contains(text(), "${value}")]`,
      ),
    intervalLocator: this.pagination.locator('//p[contains(@class, "MuiTablePagination-displayedRows")]'),
    previousPage: this.pagination.locator('//*[@data-testid="KeyboardArrowLeftIcon"]'),
    nextPage: this.pagination.locator('//*[@data-testid="KeyboardArrowRightIcon"]'),
  };

  selectPaginationValue = async (value: number) => {
    const paginationPosition = this.paginationComponent.texts.indexOf(value);

    await this.paginationComponent.select.click();
    await this.paginationComponent.sizeSelect.nth(paginationPosition).click();

    await expect(this.row).toHaveCount(value);
  };

  verifyPagination = async (pagination: number) => {
    const elements = await this.paginationComponent.sizeSelect.elementHandles();

    await elements[this.paginationComponent.texts.indexOf(pagination)].click();
    await expect(this.row).toHaveCount(pagination);
  };
}
