import React, { FC, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeContext, useStyles } from '@grafana/ui';
import { Dropdown, Icons } from '@percona/platform-core';
import { useOktaAuth } from '@okta/okta-react';
import { Routes } from 'core/routes';
import { getCurrentTheme, themeChangeRequestAction } from 'store/theme';
import { history } from 'core/history';
import { ReactComponent as Profile } from 'assets/profile.svg';
import logo from 'assets/percona-logo.svg';
import { RequestError } from 'core/api/types';
import { authLogoutAction } from '../../store/auth';
import { getStyles } from './MenuBar.styles';
import { Messages } from './MenuBar.messages';
import { DropdownToggleProps } from './MenuBar.types';

const { ThemeDark, ThemeLight } = Icons;

export const MenuBar: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const { authState, oktaAuth } = useOktaAuth();
  const currentTheme = useSelector(getCurrentTheme);

  const goToProfilePage = () => {
    history.replace(Routes.profile);
  };

  const logout = useCallback(async () => {
    dispatch(authLogoutAction.request());
    try {
      await oktaAuth.signOut({ revokeAccessToken: true, revokeRefreshToken: true });
      dispatch(authLogoutAction.success());
    } catch (e) {
      dispatch(authLogoutAction.failure(e as RequestError));
    }
  }, [oktaAuth, dispatch]);

  const changeTheme = useCallback(() => {
    dispatch(themeChangeRequestAction(currentTheme));
  }, [currentTheme, dispatch]);

  const DropdownToggle = forwardRef<HTMLDivElement, DropdownToggleProps>((props, ref) => (
    <div ref={ref} {...props} data-testid="menu-bar-profile-dropdown-toggle" className={styles.menuIcon}>
      <Profile width={22} height={22}/>
    </div>
  ));

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <section className={styles.menuBar} data-testid="menu-bar">
          <div className={styles.leftSide} data-testid="menu-bar-left-side">
            <nav>
              <ul>
                <li>
                  <Link to={Routes.root} data-testid="menu-bar-home-link" className={styles.link}>
                    <img className={styles.perconaLogo} src={logo} alt={Messages.logoAlt} data-testid="menu-bar-percona-logo" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.rightSide} data-testid="menu-bar-right-side">
            <nav>
              <ul>
                <li>
                  <div className={styles.menuIcon} onMouseUp={changeTheme}>
                    {theme.isLight && <ThemeDark width={22} height={22} />}
                    {theme.isDark && <ThemeLight width={22} height={22} />}
                  </div>
                </li>
                {authState?.isAuthenticated && (
                  <li>
                    <Dropdown toggle={DropdownToggle}>
                      <span data-testid="menu-bar-profile-dropdown-profile" onClick={goToProfilePage}>
                        {Messages.profile}
                      </span>
                      <span data-testid="menu-bar-profile-dropdown-logout" onClick={logout}>
                        {Messages.logout}
                      </span>
                    </Dropdown>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </section>
      )}
    </ThemeContext.Consumer>
  );
};
