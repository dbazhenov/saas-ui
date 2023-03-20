import { Page } from '@playwright/test';
import { CommonPage } from '@pages/common.page';
import { ActivityLogTable } from '@tests/components/ActivityLog/activityLogTable';
import OrganizationTabs from '@tests/components/organizationTabs';

export default class ActivityLogPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  activityLogTable = new ActivityLogTable(this.page);
  organizationTabs = new OrganizationTabs(this.page);

  elements = {};

  fields = {};

  labels = {};

  buttons = {};

  messages = {};

  links = {};
}
