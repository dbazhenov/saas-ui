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
    getOrganization: '/v1/orgs',
    createOrganization: '/v1/orgs',
    getUserOganizations: '/v1/orgs:search',
    getUserCompany: '/v1/orgs/company:search',
    editMember: (orgId: string, memberId: string) => `/v1/orgs/${orgId}/members/${memberId}`,
    deleteMember: (orgId: string, memberId: string) => `/v1/orgs/${orgId}/members/${memberId}`,
    inviteMember: (orgId: string) => `/v1/orgs/${orgId}/members`,
    searchOrgMember: (orgId: string) => `/v1/orgs/${orgId}/members:search`,
    searchOrgTickets: (orgId: string) => `/v1/orgs/${orgId}/tickets:search`,
    searchOrgEntitlements: (id: string) => `/v1/orgs/${id}/entitlements:search`,
  },
};
