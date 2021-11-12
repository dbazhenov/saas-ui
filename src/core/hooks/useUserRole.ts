import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { searchOrgMembers } from 'core/api/orgs';
import { useUserInfo } from './useUserInfo';

export const useUserRole = (orgId?: string) => {
  const [role, setRole] = useState('');
  const [user] = useUserInfo();
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    const getInfo = async() => {
      const { data: memberData } = await searchOrgMembers(orgId!, user.email);
      const [ { role: orgRole } ] = memberData.members || [{}];

      setRole(orgRole);
    };

    if (user.email && orgId) {
      getInfo();
    }
  }, [oktaAuth, user.email, orgId]);

  return [role];
};
