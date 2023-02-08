import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Card, Typography } from '@mui/material';
import { Routes } from 'core/routes';
import { getAuth, getProfileAction } from 'store/auth';
import { getPlatformAccessToken, copyToClipboard } from 'core';
import { useStyles } from 'core/utils';
import { PrivateLayout } from 'components/Layouts';
import { getStyles } from './Profile.styles';
import { Messages } from './Profile.messages';

export const ProfilePage: FC = () => {
  const dispatch = useDispatch();
  const { pending, email, firstName, lastName } = useSelector(getAuth);
  const [platformAccessToken, setPlatformAccessToken] = useState('');
  const styles = useStyles(getStyles);

  useEffect(() => {
    setPlatformAccessToken(getPlatformAccessToken());
  }, []);

  useEffect(() => {
    if (!email && !pending) {
      dispatch(getProfileAction());
    }
  }, [dispatch, email, pending]);

  const handleCopyToClipboard = useCallback(async () => {
    await copyToClipboard(platformAccessToken);
    toast.success(Messages.copySuccessful);
  }, [platformAccessToken]);

  return (
    <PrivateLayout>
      <main className={styles.wrapper}>
        <Card className={styles.card} elevation={4}>
          <div className={styles.cardContent}>
            <Typography variant="h5" data-testid="profile-details-header">
              {Messages.myProfileLabel}
            </Typography>
            <p data-testid="first-last-name">
              <span>{Messages.nameLable}</span> {firstName} {lastName}
            </p>
            <p data-testid="user-email">
              <span>{Messages.emailLabel}</span> {email}
            </p>
          </div>
          <div>
            <Button
              href={Routes.editProfile}
              variant="outlined"
              target="_blank"
              data-testid="edit-profile-button"
            >
              {Messages.editProfile}
            </Button>
          </div>
        </Card>
        <Card className={styles.card} elevation={4}>
          <div className={styles.cardContent}>
            <Typography variant="h5" data-testid="token-header">
              {Messages.platformAccessToken}
            </Typography>
            <p data-testid="token-description">{Messages.platformAccessTokenDescription}</p>
          </div>
          <div>
            <Button variant="outlined" data-testid="token-copy" onClick={handleCopyToClipboard}>
              {Messages.copyToClipboard}
            </Button>
          </div>
        </Card>
      </main>
    </PrivateLayout>
  );
};
