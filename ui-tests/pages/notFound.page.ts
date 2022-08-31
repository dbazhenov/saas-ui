// data-testid="not-found-container"
import { Locator, Page } from '@playwright/test';
import { CommonPage } from './common.page';

interface Messages {}

interface Labels {}

interface Links {}

interface Locators {
  notFoundPageContainer: Locator;
  notFoundImage: Locator;
  notFoundHomeButton: Locator;
}

export class NotFoundPage extends CommonPage {
  readonly page: Page;

  readonly messages: Messages;

  readonly labels: Labels;

  readonly links: Links;

  readonly locators: Locators;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.messages = {};

    this.labels = {};

    this.links = {};

    this.locators = {
      notFoundPageContainer: page.locator('//div[@data-testid="not-found-container"]'),
      notFoundImage: page.locator('//img[@data-testid="404-image"]'),
      notFoundHomeButton: page.locator('//button[@data-testid="404-home-button"]'),
    };
  }
}
