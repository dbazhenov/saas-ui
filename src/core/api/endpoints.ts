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
    searchOrgMember: (id: string) => `/v1/orgs/${id}/members:search`,
  },
};
