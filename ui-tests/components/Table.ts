/* eslint-disable no-empty-function */
import { Page, expect } from '@playwright/test';
import IPage from '@tests/pages/page.interface';

export class Table implements IPage {
  constructor(readonly page: Page) {}

  messages = {};

  elements = {
    table: this.page.locator('//table[@data-testid="table"]'),
    emptyTable: this.page.locator('//div[@data-testid="table-no-data"]'),
    body: this.page.locator('//tbody[@data-testid="table-tbody"]'),
    header: this.page.locator('//tr[@data-testid="table-thead-tr"]'),
    row: this.page.locator('//tr[@data-testid="table-tbody-tr"]'),
    rowCell: (position: number) =>
      this.page.locator('//tr[@data-testid="table-tbody-tr"]').nth(position).locator('//td'),
    rowByText: (text: string) => this.page.locator(`//td[contains(text(), "${text}")]/parent::*`),
    bodyCell: this.page.locator('//tr[@data-testid="table-tbody-tr"]//td'),
    headerCell: this.page.locator('//tr[@data-testid="table-thead-tr"]//th'),
    headerSort: this.page.locator('//tr[@data-testid="table-thead-tr"]//th//i'),
    pagination: this.page.locator('//div[@data-testid="pagination"]'),
  };

  fields = {};

  buttons = {};

  pagination = {
    messages: {
      texts: [10, 25, 50, 100],
      interval: (start, end, total) => `Showing ${start}-${end} of ${total} items`,
    },
    elements: {
      select: this.elements.pagination.locator('//div[contains(@class, "grafana-select-value-container")]'),
      sizeSelect: this.elements.pagination.locator('//div[contains(@class, "grafana-select-option-body")]'),
      sizeSelectByValue: (value: number) =>
        this.page.locator(
          `//div[contains(@class, "grafana-select-option-body")]//span[contains(text(), "${value}")]`,
        ),
      interval: this.elements.pagination.locator('//span[@data-testid="pagination-items-inverval"]'),
    },
    fields: {},
    buttons: {
      page: this.elements.pagination.locator('//button[@data-testid="page-button"]'),
      firstPage: this.elements.pagination.locator('//button[@data-testid="first-page-button"]'),
      previousPage: this.elements.pagination.locator('//button[@data-testid="previous-page-button"]'),
      nextPage: this.elements.pagination.locator('//button[@data-testid="next-page-button"]'),
      lastPage: this.elements.pagination.locator('//button[@data-testid="last-page-button"]'),
    },
  };

  selectPaginationValue = async (value: number) => {
    const paginationPosition = this.pagination.messages.texts.indexOf(value);

    await this.pagination.elements.select.click();
    await this.pagination.elements.sizeSelect.nth(paginationPosition).click();

    await expect(this.elements.row).toHaveCount(value);
  };

  verifyPagination = async (pagination: number) => {
    const elements = await this.pagination.elements.sizeSelect.elementHandles();

    await elements[this.pagination.messages.texts.indexOf(pagination)].click();
    await expect(this.elements.row).toHaveCount(pagination);
  };
}
