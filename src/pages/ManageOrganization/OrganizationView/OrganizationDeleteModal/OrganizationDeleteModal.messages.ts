export const Messages = {
  cancel: 'Cancel',
  confirm: 'Confirm',
  deleteOrganization: (orgName: string) => `Are you sure you want to delete the "${orgName}" organization? 
  You will not be able to recover it later, and you will permanently lose all the data associated with it.
  This includes active users, PMM connections and available advisors.`,
  confirmDeletionTitle: 'To confirm this action, type the name of your organization below:',
  modalTitle: 'Delete Organization',
  buttonTitle: 'Delete Organization',
  warningLabel: 'Deleting an organization will permanently delete all data associated with it.',
};
