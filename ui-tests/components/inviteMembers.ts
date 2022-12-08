/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { UserRoles } from '@support/enums/userRoles';
import { getRandomMailosaurEmailAddress } from '@tests/api/helpers';
import ModalWindow from './modalWindow';

export default class InviteMembers extends ModalWindow {
  constructor(page: Page) {
    super(page);
  }

  inviteMemberButton = this.page.locator('//button[@data-testid="invite-member-button"]');
  inviteMemberModal = this.page.locator('//div[@data-testid="modal-body"]');
  inviteMemberSubmitButton = this.page.locator('//button[@data-testid="invite-member-submit-button"]');
  inviteMemberAddRow = this.page.locator('//button[@data-testid="invite-member-add-user"]');
  userRow = (position: number) => this.page.locator(`//div[@data-testid="user-row-index-${position}"]`);
  roleSelect = (position: number) => this.userRow(position).locator('//div[@data-testid="role-select"]');
  username = (position: number) => this.userRow(position).locator('//input[@data-testid="username-input"]');
  usernameError = (position: number) => this.userRow(position).locator('//p[@id="username-error"]');
  technicalRole = this.page.locator('//li[@data-value="Technical"]');
  adminRole = this.page.locator('//li[@data-value="Admin"]');
  cancelButton = this.page.locator('//button[@data-testid="cancel-invite-user"]');

  memberSuccessfullyInvited = '1 user successfully invited to join your organization';
  inviteMembersLimit = 'You can invite up to 10 users at once.';
  errorInviteMessage = 'Error occurred during invite process.';
  alreadyMemberMessage = 'This user was already invited to the organization';

  selectMemberRole = async (role: UserRoles, index: number) => {
    await this.roleSelect(index).click();
    if (role === UserRoles.admin) {
      this.adminRole.click();
    } else {
      this.technicalRole.click();
    }
  };

  inviteMember = async (userEmail: string, role: UserRoles = UserRoles.admin) => {
    await this.inviteMemberButton.click();
    await this.username(0).fill(userEmail);
    await this.selectMemberRole(role, 0);
    await this.inviteMemberSubmitButton.click();
  };

  inviteMembers = async (users: { email: string; role: UserRoles }[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const [index, user] of users.entries()) {
      if (index > 0) {
        await this.inviteMemberAddRow.click();
      }

      await this.username(index).waitFor({ state: 'visible' });
      await this.username(index).type(user.email);
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
