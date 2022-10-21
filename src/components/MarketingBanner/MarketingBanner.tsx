import React, { FC, useCallback, useEffect, useState } from 'react';
import { useStyles } from '@grafana/ui';
import { useOktaAuth } from '@okta/okta-react';
import { useSelector } from 'react-redux';
import { getAuth } from 'store/auth';
import { displayAndLogError } from 'core';
import { LoaderButton } from '@percona/platform-core';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { getStyles } from './MarketingBanner.styles';
import { Messages } from './MarketingBanner.messages';
import { useEditProfileMutation } from '../../core/api/auth.service';

export const MarketingBanner: FC = ({ children }) => {
  const styles = useStyles(getStyles);
  const { oktaAuth } = useOktaAuth();
  const [show, setShow] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { firstName, lastName } = useSelector(getAuth);
  const [editProfile, { status, isLoading, error }] = useEditProfileMutation();

  useEffect(() => {
    const getMarketing = async () => {
      const { marketing } = await oktaAuth.getUser();

      if (marketing === undefined) {
        setShow(true);
      }
    };

    getMarketing();
  }, [oktaAuth]);

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
          <LoaderButton
            data-testid="accept-marketing"
            type="submit"
            loading={acceptLoading}
            disabled={isLoading}
            className={styles.firstButton}
            onClick={() => handleSubmit(true)}
          >
            {Messages.yes}
          </LoaderButton>
          <LoaderButton
            variant="secondary"
            data-testid="reject-marketing"
            type="submit"
            loading={rejectLoading}
            disabled={isLoading}
            onClick={() => handleSubmit(false)}
          >
            {Messages.no}
          </LoaderButton>
        </div>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};
