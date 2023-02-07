import React, { useCallback } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { logger } from 'core/logger';
import { Link } from 'react-router-dom';
import { Typography, Icon } from '@mui/material';
import { ReactComponent as PerconaPortalLogo } from 'assets/percona-portal-logo.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { OktaSignInWidget } from 'components/OktaSignInWidget';
import { authConfig } from 'core';
import { useStyles } from 'core/utils';
import { getStyles } from './Auth.styles';
import { Messages } from './Auth.messages';

export const Auth = () => {
  const styles = useStyles(getStyles);
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = useCallback(
    (tokens) => {
      oktaAuth.handleLoginRedirect(tokens);
    },
    [oktaAuth],
  );
  const onError = useCallback((err) => {
    logger.error(err);
  }, []);

  if (!authState) {
    return null;
  }

  return (
    <main data-testid="auth-page-container" className={styles.container}>
      <div data-testid="auth-page-left-side-wrapper" className={styles.leftSide}>
        <Link to="/" data-testid="auth-page-logo" className={styles.logo}>
          <PerconaPortalLogo />
        </Link>
        <div data-testid="auth-page-title" className={styles.texts}>
          <Typography variant="h5">{Messages.title}</Typography>
          <ul>
            {Messages.accessTo.map((point) => (
              <li key={point.name}>
                <span className={styles.leftLi}>
                  <Icon>
                    <CheckCircleIcon fontSize="small" className={styles.bulletPoint} />
                  </Icon>
                </span>
                <Typography variant="h6" className={styles.bulletPointText}>
                  {point.name}
                  {point.description}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div data-testid="auth-page-okta-sign-in-widget-wrapper" className={styles.auth}>
        <OktaSignInWidget config={authConfig} onSuccess={onSuccess} onError={onError} />
      </div>
    </main>
  );
};
