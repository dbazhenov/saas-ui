/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { CommonPage } from '@tests/pages/common.page';
import IPage from '@tests/pages/page.interface';

export default class ModalWindow extends CommonPage implements IPage {
  constructor(page: Page) {
    super(page);
  }
  messages = {};
  elements = {
    body: this.page.locator('//div[@data-testid="modal-body"]'),
    header: this.page.locator('//div[@data-testid="modal-header"]'),
    content: this.page.locator('//div[@data-testid="modal-content"]'),
  };
  fields = {};
  buttons = {
    close: this.page.locator('//button[@data-testid="modal-close-button"]'),
  };
}
