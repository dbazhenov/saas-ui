import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Routes } from 'core/routes';

// A wrapper for <Route> that redirects an authenticated user to the root page if they
// try to go a public route, i.e. public routes are meant for unauthenticated sessions only.
export const PublicRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { authState } = useOktaAuth();

  return (
    authState && (
      <Route
        {...rest}
        render={({ location }) =>
          !authState.isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: Routes.home,
                state: { from: location },
              }}
            />
          )
        }
      />
    )
  );
};
