import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { searchOrgs, searchOrgMembers } from 'core/api/orgs';
import { logger } from '@percona/platform-core';
import { useUserInfo } from './useUserInfo';

export const useUserRole = (orgId?: string): [string, boolean] => {
  const [role, setRole] = useState('');
  const [pending, setPending] = useState(false);
  const [user] = useUserInfo();
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    const getInfo = async() => {
      let id = orgId;

      try {
        setPending(true);
        if (!id) {
          const { data: orgData } = await searchOrgs();
  
          if (orgData.orgs && orgData.orgs.length) {
            // We are assuming one org per user, as for now
            id = orgData.orgs[0].id;
          }
        }

        if (id) {
          const { data: memberData } = await searchOrgMembers(id!, user.email);
          const [ { role: orgRole } ] = memberData.members || [{}];
    
          setRole(orgRole);
        }

      } catch (e) {
        logger.error(e);
      } finally {
        setPending(false);
      }
    };

    if (user.email) {
      getInfo();
    }
  }, [oktaAuth, user.email, orgId]);

  return [role, pending];
};
