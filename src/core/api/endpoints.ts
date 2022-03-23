export const ENDPOINTS = {
  Auth: {
    GetProfile: '/v1/auth/GetProfile',
    RefreshSession: '/v1/auth/RefreshSession',
    ResetPassword: '/v1/auth/ResetPassword',
    SignIn: '/v1/auth/SignIn',
    SignOut: '/v1/auth/SignOut',
    SignUp: '/v1/auth/SignUp',
    UpdateProfile: '/v1/auth/UpdateProfile',
  },
  Org: {
    createOrganization: '/v1/orgs',
    getOrganization: (orgId: string) => `/v1/orgs/${orgId}`,
    editOrganization: (orgId: string) => `/v1/orgs/${orgId}`,
    getServiceNowOrganization: '/v1/orgs',
    getUserOganizations: '/v1/orgs:search',
    getUserCompany: '/v1/orgs/company:search',
    editMember: (orgId: string, memberId: string) => `/v1/orgs/${orgId}/members/${memberId}`,
    removeMember: (orgId: string, memberId: string) => `/v1/orgs/${orgId}/members/${memberId}`,
    inviteMember: (orgId: string) => `/v1/orgs/${orgId}/members`,
    searchOrgMember: (orgId: string) => `/v1/orgs/${orgId}/members:search`,
    searchOrgTickets: (orgId: string) => `/v1/orgs/${orgId}/tickets:search`,
    searchOrgEntitlements: (orgId: string) => `/v1/orgs/${orgId}/entitlements:search`,
    searchOrgInventory: (orgId: string) => `/v1/orgs/${orgId}/inventory:search`,
  },
};
