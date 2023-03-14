import React, { FC, useCallback, useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useSelector } from 'react-redux';
import { getAuth } from 'store/auth';
import { displayAndLogError, useStyles } from 'core';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { LoadingButton } from '@mui/lab';
import { UserClaims } from '@okta/okta-auth-js';
import { getStyles } from './MarketingBanner.styles';
import { Messages } from './MarketingBanner.messages';
import { useEditProfileMutation } from '../../core/api/auth.service';

interface MarketingBannerProps {
  userInfo?: UserClaims;
  children: React.ReactNode;
}

export const MarketingBanner: FC<MarketingBannerProps> = ({ children, userInfo }) => {
  const styles = useStyles(getStyles);
  const { oktaAuth } = useOktaAuth();
  const [show, setShow] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { firstName, lastName } = useSelector(getAuth);
  const [editProfile, { status, isLoading, error }] = useEditProfileMutation();

  useEffect(() => {
    if (userInfo?.email && userInfo?.marketing === undefined) {
      setShow(true);
    }
  }, [userInfo, oktaAuth]);

  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      setShow(false);
      setAcceptLoading(false);
      setRejectLoading(false);
    }

    if (error) {
      displayAndLogError(error);
      setAcceptLoading(false);
      setRejectLoading(false);
    }
  }, [status, error]);

  const handleSubmit = useCallback(
    (accept: boolean) => {
      if (accept) {
        setAcceptLoading(true);
      } else {
        setRejectLoading(true);
      }

      if (!firstName || !lastName) {
        return;
      }

      editProfile({ firstName, lastName, marketing: accept });
    },
    [editProfile, firstName, lastName],
  );

  return show ? (
    <div className={styles.pageWrapper}>
      {children}
      <div className={styles.banner} data-testid="marketing-banner">
        <p className={styles.title} data-testid="marketing-banner-title">
          {Messages.title}
        </p>
        <p className={styles.description} data-testid="marketing-banner-description">
          {Messages.description}
        </p>
        <div className={styles.buttonsWrapper}>
          <LoadingButton
            variant="contained"
            data-testid="accept-marketing"
            type="submit"
            loading={acceptLoading}
            disabled={isLoading}
            className={styles.firstButton}
            onClick={() => handleSubmit(true)}
          >
            {Messages.yes}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            data-testid="reject-marketing"
            type="submit"
            loading={rejectLoading}
            disabled={isLoading}
            onClick={() => handleSubmit(false)}
          >
            {Messages.no}
          </LoadingButton>
        </div>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};
