import React, { FC, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { useStyles } from '@grafana/ui';
import { toast } from 'react-toastify';
import { ENDPOINTS } from 'core/api';
import { getUseHttpConfig } from 'core/api/api.service';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { getStyles } from './OrganizationView.styles';
import { Messages } from './OrganizationView.messages';
import { OrganizationViewProps } from './OrganizationView.types';

const { Org } = ENDPOINTS;

export const OrganizationView: FC<OrganizationViewProps> = ({ orgId }) => {
  const styles = useStyles(getStyles);
  const [orgName, setOrgName] = useState<string>();
  const [orgCreationDate, setOrgCreationDate] = useState<string>();
  const fetchConfig = getUseHttpConfig(`${Org.getOrganization}\\${orgId}`, undefined, [orgId]);
  const { error, data = {} } = useFetch(...fetchConfig);

  useEffect(() => {
    if (error) {
      toast.error(Messages.fetchError);
    }
  }, [error]);

  useEffect(() => {
    setOrgName(data?.org?.name);
    setOrgCreationDate(new Date(data?.org?.created_at).toLocaleDateString());
  }, [data]);

  return (
    <div data-testid="create-organization-wrapper" className={styles.container}>
      <OrganizationLogo />
      <div className={styles.orgDetails}>
        {orgName && orgCreationDate && (
          <>
            <span>
              {Messages.organizationName}: <strong>{orgName}</strong>
            </span>
            <span>
             {Messages.creationDate}: <strong>{orgCreationDate}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

