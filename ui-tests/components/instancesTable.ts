import { Page, expect } from '@playwright/test';
import { Table } from './Table';

export default class InstancesTable extends Table {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    removePmm: (serverName: string) => this.rowByText(serverName).getByTestId('pmm-instance-actions-remove'),
  };

  fields = {};

  labels = {
    serverName: 'Server Name',
    serverId: 'Server ID',
    serverUrl: 'Server URL',
    actions: 'Actions',
  };

  buttons = {};

  messages = {};

  links = {};

  verifyInstanceInTable = async (serverName: string, serverId: string, serverUrl: string) => {
    const response = (await this.rowByText(serverName).allInnerTexts())[0].split(/\r?\n/);

    expect(response[0]).toEqual(serverName);
    expect(response[1]).toEqual(serverId);
    expect(response[2]).toEqual(serverUrl);
  };
}
