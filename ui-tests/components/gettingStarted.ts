/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';

export default class GettingStarted {
  readonly page: Page;

  readonly createOrgLabel: string;
  readonly connectPMMLabel: string;
  readonly viewOrganization: string;

  readonly gettingStartedContainer: Locator;
  readonly gettingStartedOrganizationSection: Locator;
  readonly gettingStartedPMMSection: Locator;
  readonly doneImageOrgSection: Locator;
  readonly incompleteImageOrgSection: Locator;
  readonly doneImage: Locator;
  readonly incompleteImage: Locator;
  readonly doneImageOrganizationSection: Locator;
  readonly doneImagePMMSection: Locator;
  readonly incompleteImageOrganizationSection: Locator;
  readonly incompleteImagePMMSection: Locator;
  readonly gettingStartedOrganizationLink: Locator;
  readonly gettingStartedPMMLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createOrgLabel = '1. Create your Organization';
    this.connectPMMLabel = '2. Connect Percona Monitoring & Management';
    this.viewOrganization = 'View Organization';

    this.gettingStartedContainer = page.locator('//div[@data-testid="getting-started-container"]');
    this.gettingStartedOrganizationSection = this.getGettingStartedSectionLocator(this.createOrgLabel);
    this.gettingStartedPMMSection = this.getGettingStartedSectionLocator(this.connectPMMLabel);
    this.doneImage = page.locator('//img[@alt="Done"]');
    this.incompleteImage = page.locator('//img[@alt="Done"]');
    this.doneImageOrganizationSection = this.gettingStartedOrganizationSection.locator('//img[@alt="Done"]');
    this.doneImagePMMSection = this.gettingStartedPMMSection.locator('//img[@alt="Done"]');
    this.incompleteImageOrganizationSection =
      this.gettingStartedOrganizationSection.locator('//img[@alt="Incomplete"]');
    this.incompleteImagePMMSection = this.gettingStartedPMMSection.locator('//img[@alt="Incomplete"]');
    this.gettingStartedOrganizationLink = this.gettingStartedOrganizationSection.locator(
      '//a[@data-testid="getting-started-section-link"]',
    );
    this.gettingStartedPMMLink = this.gettingStartedPMMSection.locator(
      '//a[@data-testid="getting-started-section-link"]',
    );
  }

  private getGettingStartedSectionLocator = (label: string): Locator =>
    this.page.locator(
      `//h2[contains(text(), "${label}")]//ancestor::*[@data-testid="getting-started-section"]`,
    );
}
