import { portalAPIHelper } from '@api/helpers';
import InviteUserToOrg from '@support/types/inviteUser.interface';

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
  async deleteOrg(accessToken: string, orgId: string) {
    return portalAPIHelper.delete({
      baseURL: this.portalUrl,
      path: `/v1/orgs/${orgId}`,
      accessToken,
      data: {},
    });
  },
};
