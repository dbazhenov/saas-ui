import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class FreeKubernetes extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  // Containers

  // Elements
  pmmWithDBaaS = this.page.getByTestId('install-pmm-with-dbaas');
  operatorsDocumentation = this.page.getByTestId('operators-documentation');

  // Messages
  pmmWithDBaaSTitle = 'DBaaS - Percona Monitoring and Management';
  operatorsDocumentationTitle = 'Percona Kubernetes Operators';

  // Links
  pmmWithDBaaSLink = 'https://docs.percona.com/percona-monitoring-and-management/using/dbaas.html';
  operatorsDocumentationLink = 'https://www.percona.com/software/percona-kubernetes-operators#install';
}
