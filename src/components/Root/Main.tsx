import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { PublicRoute } from 'components';
import { LoginPage, ProfilePage, UIDemo, NotFound, GettingStartedPage, ManageOrganizationPage, DashboardPage } from 'pages';
import { Routes } from 'core/routes';

export const Main: FC = () => (
  <Switch>
    <Route path={Routes.loginCallback} component={LoginCallback} />
    <SecureRoute exact path={Routes.root}>
      <GettingStartedPage />
    </SecureRoute>
    <PublicRoute exact path={Routes.login}>
      <LoginPage />
    </PublicRoute>
    <SecureRoute exact path={Routes.profile}>
      <ProfilePage />
    </SecureRoute>
    <SecureRoute exact path={Routes.organization}>
      <ManageOrganizationPage />
    </SecureRoute>
    <SecureRoute exact path={Routes.dashboard}>
      <DashboardPage />
    </SecureRoute>
    <PublicRoute path={Routes.ui}>
      <UIDemo />
    </PublicRoute>
    <SecureRoute>
      <NotFound />
    </SecureRoute>
  </Switch>
);
