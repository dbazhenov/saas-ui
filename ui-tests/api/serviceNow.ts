import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import { serviceNowRequest } from '@api/helpers';

export const serviceNowAPI = {
  async createServiceNowCredentials(): Promise<ServiceNowResponse> {
    const response = await serviceNowRequest();

    return {
      account: response.data.result.account,
      contacts: {
        admin1: response.data.result.contacts.find((contact) => contact.email.startsWith('ui_tests_admin-')),
        admin2: response.data.result.contacts.find((contact) => contact.email.startsWith('ui_tests_admin2-')),
        technical: response.data.result.contacts.find((contact) =>
          contact.email.startsWith('ui_tests_technical-'),
        ),
      },
    };
  },
};
