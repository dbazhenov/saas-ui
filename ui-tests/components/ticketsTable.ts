import { Page } from '@playwright/test';
import { Table } from './table';

enum TableHeaders {
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

  tableHeaders = () => TableHeaders;
}
