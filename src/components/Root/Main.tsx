import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import { PublicRoute, SecureRoute } from 'components';
import {
  Auth,
  DashboardPage,
  LandingPage,
  ManageOrganizationPage,
  ManagePmmInstancesPage,
  K8sClusterCreationPage,
  NotFound,
  ProfilePage,
} from 'pages';
import { Routes } from 'core/routes';
import Activation from 'pages/Activation/Activation';

export const Main: FC = () => (
  <Switch>
    <Route path={Routes.loginCallback} component={LoginCallback} />
    <Route exact path={Routes.activation} component={Activation} />
    <PublicRoute exact path={[Routes.login, Routes.signup]}>
      <Auth />
    </PublicRoute>
    <PublicRoute exact path={Routes.root}>
      <LandingPage />
    </PublicRoute>
    <SecureRoute exact path={Routes.home}>
      <DashboardPage />
    </SecureRoute>
    <SecureRoute exact path={Routes.profile}>
      <ProfilePage />
    </SecureRoute>
    <SecureRoute exact path={Routes.organization}>
      <ManageOrganizationPage />
    </SecureRoute>
    <SecureRoute exact path={Routes.instances}>
      <ManagePmmInstancesPage />
    </SecureRoute>
    <SecureRoute exact path={Routes.kubernetes}>
      <K8sClusterCreationPage />
    </SecureRoute>
    <SecureRoute path="*">
      <NotFound />
    </SecureRoute>
  </Switch>
);
