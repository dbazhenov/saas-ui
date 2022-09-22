/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { CommonPage } from '@pages/common.page';
import { UserRoles } from '@support/enums/userRoles';

export default class InviteMembers extends CommonPage {
  readonly page: Page;

  readonly inviteMemberButton: Locator;
  readonly inviteMemberModal: Locator;
  readonly inviteMemberSubmitButton: Locator;
  readonly selectRoleContainer: Locator;

  readonly memberSuccessfullyInvited: string;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.inviteMemberButton = page.locator('//button[@data-testid="invite-member-button"]');
    this.inviteMemberModal = page.locator('//div[@data-testid="modal-body"]');
    this.inviteMemberSubmitButton = page.locator('//button[@data-testid="invite-member-submit-button"]');
    this.selectRoleContainer = page.locator('//div[@data-testid="role-input-container-0"]');

    this.memberSuccessfullyInvited = '1 user successfully invited to join your organization';
  }

  getInviteMemberUsernameLocator = (position: number): Locator =>
    this.page.locator(`//input[@name="invitedUsers[${position}].username"]`);

  selectMemberRole = async (role: UserRoles) => {
    await this.selectRoleContainer.click();
    await this.page.locator(`//span[contains(text(),'${role}')]`).click();
  };

  inviteMember = async (userEmail: string, role: UserRoles = UserRoles.admin) => {
    await this.inviteMemberButton.click();
    await this.getInviteMemberUsernameLocator(0).type(userEmail);
    await this.selectMemberRole(role);
    await this.inviteMemberSubmitButton.click();
    await this.toast.checkToastMessage(this.memberSuccessfullyInvited);
  };
}
