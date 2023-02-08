import { portalAPIHelper } from '@api/helpers';
import InviteUserToOrg from '@support/types/inviteUser.interface';
import { UserRoles } from '@tests/support/enums/userRoles';
import faker from 'faker';

export interface Inventory {
  pmmServerId?: string;
  pmmServerName?: string;
  pmmServerUrl?: string;
  pmmServerOauthCallbackUrl?: string;
}

export const portalAPI = {
  async getUserAccessToken(username: string, password: string) {
    const response = await portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: '/v1/auth/SignIn',
      data: {
        email: username,
        password,
      },
    });

    return response.access_token;
  },

  async createOrg(accessToken: string, orgName = 'Test Organization') {
    return portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: '/v1/orgs',
      accessToken,
      data: { name: orgName },
    });
  },

  async getOrg(accessToken: string) {
    return portalAPIHelper.post({ accessToken, baseURL: this.portalUrl, path: '/v1/orgs:search' });
  },

  async getOrgDetails(accessToken: string, orgId: string) {
    return portalAPIHelper.get({ accessToken, baseURL: this.portalUrl, path: `/v1/orgs/${orgId}` });
  },

  async getOrgTickets(accessToken: string, orgId: string) {
    return portalAPIHelper.post({
      accessToken,
      baseURL: this.portalUrl,
      path: `/v1/orgs/${orgId}/tickets:search`,
    });
  },

  async inviteOrgMember(accessToken: string, orgId: string, member: InviteUserToOrg) {
    return portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: `/v1/orgs/${orgId}/members`,
      accessToken,
      data: member,
    });
  },

  async inviteUserToOrg(accessToken: string, orgId: string, username: string, role: UserRoles) {
    return portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: `/v1/orgs/${orgId}/members`,
      accessToken,
      data: { username, role },
    });
  },

  async deleteOrg(accessToken: string, orgId: string) {
    return portalAPIHelper.delete({
      baseURL: this.portalUrl,
      path: `/v1/orgs/${orgId}`,
      accessToken,
      data: {},
    });
  },

  async deleteUserOrgIfExists(user: User) {
    const accessToken = await this.getUserAccessToken(user.email, user.password);
    const org = await this.getOrg(accessToken);

    if (org.orgs.length) {
      await this.deleteOrg(accessToken, org.orgs[0].id);
    }
  },

  async connectInventory(accessToken: string, params: Inventory = {}) {
    const newInventory: Inventory = {
      pmmServerId: params.pmmServerId ? params.pmmServerId : this.getRandomPmmServerId(),
      pmmServerName: params.pmmServerName ? params.pmmServerName : `Test PMM Server ${Date.now()}`,
      pmmServerUrl: params.pmmServerUrl ? params.pmmServerUrl : 'https://127.0.0.1/graph',
      pmmServerOauthCallbackUrl: params.pmmServerOauthCallbackUrl
        ? params.pmmServerOauthCallbackUrl
        : 'https://portal-dev.percona.com/login/callback',
    };

    const response = await portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: '/v1/orgs/inventory:connect',
      accessToken,
      data: newInventory,
    });

    return response;
  },

  getRandomPmmServerId() {
    return faker.datatype.uuid();
  },

  async disconnectInventory(accessToken: string, pmmServerId: string) {
    await portalAPIHelper.post({
      baseURL: this.portalUrl,
      path: `v1/orgs/inventory/${pmmServerId}:disconnect`,
      accessToken,
      data: {},
    });
  },
};
