import pmmApiHelper, { pmmAddress } from './helpers/pmmApiHelper';

export const pmmAPI = {
  async connectToPortal(serverName: string, token: string) {
    await pmmApiHelper.post({
      path: '/v1/Platform/Connect',
      data: {
        server_name: serverName,
        personal_access_token: token,
      },
    });
  },

  async changePublicAddress(address?: string) {
    await pmmApiHelper.post({
      path: '/v1/Settings/Change',
      data: {
        pmm_public_address: address || pmmAddress.replace(/(^\w+:|^)\/\//, ''),
      },
    });
  },

  async serverInfo() {
    const response = await pmmApiHelper.post({
      path: '/v1/Platform/ServerInfo',
      data: {},
    });

    return response;
  },
};
