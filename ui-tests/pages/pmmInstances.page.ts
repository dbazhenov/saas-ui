import { Page } from '@playwright/test';
import InstancesTable from '@tests/components/instancesTable';
import ModalWindow from '@tests/components/modalWindow';
import { CommonPage } from './common.page';

export default class PMMInstances extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  instancesTable = new InstancesTable(this.page);

  elements = {
    tableContainer: this.page.locator('//div[@data-testid="instances-list-wrapper"]'),
    header: this.page.locator('//header[@data-testid="manage-pmm-instances-header"]'),
    readMore: this.page.locator('//a[@data-testid="connect-pmm-link"]'),
    serverUrl: (address: string) =>
      this.page.locator(`//*[@data-testid="pmm-instance-link" and contains(text(), "${address}")]`),
    modal: new ModalWindow(this.page),
  };

  fields = {};

  labels = {
    readMore: 'Connect your PMM server - Percona Platform',
    removePmmHeader: 'Remove PMM Instance',
  };

  buttons = {
    cancelRemovePmm: this.page.getByTestId('remove-instance-cancel-button'),
    submitRemovePmm: this.page.getByTestId('remove-instance-submit-button'),
  };

  messages = {
    readMore: 'How-to connect Percona Monitoring & Management',
    removePmmBody: (serverName: string) =>
      `Are you sure you want to remove the instance '${serverName}'? \
      This will delete the record from the list without disconnecting from PMM. \
      If your PMM is still accessible, we recommend to perform disconnect via PMM Settings.`,
  };

  links = {
    readMore: 'https://docs.percona.com/percona-platform/connect-pmm.html',
  };
}
