/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';

interface MainMenu {
  dashboard: Locator;
  organization: Locator;
  pmmInstances: Locator;
}

interface ResourceMenu {
  documentationLink: Locator;
  blogLink: Locator;
  forumLink: Locator;
  portalHelpLink: Locator;
}

export default class SideMenu {
  readonly page: Page;

  readonly mainHeader: Locator;
  readonly navigationLink: Locator;
  readonly resourcesHeader: Locator;
  readonly resourceLink: Locator;

  readonly mainMenu: MainMenu;
  readonly resourceMenu: ResourceMenu;

  readonly blogLink: string;
  readonly documentationLink: string;
  readonly forumLink: string;
  readonly portalHelpLink: string;

  readonly resourcesLabel: string;
  readonly mainLabel: string;

  constructor(page: Page) {
    this.page = page;

    this.mainHeader = page.locator('//header[@data-testid="main-header"]');
    this.navigationLink = page.locator('//a[@data-testid="nav-link"]');
    this.resourcesHeader = page.locator('//header[@data-testid="resources-header"]');
    this.resourceLink = page.locator('//a[@data-testid="resource-link"]');

    this.mainMenu = {
      dashboard: this.navigationLink.locator('//div[contains(text(), "Dashboard")]/parent::*'),
      organization: this.navigationLink.locator('//div[contains(text(), "Organization")]/parent::*'),
      pmmInstances: this.navigationLink.locator('//div[contains(text(), "PMM Instances")]/parent::*'),
    };

    this.resourceMenu = {
      documentationLink: this.resourceLink.locator('//div[contains(text(), "Documentation")]/parent::*'),
      blogLink: this.resourceLink.locator('//div[contains(text(), "Blogs")]/parent::*'),
      forumLink: this.resourceLink.locator('//div[contains(text(), "Forum")]/parent::*'),
      portalHelpLink: this.resourceLink.locator('//div[contains(text(), "Portal Help")]/parent::*'),
    };

    this.documentationLink = 'https://www.percona.com/software/documentation';
    this.blogLink = 'https://www.percona.com/blog/';
    this.forumLink = 'https://forums.percona.com/';
    this.portalHelpLink = 'https://docs.percona.com/percona-platform/index.html';

    this.resourcesLabel = 'Resources';
    this.mainLabel = 'Main';
  }
}
