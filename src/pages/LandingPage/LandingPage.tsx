import React, { FC } from 'react';
import { useStyles } from 'core/utils';
import { ReactComponent as PerconaLogo } from 'assets/percona-logo-color.svg';
import { ReactComponent as PerconaPortalLogo } from 'assets/percona-portal-logo.svg';
import { ReactComponent as PerconaAccountInfo } from 'assets/percona-account-info.svg';
import { ReactComponent as Bell } from 'assets/bell.svg';
import { ReactComponent as Database } from 'assets/database.svg';
import { ReactComponent as Book } from 'assets/book.svg';
import { ReactComponent as Checklist } from 'assets/checklist.svg';
import { Button, Typography } from '@mui/material';
import { Routes } from 'core/routes';
import { Messages } from './LandingPage.messages';
import { getStyles } from './LandingPage.styles';
import { USPCard } from './USPCard';
import { FooterMenuItem } from './FooterMenuItem';
import {
  DEMO_LINK,
  COPYRIGHT_LINK,
  LEGAL_LINK,
  PRIVACY_LINK,
  SECURITY_LINK,
  TOS_LINK,
} from './LandingPage.constants';

export const LandingPage: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <main data-testid="landing-page-container" className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <PerconaLogo data-testid="landing-page-logo" className={styles.platformLogo} />
            <Typography data-testid="landing-page-title" variant="h4" className={styles.title}>
              {Messages.title}
            </Typography>
            <Typography data-testid="landing-page-description" variant="h6">
              {Messages.description}
            </Typography>
            <div data-testid="landing-page-main-ctas" className={styles.ctas}>
              <Button
                href={Routes.signup}
                size="large"
                variant="contained"
                color="secondary"
                data-testid="create-account"
              >
                {Messages.createAccount}
              </Button>
              <span className={styles.loginButtonWrapper}>
                <Button
                  href={Routes.login}
                  size="large"
                  color="inherit"
                  variant="outlined"
                  className={styles.loginButton}
                  data-testid="login-button"
                >
                  {Messages.login}
                </Button>
              </span>
            </div>
          </div>
          <PerconaPortalLogo className={styles.portalLogo} />
        </div>
      </header>
      <section className={styles.mainContent}>
        <Typography variant="h4">{Messages.mainSectionTitle}</Typography>
        <div className={styles.cards}>
          <USPCard title={Messages.advisorsTitle} text={Messages.advisorsText} icon={Bell} />
          <USPCard title={Messages.dbaasTitle} text={Messages.dbaasText} icon={Database} />
          <USPCard title={Messages.knowledgeBaseTitle} text={Messages.knowledgeBaseText} icon={Book} />
          <USPCard title={Messages.ticketsTitle} text={Messages.ticketsText} icon={Checklist} />
        </div>
        <div className={styles.mainSectionCtaWrapper}>
          <Button href={Routes.signup} variant="contained" size="large" data-testid="create-percona-account">
            {Messages.createAccount}
          </Button>
        </div>
        <div data-testid="landing-page-get-demo" className={styles.demo}>
          <div className={styles.demoDescriptionWrapper}>
            <Typography variant="h5" className={styles.demoTitle}>
              {Messages.demoTitle}
            </Typography>
            <p>{Messages.demoDescription}</p>
            <Button
              href={DEMO_LINK}
              target="_blank"
              variant="outlined"
              size="large"
              className={styles.demoCta}
              data-testid="get-demo"
            >
              {Messages.getDemo}
            </Button>
          </div>
          <PerconaAccountInfo className={styles.perconaAccountInfo} />
        </div>
      </section>
      <footer data-testid="landing-page-footer" className={styles.footer}>
        <div className={styles.footerContent}>
          <nav>
            <ul>
              <li>
                <FooterMenuItem href={TOS_LINK}>{Messages.tos}</FooterMenuItem>
              </li>
              <li>
                <FooterMenuItem href={PRIVACY_LINK}>{Messages.privacy}</FooterMenuItem>
              </li>
              <li>
                <FooterMenuItem href={COPYRIGHT_LINK}>{Messages.copyright}</FooterMenuItem>
              </li>
              <li>
                <FooterMenuItem href={LEGAL_LINK}>{Messages.legal}</FooterMenuItem>
              </li>
              <li>
                <FooterMenuItem href={SECURITY_LINK}>{Messages.security}</FooterMenuItem>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
};
