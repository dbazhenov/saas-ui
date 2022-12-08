import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Routes } from 'core/routes';
import { getCurrentTheme } from 'store/theme';
import lightLogo from 'assets/404-light.svg';
import darkLogo from 'assets/404-dark.svg';
import { useStyles } from 'core/utils';
import { Messages } from './NotFound.messages';
import { getStyles } from './NotFound.styles';

export const NotFound: FC = () => {
  const { isDark } = useSelector(getCurrentTheme);
  const styles = useStyles(getStyles);
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className={styles.contentWrapper} data-testid="not-found-container">
      <img data-testid="404-image" className={styles.logo} alt="404" src={logo} />
      <Link className={styles.link} to={Routes.root}>
        <Button variant="contained" data-testid="404-home-button" className={styles.homeButton}>
          {Messages.homepage}
        </Button>
      </Link>
    </div>
  );
};
