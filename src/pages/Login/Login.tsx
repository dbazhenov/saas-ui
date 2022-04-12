import React, { FC, useCallback } from 'react';
import { useStyles } from '@grafana/ui';
import { OktaSignInWidget } from 'components/OktaSignInWidget';
import { authConfig } from 'core';
import { useOktaAuth } from '@okta/okta-react';
import logoImg from 'assets/percona-platform-logo.svg';
import { logger } from '@percona/platform-core';
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
    <main className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <img src={logoImg} alt={Messages.logoAlt} />
        </div>
        <div className={styles.texts}>
          <h2>{Messages.title}</h2>
          <h3>{Messages.subtitle}</h3>
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
      <div className={styles.auth}>
        <OktaSignInWidget config={authConfig} onSuccess={onSuccess} onError={onError} />
      </div>
    </main>
  );
};
