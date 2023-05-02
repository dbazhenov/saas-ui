/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';

export default class SideMenu {
  constructor(readonly page: Page) {}

  // Components
  menu = this.page.locator('//div[@data-testid="side-menu"]');

  mainMenu = {
    dashboard: this.menu.locator('//span[contains(text(), "Dashboard")]/ancestor::div[@role="button"]'),
    organization: this.menu.locator('//span[contains(text(), "Organization")]/ancestor::div[@role="button"]'),
    pmmInstances: this.menu.locator(
      '//span[contains(text(), "PMM Instances")]/ancestor::div[@role="button"]',
    ),
    dbaas: this.menu.locator('//span[contains(text(), "PMM Demo")]/ancestor::div[@role="button"]'),
  };

  resourceMenu = {
    documentationLink: this.menu.locator('//span[contains(text(), "Documentation")]/ancestor::a'),
    blogLink: this.menu.locator('//span[contains(text(), "Blogs")]/ancestor::a'),
    forumLink: this.menu.locator('//span[contains(text(), "Forum")]/ancestor::a'),
    portalHelpLink: this.menu.locator('//span[contains(text(), "Portal Help")]/ancestor::a'),
  };

  // Links
  documentationLink = 'https://www.percona.com/software/documentation';
  blogLink = 'https://www.percona.com/blog/';
  forumLink = 'https://forums.percona.com/';
  portalHelpLink = 'https://docs.percona.com/percona-platform/index.html';
}
