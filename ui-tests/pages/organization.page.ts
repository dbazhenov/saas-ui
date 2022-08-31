/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import { CommonPage } from './common.page';

interface Locators {
  readonly membersTab: Locator;
  readonly manageOrganizationContainer: Locator;
  readonly editOrgButton: Locator;
  readonly editOrgSubmit: Locator;
  readonly editMemberSubmit: Locator;
  readonly organizationName: Locator;
  readonly organizationNameInput: Locator;
  readonly organizationNameInputError: Locator;
  readonly createOrgButton: Locator;
}

interface Labels {
  readonly orgNamePlaceholder: string;
}

interface Messages {
  readonly orgCreatedSuccessfully: string;
  readonly orgEditedSuccessfully: string;
  readonly memberEditedSuccessfully: string;
  readonly requiredField: string;
}

export class OrganizationPage extends CommonPage {
  readonly page: Page;
  readonly locators: Locators;
  readonly labels: Labels;
  readonly messages: Messages;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.locators = {
      membersTab: page.locator('li', { hasText: 'Members' }),
      manageOrganizationContainer: page.locator('//div[@data-testid="manage-organization-organization-tab"]'),
      editOrgButton: page.locator('//button[@data-testid="member-actions-edit"]'),
      editOrgSubmit: page.locator('//button[@data-testid="edit-organization-submit-button"]'),
      editMemberSubmit: page.locator('//button[@data-testid="edit-member-submit-button"]'),
      organizationName: page.locator('//strong[@data-testid="organization-name"]'),
      organizationNameInput: page.locator('//input[@data-testid="organizationName-text-input"]'),
      organizationNameInputError: page.locator('//*[@data-testid="organizationName-field-error-message"]'),
      createOrgButton: page.locator('//button[@data-testid="create-organization-submit-button"]'),
    };
    this.labels = {
      orgNamePlaceholder: 'Your organization name',
    };

    this.messages = {
      orgCreatedSuccessfully: 'Your organization has been created.',
      orgEditedSuccessfully: 'Your organization has been updated.',
      memberEditedSuccessfully: "The user's role has been successfully updated",
      requiredField: 'Required field',
    };
  }

  getMembersTableRow(userEmail: string): Locator {
    return this.page.locator('tr', { has: this.page.locator('td', { hasText: userEmail }) });
  }

  getMembersTableEditButton(userEmail: string): Locator {
    return this.getMembersTableRow(userEmail).locator('//button[@data-testid="member-actions-edit"]');
  }

  async isMemberTableEditButtonDisabled(userEmail: string, isDisabled: boolean = true) {
    if (isDisabled) {
      await this.getMembersTableEditButton(userEmail).isDisabled();
    } else {
      await this.getMembersTableEditButton(userEmail).isEnabled();
    }
  }

  getMembersTabledeleteButton(userEmail: string): Locator {
    return this.page.locator(
      `//td[@text="${userEmail}"]/parent//button[@data-testid="member-actions-delete"]`,
    );
  }

  async verifyMembersTableUserRole(userEmail: string, role: UserRoles) {
    const cellText = await this.getMembersTableRow(userEmail).innerText();

    expect(cellText.includes(role)).toBeTruthy();
  }

  async selectMemberRole(oldRole: UserRoles, newRole: UserRoles) {
    await this.page.locator(`//*[@data-testid="edit-member-form"]//div[.="${oldRole}"]`).first().click();
    await this.page.locator(`//*[@data-testid="edit-member-form"]//div[.="${newRole}"]`).first().click();
  }

  async changeMemberRoleAndVerify(email: string, oldRole: UserRoles, newRole: UserRoles) {
    await this.isMemberTableEditButtonDisabled(email, false);
    await this.getMembersTableEditButton(email).click();
    await this.selectMemberRole(oldRole, newRole);
    await this.locators.editMemberSubmit.click();
    await this.toast.checkToastMessage(this.messages.memberEditedSuccessfully);
    await this.page.waitForTimeout(2000); // Due to bug SAAS-873, should be removed when bug is fixed.
    await this.verifyMembersTableUserRole(email, newRole);
  }
}
