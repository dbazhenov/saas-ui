/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import { getRandomMailosaurEmailAddress } from '@tests/api/helpers';
import ModalWindow from './modalWindow';

export default class InviteMembers extends ModalWindow {
  readonly page: Page;

  readonly inviteMemberButton: Locator;
  readonly inviteMemberModal: Locator;
  readonly inviteMemberSubmitButton: Locator;
  readonly inviteMemberAddRow: Locator;

  readonly memberSuccessfullyInvited: string;
  readonly inviteMembersLimit: string;
  readonly errorInviteMessage: string;
  readonly alreadyMemberMessage: string;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.inviteMemberButton = page.locator('//button[@data-testid="invite-member-button"]');
    this.inviteMemberModal = page.locator('//div[@data-testid="modal-body"]');
    this.inviteMemberSubmitButton = page.locator('//button[@data-testid="invite-member-submit-button"]');
    this.inviteMemberAddRow = page.locator('//button[@data-testid="invite-member-add-user"]');

    this.memberSuccessfullyInvited = '1 user successfully invited to join your organization';
    this.inviteMembersLimit = 'You can invite up to 10 users at once.';
    this.errorInviteMessage = 'Error occurred during invite process.';
    this.alreadyMemberMessage = 'User is already a member of this organization.';
  }

  getUsernameLocator = (position: number = 0): Locator =>
    this.page.locator(`//input[@name="invitedUsers[${position}].username"]`);

  getUsernameErrorLocator = (position: number = 0): Locator =>
    this.page.locator(`//div[@data-testid="invitedUsers[${position}].username-field-error-message"]`);

  getRoleLocator = (position: number = 0): Locator =>
    this.page.locator(`//div[@data-testid="role-input-container-${position}"]`);

  selectMemberRole = async (role: UserRoles, index: number) => {
    await this.getRoleLocator(index).click();
    await this.page.locator(`//span[contains(text(),'${role}')]`).click();
  };

  inviteMember = async (userEmail: string, role: UserRoles = UserRoles.admin) => {
    await this.inviteMemberButton.click();
    await this.getUsernameLocator(0).type(userEmail);
    await this.selectMemberRole(role, 0);
    await this.inviteMemberSubmitButton.click();
  };

  inviteMembers = async (users: { email: string; role: UserRoles }[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const [index, user] of users.entries()) {
      if (index > 0) {
        await this.inviteMemberAddRow.click();
      }

      await this.getUsernameLocator(index).waitFor({ state: 'visible' });
      await this.getUsernameLocator(index).type(user.email);
      await this.selectMemberRole(UserRoles.admin, index);
    }

    await this.inviteMemberSubmitButton.click();
  };

  getRandomUserEmailsWithRoles = async (amount: number) => {
    const usersRoles: { email; role }[] = [];
    const userRoles = Object.values(UserRoles);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < amount; i++) {
      usersRoles.push({
        email: getRandomMailosaurEmailAddress(),
        role: userRoles[Math.floor(Math.random() * userRoles.length)],
      });
    }

    return usersRoles;
  };

  verifySuccessfullyInvitedMessage = async (amount: number) => {
    this.toast.checkToastMessage(`${amount} users successfully invited to join your organization`);
  };
}
