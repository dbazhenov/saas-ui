/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { OrganizationPage } from '@pages/organization.page';
import InviteMembers from '../components/inviteMembers';

export class MembersPage extends OrganizationPage {
  readonly page: Page;

  readonly membersTable: Locator;
  readonly membersTableBody: Locator;
  readonly membersTableRow: Locator;
  readonly membersTableCell: Locator;
  readonly membersTableEditUser: Locator;
  readonly membersTableDeleteUser: Locator;
  readonly confirmDeleteUser: Locator;
  readonly inviteMembers: InviteMembers;

  readonly memberDeletedSuccessfully: string;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.membersTable = page.locator('//table[@data-testid="table"]');
    this.membersTableBody = page.locator('//tbody[@data-testid="table-tbody"]');
    this.membersTableRow = page.locator('//tr[@data-testid="table-tbody-tr"]');
    this.membersTableCell = this.membersTableRow.locator('//td');
    this.membersTableEditUser = page.locator('//button[@data-testid="member-actions-edit"]');
    this.membersTableDeleteUser = page.locator('//button[@data-testid="member-actions-delete"]');
    this.confirmDeleteUser = page.locator('//button[@data-testid="delete-member-submit-button"]');

    this.memberDeletedSuccessfully = 'The user has been successfully removed from the organization';
    this.inviteMembers = new InviteMembers(page);
  }

  verifyMembersTable = async (expectedUsers: { Name: string; Email: string; Role: string }[]) => {
    const allUsers = await this.page.$$eval(
      this.membersTableRow.toString().replace('Locator@', ''),
      (users) =>
        users.map((user) => ({
          Name: user.querySelector('td:nth-child(1)')!.textContent!,
          Email: user.querySelector('td:nth-child(2)')!.textContent!,
          Role: user.querySelector('td:nth-child(3)')!.textContent!,
        })),
    );

    expectedUsers.forEach((user) => {
      expect(allUsers).toContainEqual(user);
    });
  };

  verifyMembersTableUserButtons = async (name: string, enabled: boolean = true) => {
    const editButtonSelector = this.membersTableEditUser.toString().replace('Locator@', '');
    const deleteButtonSelector = this.membersTableDeleteUser.toString().replace('Locator@', '');
    let editButtonStatus: boolean;
    let deleteButtonStatus: boolean;

    const editButton = await this.page.locator(
      `//*[contains(text(),'${name}')]//ancestor::tr${editButtonSelector}`,
    );
    const deleteButton = await this.page.locator(
      `//*[contains(text(),'${name}')]//ancestor::tr${deleteButtonSelector}`,
    );

    if (enabled) {
      editButtonStatus = await editButton.isEnabled();
      deleteButtonStatus = await deleteButton.isEnabled();
    } else {
      editButtonStatus = await editButton.isDisabled();
      deleteButtonStatus = await deleteButton.isDisabled();
    }

    expect(editButtonStatus).toBeTruthy();
    expect(deleteButtonStatus).toBeTruthy();
  };

  deleteUserMembersTabByEmail = async (email: string) => {
    const deleteButtonSelector = this.membersTableDeleteUser.toString().replace('Locator@', '');

    await this.page.locator(`//*[contains(text(),"${email}")]//ancestor::tr${deleteButtonSelector}`).click();
    await this.confirmDeleteUser.click();
    await this.toast.checkToastMessage(this.memberDeletedSuccessfully);
    await expect(this.page.locator(`//*[contains(text(),"${email}")]//ancestor::tr`)).toHaveCount(0);
  };

  verifyUserMembersTable = async (user: User, role: UserRoles) => {
    const userDetail = await this.page
      .locator(`//*[contains(text(),'${user.email}')]//ancestor::tr`)
      .textContent();

    expect(userDetail).toContain(`${user.firstName} ${user.lastName}`);
    expect(userDetail).toContain(user.email);
    expect(userDetail).toContain(role);
  };
}
