/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { CommonPage } from '@tests/pages/common.page';

interface ModalWindowInterface {
  readonly modalBody: Locator;
  readonly closeModalButton: Locator;
}
export default class ModalWindow extends CommonPage {
  readonly page: Page;
  readonly modalWindow: ModalWindowInterface;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.modalWindow = {
      modalBody: page.locator('//div[@data-testid="modal-body"]'),
      closeModalButton: page.locator('//button[@data-testid="modal-close-button"]'),
    };
  }
}
