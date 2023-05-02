import React, { FC } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { ThemeContext } from '@grafana/ui';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, ReactReduxContext } from 'react-redux';
import { getTheme } from '@percona/platform-core';
import { history as defaultHistory } from 'core/history';
import { authApi } from 'core/api/auth.service';
import { membersListApi } from 'pages/ManageOrganization/MembersList/MembersList.service';
import { advisorsApi } from 'pages/Advisors/Advisors.service';
import { eventsApi } from 'core/api/events.service';
import { rootReducer } from 'store/reducers';
import { AppState } from 'store/types';
import { DeepPartial } from 'core';
import { dbaasApi } from 'pages/DBaaS/DBaaSClusterCreation.service';

const light = getTheme('light');

export const store = (preloadedState?: AppState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState || undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        membersListApi.middleware,
        dbaasApi.middleware,
        eventsApi.middleware,
        advisorsApi.middleware,
      ),
  });

interface TestContainerProps {
  preloadedState?: DeepPartial<AppState>;
  history?: History;
}

export const TestContainer: FC<TestContainerProps> = ({ children, preloadedState, history }) => (
  <React.StrictMode>
    <ThemeContext.Provider value={light}>
      <Provider store={store(preloadedState as AppState)} context={ReactReduxContext}>
        <ConnectedRouter history={history ?? defaultHistory} context={ReactReduxContext}>
          {children}
        </ConnectedRouter>
      </Provider>
    </ThemeContext.Provider>
  </React.StrictMode>
);
