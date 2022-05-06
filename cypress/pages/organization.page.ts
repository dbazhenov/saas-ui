import { openMembersTab, verifyOrganizationTab } from './helpers/organizationPage.helper';

export const organizationPage = {
  constants: {
    labels: {
      orgNamePlaceholder: 'Your organization name',
      orgNameLabel: 'Organization Name',
      creationDateLabel: 'Creation Date',
      membersTabLabel: 'Members',
      organizationTabLabel: 'Organization',
      requiredField: 'Required field',
      inviteEmailSubject: 'Welcome to Percona Platform!',
    },
    userRoles: {
      admin: 'Admin',
      technical: 'Technical',
    },
    messages: {
      customerOrgFound: 'We found your organization on Percona Customer Portal and used it',
      orgCreatedSuccessfully: 'Your organization has been created.',
      orgEditedSuccessfully: 'Your organization has been updated.',
      /* prettier-ignore */
      memberEditedSuccessfully: 'The user\'s role has been successfully updated',
      memberDeletedSuccessfully: 'The user has been successfully removed from the organization',
      userSuccessfullyInvited: 'The user has been successfully invited',
      userAlreadyMemberOfOrg: 'User is already a member of this organization.',
      userAlreadyMemberOfAnotherOrg: 'User is already a member of another organization.',
    },
  },
  locators: {
    inviteMemberButton: 'invite-member-button',
    inviteMemberSubmitButton: 'invite-member-submit-button',
    editMemberIcon: 'member-actions-edit',
    deleteMemberIcon: 'member-actions-delete',
    ediMemberSubmitButton: 'edit-member-submit-button',
    deleteMemberSubmitButton: 'delete-member-submit-button',
    deleteMemberModalContent: 'modal-content',
    editOrgButton: 'member-actions-edit',
    editOrgSubmitButton: 'edit-organization-submit-button',
    manageOrgTab: 'manage-organization-tab',
    orgTableRow: 'table-tbody-tr',
    organizationContainer: 'manage-organization-tab-content',
    orgNameInput: 'organizationName-text-input',
    orgNameInputError: 'organizationName-field-error-message',
    createOrgForm: 'create-organization-form',
    createOrgSubmitButton: 'create-organization-submit-button',
    inviteMemberModal: {
      emailInput: 'email-text-input',
      submitButton: 'invite-member-submit-button',
    },
    userNotActivated: 'user-not-activated',
    modalEmailInput: 'email-text-input',
  },
  methods: {
    openMembersTab: () => openMembersTab(),
    verifyOrganizationTab: () => verifyOrganizationTab(),
  },
};
