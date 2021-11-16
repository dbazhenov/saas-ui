import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { PrivateLayout } from 'components/Layouts';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';

export const DashboardPage: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <PrivateLayout>
      <div className={styles.container}>
        <Contacts />
      </div>
    </PrivateLayout>
  );
};
