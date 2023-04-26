import React, { FC } from 'react';
import { useStyles } from 'core/utils';
import { WarningAlert } from 'components/AlertCards/WarningAlert';
import { Messages } from '../Advisors.messages';
import { getStyles } from './JoinOrganization.styles';

export const JoinOrganization: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.joinOrg}>
      <div className={styles.wrapper}>
        <WarningAlert
          title={Messages.joinOrgTitle}
          description={Messages.joinOrgDesc}
          linkTitle={Messages.manageAccount}
        />
      </div>
    </div>
  );
};
