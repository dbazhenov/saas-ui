import { openMembersTab, verifyOrganizationTab } from './helpers/organizationPage.helper';

export const organizationPage = {
  constants: {
    labels: {
      orgNamePlaceholder: 'Your organization name',
      orgNameLabel: 'Organization Name',
      creationDateLabel: 'Creation Date',
      membersTabLabel: 'Members',
      organizationTabLabel: 'Organization',
    },
    messages: {
      customerOrgFound: 'We found your organization on Percona Customer Portal and used it',
      orgCreatedSuccessfully: 'Your organization has been created.',
      memberEditedSuccessfully: 'The user\'s role has been successfully updated',
      memberDeletedSuccessfully: 'The user has been successfully removed from the organization',
    },
  },
  locators: {
    editMemberIcon: 'member-actions-edit',
    deleteMemberIcon: 'member-actions-delete',
    ediMemberSubmitButton: 'edit-member-submit-button',
    deleteMemberSubmitButton: 'delete-member-submit-button',
    deleteMemberModalContent: 'modal-content',
    manageOrgTab: 'manage-organization-tab',
    orgTableRow: 'table-tbody-tr',
    createOrgNameInput: 'organizationName-text-input',
    createOrgNameInputError: 'organizationName-field-error-message',
    createOrgForm: 'create-organization-form',
    createOrgSubmitButton: 'create-organization-submit-button',
  },
  methods: {
    openMembersTab: () => openMembersTab(),
    verifyOrganizationTab: () => verifyOrganizationTab(),
  },
};
