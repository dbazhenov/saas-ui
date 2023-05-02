import React, { FC } from 'react';
import { useStyles } from 'core/utils';
import { perconaDarkTheme } from 'perconaTheme';
import { createTheme, ThemeProvider, Button, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { ReactComponent as PerconaLogo } from 'assets/percona-logo-color.svg';
import { ReactComponent as PerconaPortalLogo } from 'assets/percona-portal-logo.svg';
import { ReactComponent as PerconaAccountInfo } from 'assets/percona-account-info.svg';
import { ReactComponent as Bell } from 'assets/bell.svg';
import { ReactComponent as Database } from 'assets/database.svg';
import { ReactComponent as Book } from 'assets/book.svg';
import { ReactComponent as Checklist } from 'assets/checklist.svg';
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

const sideMenuTheme = createTheme(perconaDarkTheme);

export const LandingPage: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <main data-testid="landing-page-container" className={styles.container}>
      <ThemeProvider theme={sideMenuTheme}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div>
                <PerconaLogo data-testid="landing-page-logo" className={styles.platformLogo} />
              </div>
              <Typography data-testid="landing-page-title" variant="h4" className={styles.title}>
                {Messages.title}
              </Typography>
              <Typography data-testid="landing-page-description" variant="h6">
                {Messages.description}
              </Typography>
              <Grid data-testid="landing-page-main-ctas" className={styles.ctas} container direction="row">
                <Grid xs="auto">
                  <Button
                    href={Routes.signup}
                    size="large"
                    variant="contained"
                    color="primary"
                    data-testid="create-account"
                  >
                    {Messages.createAccount}
                  </Button>
                </Grid>
                <Grid xs={4} className={styles.loginButtonWrapper}>
                  <Button
                    href={Routes.login}
                    size="large"
                    color="primary"
                    variant="outlined"
                    className={styles.loginButton}
                    data-testid="login-button"
                  >
                    {Messages.login}
                  </Button>
                </Grid>
              </Grid>
            </div>
            <PerconaPortalLogo className={styles.portalLogo} />
          </div>
        </header>
      </ThemeProvider>
      <Grid container component="section" className={styles.mainContent}>
        <Typography variant="h4" className={styles.mainSectionTitle}>
          {Messages.mainSectionTitle}
        </Typography>
        <Grid container className={styles.cards} direction="row" spacing={{ xs: 3, lg: 0 }}>
          <Grid xs={12} sm={6} lg={3} className={styles.cardWrapper}>
            <USPCard title={Messages.advisorsTitle} text={Messages.advisorsText} icon={Bell} />
          </Grid>
          <Grid xs={12} sm={6} lg={3} className={styles.cardWrapper}>
            <USPCard title={Messages.dbaasTitle} text={Messages.dbaasText} icon={Database} />
          </Grid>
          <Grid xs={12} sm={6} lg={3} className={styles.cardWrapper}>
            <USPCard title={Messages.knowledgeBaseTitle} text={Messages.knowledgeBaseText} icon={Book} />
          </Grid>
          <Grid xs={12} sm={6} lg={3} className={styles.cardWrapper}>
            <USPCard title={Messages.ticketsTitle} text={Messages.ticketsText} icon={Checklist} />
          </Grid>
        </Grid>
        <Grid container className={styles.mainSectionCtaWrapper}>
          <Button href={Routes.signup} variant="contained" size="large" data-testid="create-percona-account">
            {Messages.createAccount}
          </Button>
        </Grid>
        <Grid
          container
          data-testid="landing-page-get-demo"
          className={styles.demo}
          spacing={{ xs: 3, lg: 0 }}
        >
          <Grid className={styles.demoDescriptionWrapper} xs={12} sm={6}>
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
          </Grid>
          <Grid xs={12} sm={5}>
            <PerconaAccountInfo className={styles.perconaAccountInfo} />
          </Grid>
        </Grid>
      </Grid>
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
