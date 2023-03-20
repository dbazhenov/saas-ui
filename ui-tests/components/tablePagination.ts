import { Page, expect } from '@playwright/test';
import { Table } from './Table';

export class TablePagination {
  constructor(readonly page: Page, readonly table: Table) {}

  pagination = this.page.locator('//div[contains(@class, "MuiTablePagination-root")]');

  elements = {
    intervalLocator: this.pagination.locator('//p[contains(@class, "MuiTablePagination-displayedRows")]'),
  };

  fields = {
    select: this.pagination.locator(
      '//div[@role="button" and contains(@class, "MuiTablePagination-select")]',
    ),
    sizeSelect: this.page.getByRole('option'),
    sizeSelectByValue: (value: number) =>
      this.page.locator(
        `//div[contains(@class, "grafana-select-option-body")]//span[contains(text(), "${value}")]`,
      ),
  };

  labels = {
    texts: [10, 25, 50, 100],
    interval: (start, end, total) => `${start}–${end} of ${total}`,
  };

  buttons = {
    previousPage: this.pagination.getByTestId('KeyboardArrowLeftIcon'),
    nextPage: this.pagination.getByTestId('KeyboardArrowRightIcon'),
  };

  messages = {};

  links = {};

  selectPaginationValue = async (value: number) => {
    const paginationPosition = this.labels.texts.indexOf(value);

    await this.fields.select.click();
    await this.fields.sizeSelect.nth(paginationPosition).click();

    await expect(this.table.elements.row).toHaveCount(value);
  };

  verifyPagination = async (pagination: number) => {
    const elements = await this.fields.sizeSelect.elementHandles();

    await elements[this.labels.texts.indexOf(pagination)].click();
    await expect(this.table.elements.row).toHaveCount(pagination);
  };
}
