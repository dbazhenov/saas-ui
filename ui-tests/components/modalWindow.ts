/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { CommonPage } from '@tests/pages/common.page';

export default class ModalWindow extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  private dialog = this.page.getByRole('dialog');

  elements = {
    modalContent: this.dialog.getByTestId('modal-content'),
    modalHeader: this.dialog.getByTestId('modal-header'),
  };

  // Elements
  body = this.page.locator('//div[@data-testid="modal-body"]');
  header = this.page.locator('//h2[@data-testid="modal-header"]');
  content = this.page.locator('//div[@data-testid="modal-content"]');
  closeButton = this.page.locator('//button[@data-testid="modal-close-button"]');
}
