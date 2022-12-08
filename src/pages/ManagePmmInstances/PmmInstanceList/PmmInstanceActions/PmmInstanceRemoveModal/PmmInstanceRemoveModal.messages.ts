export const Messages = {
  cancel: 'Cancel',
  confirm: 'Confirm',
  removeInstance: (instanceName: string) =>
    `Are you sure you want to remove the instance '${instanceName}'?
 This will delete the record from the list without disconnecting from PMM.
 If your PMM is still accessible, we recommend to perform disconnect via PMM Settings."`,
  removeInstanceTitle: 'Remove PMM Instance',
};
