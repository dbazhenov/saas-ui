import React, { FC, useCallback } from 'react';
import { OktaSignInWidget } from 'components/OktaSignInWidget';
import { Typography } from '@mui/material';
import { authConfig } from 'core';
import { useStyles } from 'core/utils';
import { useOktaAuth } from '@okta/okta-react';
import logoImg from 'assets/percona-platform-logo.svg';
import { logger } from 'core/logger';
import bulletPoint from 'assets/bullet-point-arrow.svg';
import { getStyles } from './Login.styles';
import { Messages } from './Login.messages';

export const LoginPage: FC = () => {
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
    <main data-testid="login-page-container" className={styles.container}>
      <div data-testid="login-page-left-side-wrapper" className={styles.leftSide}>
        <div data-testid="login-page-logo" className={styles.logo}>
          <img src={logoImg} alt={Messages.logoAlt} />
        </div>
        <div data-testid="login-page-title" className={styles.texts}>
          <Typography variant="h2">{Messages.title}</Typography>
          <Typography variant="h3">{Messages.subtitle}</Typography>
          <ul>
            {Messages.accessTo.map((point) => (
              <li key={point.name}>
                <span className={styles.leftLi}>
                  <img src={bulletPoint} width={30} height={30} alt={Messages.bulletArrow} />
                </span>
                <span>
                  <strong>{point.name}</strong>
                  {point.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div data-testid="login-page-okta-sign-in-widget-wrapper" className={styles.auth}>
        <OktaSignInWidget config={authConfig} onSuccess={onSuccess} onError={onError} />
      </div>
    </main>
  );
};
