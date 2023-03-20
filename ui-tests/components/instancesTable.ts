import { Page, expect } from '@playwright/test';
import { Table } from './table';

export default class InstancesTable extends Table {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    ...super.getTableElements(),
    removePmm: (serverName: string) =>
      this.elements.rowByText(serverName).getByTestId('pmm-instance-actions-remove'),
  };

  labels = {
    ...super.getTableLabels(),
    serverName: 'Server Name',
    serverId: 'Server ID',
    serverUrl: 'Server URL',
    actions: 'Actions',
  };

  verifyInstanceInTable = async (serverName: string, serverId: string, serverUrl: string) => {
    const response = (await this.elements.rowByText(serverName).allInnerTexts())[0].split(/\r?\n/);

    expect(response[0]).toEqual(serverName);
    expect(response[1]).toEqual(serverId);
    expect(response[2]).toEqual(serverUrl);
  };
}
