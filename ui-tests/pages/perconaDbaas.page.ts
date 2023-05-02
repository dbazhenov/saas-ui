import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class PerconaDBaaS extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  elements = {};

  fields = {};

  labels = {
    pmmWithDBaaSTitle: 'DBaaS - Percona Monitoring and Management',
    operatorsDocumentationTitle: 'Percona Kubernetes Operators - Percona',
  };

  buttons = {
    readMore: this.page.getByTestId('read-more-link'),
    start: this.page.getByTestId('welcome-modal-start-button'),
    operatorsDocumentation: this.page.getByTestId('operators-documentation'),
  };

  messages = {};

  links = {
    readMore: 'https://docs.percona.com/percona-monitoring-and-management/get-started/dbaas.html',
    operatorsDocumentation: 'https://www.percona.com/software/percona-kubernetes-operators#install',
  };
}
