import { Messages } from './Contacts.messages';

export const getAccountType = (isCustomer: boolean, successManager: boolean, loading: boolean): string => {
  if (loading) {
    return '';
  }

  return isCustomer || successManager ? Messages.customerAccount : Messages.freeAccount;
};
