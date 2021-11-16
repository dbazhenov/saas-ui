export const searchOrgs = () => Promise.resolve({
  data: {
    orgs: [{
      id: 'org1',
      name: 'Org One',
      created_at: '',
      updated_at: '',
    }],
  },
});

export const searchOrgMembers = () => Promise.resolve({
  data: {
    members: [{
      member_id: 'test',
      username: 'email@test.mail.com',
      first_name: 'FirstName',
      last_name: 'LastName',
      role: 'Admin',
      status: 'active',
    }],
  },
});
