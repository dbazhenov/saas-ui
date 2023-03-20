import { expect, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import InviteMembers from './inviteMembers';
import { Table } from './table';
import Toast from './toast';

export class MembersTable extends Table {
  constructor(page: Page) {
    super(page);
  }

  inviteMembers = new InviteMembers(this.page);

  elements = {
    ...super.getTableElements(),
    membersRow: (userEmail: string) => this.page.locator(`// div[@data-id="${userEmail}"]`),
  };

  fields = {
    ...super.getTableFields(),
    roleSelect: this.page.getByTestId('role-select'),
    memberRole: (role: UserRoles) =>
      this.page.locator(`//li[@role="option" and contains(text(), '${role}')]`),
  };

  labels = {
    ...super.getTableLabels(),
  };

  buttons = {
    ...super.getTableButtons(),
    editUser: (userEmail: string) => this.elements.membersRow(userEmail).getByTestId('member-actions-edit'),
    deleteUser: (userEmail: string) =>
      this.elements.membersRow(userEmail).getByTestId('member-actions-delete'),
    confirmDeleteUser: this.page.getByTestId('delete-member-submit-button'),
    resendEmail: (userEmail: string) => this.elements.rowByText(userEmail).getByTestId('resend-email-link'),
    editMemberSubmit: this.page.getByTestId('edit-member-submit-button'),
  };

  messages = {
    ...super.getTableMessages(),
    memberDeletedSuccessfully: 'The user has been successfully removed from the organization',
    memberEditedSuccessfully: "The user's role has been successfully updated",
  };

  links = {
    ...super.getTableLinks(),
  };

  verifyMembersTable = async (expectedUsers) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const user of expectedUsers) {
      const userEmail = this.elements.membersRow(user.Email);

      await expect(userEmail.locator('//div[@role="cell"]').nth(0)).toHaveText(user.Name);
      await expect(userEmail.locator('//div[@role="cell"]').nth(1)).toHaveText(user.Email);
      await expect(userEmail.locator('//div[@role="cell"]').nth(2)).toHaveText(user.Role);
    }
  };

  deleteUserByEmail = async (email: string) => {
    const toast = new Toast(this.page);

    await this.buttons.deleteUser(email).click();
    await this.buttons.confirmDeleteUser.click();
    await toast.checkToastMessage(this.messages.memberDeletedSuccessfully);
    await expect(this.elements.membersRow(email)).toHaveCount(0);
  };

  verifyUserMembersTable = async (user: User, role: UserRoles) => {
    const userDetail = await this.elements.membersRow(user.email).textContent();

    expect(userDetail).toContain(`${user.firstName} ${user.lastName}`);
    expect(userDetail).toContain(user.email);
    expect(userDetail).toContain(role);
  };

  verifyUserNotPresent = async (userEmail: string) => {
    await expect(this.elements.membersRow(userEmail)).toBeHidden();
  };

  async isEditButtonDisabled(userEmail: string, isDisabled: boolean = true) {
    if (isDisabled) {
      await this.buttons.editUser(userEmail).isDisabled();
    } else {
      await this.buttons.editUser(userEmail).isEnabled();
    }
  }

  async isDeleteButtonDisabled(userEmail: string, isDisabled: boolean = true) {
    if (isDisabled) {
      await this.buttons.deleteUser(userEmail).isDisabled();
    } else {
      await this.buttons.deleteUser(userEmail).isEnabled();
    }
  }

  async changeMemberRoleAndVerify(email: string, oldRole: UserRoles, newRole: UserRoles) {
    const toast = new Toast(this.page);

    await this.isEditButtonDisabled(email, false);
    await this.buttons.editUser(email).click();
    await this.selectMemberRole(oldRole, newRole);
    await this.buttons.editMemberSubmit.click();
    await toast.checkToastMessage(this.messages.memberEditedSuccessfully);
    await this.page.waitForTimeout(2000); // Due to bug SAAS-873, should be removed when bug is fixed.
    await this.verifyMembersTableUserRole(email, newRole);
  }

  async selectMemberRole(oldRole: UserRoles, newRole: UserRoles) {
    await this.fields.roleSelect.click();
    await this.fields.memberRole(newRole).click();
  }

  async verifyMembersTableUserRole(userEmail: string, role: UserRoles) {
    const cellText = await this.elements.membersRow(userEmail).innerText();

    expect(cellText.includes(role)).toBeTruthy();
  }
}
