/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import InviteMembers from './inviteMembers';
import { Table } from './table';

export class MembersTable extends Table {
  readonly page: Page;

  readonly membersTableEditUser: Locator;
  readonly membersTableDeleteUser: Locator;
  readonly confirmDeleteUser: Locator;
  readonly inviteMembers: InviteMembers;
  readonly editUserByName: (s: string) => Locator;
  readonly deleteUserByName: (s: string) => Locator;
  readonly membersRow: (s: string) => Locator;

  readonly memberDeletedSuccessfully: string;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.editUserByName = (name: string) =>
      this.page
        .locator('tr', {
          has: this.page.locator('td').nth(0),
          hasText: name,
        })
        .locator('data-testid=member-actions-edit');
    this.deleteUserByName = (name: string) =>
      this.page
        .locator('tr', {
          has: this.page.locator('td').nth(0),
          hasText: name,
        })
        .locator('data-testid=member-actions-delete');
    this.membersTableEditUser = page.locator('//button[@data-testid="member-actions-edit"]');
    this.membersTableDeleteUser = page.locator('//button[@data-testid="member-actions-delete"]');
    this.confirmDeleteUser = page.locator('//button[@data-testid="delete-member-submit-button"]');
    this.membersRow = (name: string) =>
      this.page.locator('tr', {
        has: this.page.locator('td').nth(0),
        hasText: name,
      });

    this.memberDeletedSuccessfully = 'The user has been successfully removed from the organization';
    this.inviteMembers = new InviteMembers(page);
  }

  verifyMembersTable = async (expectedUsers) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const user of expectedUsers) {
      const userEmail = await this.tableRow.filter({
        has: this.page.locator('td').nth(0),
        hasText: user.Name,
      });

      await expect(userEmail.locator('td').nth(0)).toHaveText(user.Name);
      await expect(userEmail.locator('td').nth(1)).toHaveText(user.Email);
      await expect(userEmail.locator('td').nth(2)).toHaveText(user.Role);
    }
  };

  verifyMembersTableUserButtons = async (name: string, enabled: boolean = true) => {
    if (enabled) {
      await expect(this.editUserByName(name)).toBeEnabled();
      await expect(this.deleteUserByName(name)).toBeEnabled();
    } else {
      await expect(this.editUserByName(name)).toBeDisabled();
      await expect(this.deleteUserByName(name)).toBeDisabled();
    }
  };

  // TODO: Refactor to use locator like in verifyMembersTableUserButtons method
  deleteUserMembersTabByEmail = async (email: string) => {
    await this.deleteUserByName(email).click();
    await this.confirmDeleteUser.click();
    await this.toast.checkToastMessage(this.memberDeletedSuccessfully);
    await expect(this.membersRow(email)).toHaveCount(0);
    await expect(this.page.locator(`//*[contains(text(),"${email}")]//ancestor::tr`)).toHaveCount(0);
  };

  verifyUserMembersTable = async (user: User, role: UserRoles) => {
    const userDetail = await this.membersRow(user.email).textContent();

    expect(userDetail).toContain(`${user.firstName} ${user.lastName}`);
    expect(userDetail).toContain(user.email);
    expect(userDetail).toContain(role);
  };
}
