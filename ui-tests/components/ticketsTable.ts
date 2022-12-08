/* eslint-disable lines-between-class-members */
import { Page, expect } from '@playwright/test';
import { Table } from './Table';

enum TableHeader {
  Number = 'Number',
  Status = 'Status',
  ShortDescription = 'Short Description',
  Category = 'Category',
  Priority = 'Priority',
  CreationDate = 'Creation Date',
  RequestedBy = 'Requested By',
}

export class TicketsTable extends Table {
  constructor(page: Page) {
    super(page);
  }
  tableHeaders = TableHeader;

  getTableColumnsData = async (columns: string[] = Object.values(this.elements.header)): Promise<unknown> => {
    const columnPromise = columns.map(async (column) => {
      const returnedValues = await this.getValuesForColumn(column);

      return { column, value: returnedValues };
    });

    return Promise.all(columnPromise).then((result) => result);
  };

  getValuesForColumn = async (column: string): Promise<string[]> => {
    await this.elements.header.waitFor({ state: 'visible' });
    const returnedValues = [];
    const numberOfRows = await this.elements.row.count();
    const columns: string[] = Object.values(this.elements.row);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberOfRows; i++) {
      returnedValues.push(
        this.elements.row
          .nth(i)
          .locator(`//td[${columns.indexOf(column) + 1}]`)
          .textContent(),
      );
    }

    return Promise.all(returnedValues);
  };

  verifyRowData = async (ticket, rowNumber = 0) => {
    await expect(this.rowCell(rowNumber).nth(0)).toHaveText(ticket.number);
    await expect(this.rowCell(rowNumber).nth(1)).toHaveText(ticket.state);
    await expect(this.rowCell(rowNumber).nth(2)).toHaveText(ticket.short_description);
    await expect(this.rowCell(rowNumber).nth(3)).toHaveText(ticket.department);
    await expect(this.rowCell(rowNumber).nth(4)).toHaveText(ticket.priority);
    await expect(this.rowCell(rowNumber).nth(6)).toHaveText(ticket.requester);
  };
}
