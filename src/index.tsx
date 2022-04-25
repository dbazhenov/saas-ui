import React from 'react';
import ReactDOM from 'react-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { css } from 'emotion';
import { Security } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { ThemeContext } from '@grafana/ui';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Main } from 'components';
import { store } from 'store';
import { getCurrentTheme } from 'store/theme';
import { history, oktaAuth } from 'core';
import { ENVIRONMENT, SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE } from 'core/constants';

import 'react-toastify/dist/ReactToastify.min.css';
import './styles/global.css';
/**
 * NOTE: @grafana/ui does not seem to import font-awesome icons, so no easy
 * way to get faSpinner icon rendered other than to import fontawesome :|
 */
import './styles/font-awesome.css';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing()],
  environment: ENVIRONMENT,

  // This is meant to capture 100% for dev and a much lower rate for prod
  tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
});

const onAuthRequired = () => {
  history.push('/login');
};

const restoreOriginalUri = async (_: any, originalUri: string) => {
  if (!originalUri) {
    history.push('/');

    return;
  }

  history.replace(toRelativeUrl(originalUri || '', window.location.origin));
};

const App = () => {
  const theme = useSelector(getCurrentTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <ConnectedRouter context={ReactReduxContext} history={history}>
        <Security oktaAuth={oktaAuth} onAuthRequired={onAuthRequired} restoreOriginalUri={restoreOriginalUri}>
          <Main />
        </Security>
      </ConnectedRouter>
      <ToastContainer
        bodyClassName={css`
          padding: 0.5em;
        `}
        position={toast.POSITION.TOP_RIGHT}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        transition={Slide}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} context={ReactReduxContext}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// expose store during tests
if (window.Cypress) {
  window.store = store;
}
