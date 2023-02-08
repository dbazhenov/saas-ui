import { Page } from '@playwright/test';
import { CommonPage } from '@pages/common.page';
import { ActivityLogTable } from '@tests/components/ActivityLog/ActivityLogTable';

export default class ActivityLogPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  activityLogTable = new ActivityLogTable(this.page);

  elements = {};

  fields = {};

  labels = {};

  buttons = {};

  messages = {};

  links = {};
}
