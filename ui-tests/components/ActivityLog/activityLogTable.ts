import { ElementHandle, Page } from '@playwright/test';
import { Table } from '../table';

interface Columns {
  Time: string;
  UserId: string;
  EventType: string;
  Details: string;
}

export class ActivityLogTable extends Table {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    ...super.getTableElements(),
  };

  fields = {
    ...super.getTableFields(),
  };

  labels = {
    ...super.getTableLabels(),
  };

  buttons = {
    ...super.getTableButtons(),
  };

  messages = {
    ...super.getTableMessages(),
    orgCreated: (userId: string, orgName: string) => `User ${userId} created "${orgName}" organization`,
    userDeleted: (adminUser: string, deletedUser: string) =>
      `User ${adminUser} deleted "${deletedUser}" organization member`,
    userAdded: (adminUser: string, addedUser: string) =>
      `User ${adminUser} created "${addedUser}" organization member`,
    inventoryCreated: (adminUser: string, inventoryName: string) =>
      `User ${adminUser} created "${inventoryName}" inventory`,
    inventoryDeleted: (adminUser: string, inventoryName: string) =>
      `User ${adminUser} deleted "${inventoryName}" inventory`,
  };

  links = {
    ...super.getTableLinks(),
  };

  getRowByText = async (
    text: string,
    position: 'Time' | 'UserId' | 'EventType' | 'Details',
  ): Promise<Columns> => {
    try {
      await this.elements.row.waitFor({ state: 'visible' });
      // eslint-disable-next-line no-empty
    } catch (e) {}

    const rows: ElementHandle<Node>[] = await this.elements.row.elementHandles();
    const parsedRows: Columns[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const row of rows.entries()) {
      const rawRow = (await row[1].innerText()).split(/\r?\n/);

      parsedRows.push({ Time: rawRow[0], UserId: rawRow[1], EventType: rawRow[2], Details: rawRow[3] });
    }

    let foundRow: Columns | PromiseLike<Columns>;

    switch (position) {
      case 'Time':
        foundRow = parsedRows.find((row) => row.Time.includes(text));
        break;
      case 'UserId':
        foundRow = parsedRows.find((row) => row.UserId.includes(text));
        break;
      case 'EventType':
        foundRow = parsedRows.find((row) => row.EventType.includes(text));
        break;
      case 'Details':
        foundRow = parsedRows.find((row) => row.Details.includes(text));
        break;
      default:
        break;
    }

    if (!foundRow) {
      throw new Error(`Row with text "${text}" is not present in column "${position}" of activity Log`);
    }

    return foundRow;
  };
}
