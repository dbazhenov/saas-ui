import { Messages } from './Contacts.messages';

export const getAccountType = (isCustomer: boolean, successManager: boolean, loading: boolean) => {
  if (loading) {
    return '';
  }

  return isCustomer || successManager ? Messages.customerAccount : Messages.freeAccount;
};
