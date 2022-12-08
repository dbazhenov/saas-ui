/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import InviteMembers from './inviteMembers';
import { Table } from './Table';
import Toast from './toast';

export class MembersTable extends Table {
  readonly page: Page;

  readonly editUser: (userEmail: string) => Locator;
  readonly deleteUser: (userEmail: string) => Locator;
  readonly confirmDeleteUser: Locator;
  readonly inviteMembers: InviteMembers;
  readonly membersRow: (s: string) => Locator;
  readonly resetEmailLink: (userEmail: string) => Locator;
  readonly editMemberRole: (role: UserRoles) => Locator;
  readonly editMemberSubmit: Locator;
  readonly roleSelect: Locator;

  readonly memberDeletedSuccessfully: string;
  readonly memberEditedSuccessfully: string;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.editUser = (userEmail: string) =>
      this.membersRow(userEmail).locator('//button[@data-testid="member-actions-edit"]');
    this.deleteUser = (userEmail: string) =>
      this.membersRow(userEmail).locator('//button[@data-testid="member-actions-delete"]');
    this.confirmDeleteUser = page.locator('//button[@data-testid="delete-member-submit-button"]');
    this.membersRow = (userEmail: string) => this.page.locator(`// div[@data-id="${userEmail}"]`);
    this.resetEmailLink = (userEmail) =>
      this.elements.rowByText(userEmail).locator('//div[@data-testid="resend-email-link"]');
    this.editMemberRole = (role: UserRoles) =>
      this.page.locator(`//li[@role="option" and contains(text(), '${role}')]`);
    this.editMemberSubmit = page.locator('//button[@data-testid="edit-member-submit-button"]');
    this.roleSelect = page.locator('//div[@data-testid="role-select"]');

    this.memberDeletedSuccessfully = 'The user has been successfully removed from the organization';
    this.memberEditedSuccessfully = "The user's role has been successfully updated";

    this.inviteMembers = new InviteMembers(page);
  }

  verifyMembersTable = async (expectedUsers) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const user of expectedUsers) {
      const userEmail = this.membersRow(user.Email);

      await expect(userEmail.locator('//div[@role="cell"]').nth(0)).toHaveText(user.Name);
      await expect(userEmail.locator('//div[@role="cell"]').nth(1)).toHaveText(user.Email);
      await expect(userEmail.locator('//div[@role="cell"]').nth(2)).toHaveText(user.Role);
    }
  };

  deleteUserByEmail = async (email: string) => {
    const toast = new Toast(this.page);

    await this.deleteUser(email).click();
    await this.confirmDeleteUser.click();
    await toast.checkToastMessage(this.memberDeletedSuccessfully);
    await expect(this.membersRow(email)).toHaveCount(0);
  };

  verifyUserMembersTable = async (user: User, role: UserRoles) => {
    const userDetail = await this.membersRow(user.email).textContent();

    expect(userDetail).toContain(`${user.firstName} ${user.lastName}`);
    expect(userDetail).toContain(user.email);
    expect(userDetail).toContain(role);
  };

  verifyUserNotPresent = async (userEmail: string) => {
    await expect(this.membersRow(userEmail)).toBeHidden();
  };

  async isEditButtonDisabled(userEmail: string, isDisabled: boolean = true) {
    if (isDisabled) {
      await this.editUser(userEmail).isDisabled();
    } else {
      await this.editUser(userEmail).isEnabled();
    }
  }

  async isDeleteButtonDisabled(userEmail: string, isDisabled: boolean = true) {
    if (isDisabled) {
      await this.deleteUser(userEmail).isDisabled();
    } else {
      await this.deleteUser(userEmail).isEnabled();
    }
  }

  async changeMemberRoleAndVerify(email: string, oldRole: UserRoles, newRole: UserRoles) {
    const toast = new Toast(this.page);

    await this.isEditButtonDisabled(email, false);
    await this.editUser(email).click();
    await this.selectMemberRole(oldRole, newRole);
    await this.editMemberSubmit.click();
    await toast.checkToastMessage(this.memberEditedSuccessfully);
    await this.page.waitForTimeout(2000); // Due to bug SAAS-873, should be removed when bug is fixed.
    await this.verifyMembersTableUserRole(email, newRole);
  }

  async selectMemberRole(oldRole: UserRoles, newRole: UserRoles) {
    await this.roleSelect.click();
    await this.editMemberRole(newRole).click();
  }

  async verifyMembersTableUserRole(userEmail: string, role: UserRoles) {
    const cellText = await this.membersRow(userEmail).innerText();

    expect(cellText.includes(role)).toBeTruthy();
  }
}
