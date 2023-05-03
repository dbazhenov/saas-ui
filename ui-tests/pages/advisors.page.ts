import { Page } from '@playwright/test';
import ModalWindow from '@tests/components/modalWindow';
import { CommonPage } from './common.page';

export class AdvisorsPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  modal = new ModalWindow(this.page);

  elements = {
    ...super.getCommonPageElements(),
    advancedAdvisorsAccordions: this.page.locator(
      '//div[@data-testid="advanced-advisors-details"]//div[contains(@class, "MuiAccordion-root")]',
    ),
  };

  fields = {};

  labels = {
    moreInfo: 'More Info',
  };

  buttons = {
    start: this.page.getByTestId('welcome-modal-start-button'),
    securityAdvisors: this.page.getByTestId('security-advisors-tab'),
    configurationAdvisors: this.page.getByTestId('configuration-advisors-tab'),
    queryAdvisors: this.page.getByTestId('query-advisors-tab'),
    performanceAdvisors: this.page.getByTestId('performance-advisors-tab'),
    advancedAdvisors: this.page.getByTestId('show-advanced-advisors-btn'),
    contactSales: this.page.getByText('Contact Sales'),
    moreInfo: this.page.getByTestId('welcome-more-info-button'),
  };

  messages = {
    welcome: 'Welcome to Advisors',
    welcomeBody:
      'Percona Advisors help you keep your databases up-to-date, secured, and running at peak performance. Advisors watch your databases 24/7 and provide automated insights and recommendations within Percona Monitoring and Management.',
  };

  links = {
    contactSales: 'https://www.percona.com/software/percona-platform/subscription',
  };
}
