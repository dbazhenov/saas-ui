import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { oktaAuth } from 'core';
import { Messages } from 'core/api';
import { loadState } from 'store/persistence/engine';
import { errorUserInfoAction, getAuth, startUserInfoAction, updateUserInfoAction } from './auth';
import { rootReducer } from './reducers';

const preloadedState = loadState();

/**
 * This middleware makes sure to call userInfo and wait until it completes to persist the user data.
 * This way we respect DRY in API calls, which otherwise would have to implement this behavior.
 */
export const authMiddleware = (store: any) => (next: any) => (action: AnyAction) => {
  const token = oktaAuth.getAccessToken();

  // We should only call .getUser when the user is authenticated, or it will fail
  if (!token || action.type?.startsWith('@@')) {
    return next(action);
  }

  const auth = getAuth(store.getState());

  if (!auth.pending && !auth.email) {
    return Promise.resolve()
      .then(() => next(startUserInfoAction()))
      .then(() => oktaAuth.getUser())
      .then(({ email, family_name: lastName, given_name: firstName }) =>
        next(updateUserInfoAction({ email, firstName, lastName })),
      )
      .catch((err) => {
        toast.error(Messages.genericAPIFailure);
        console.error(err);
        next(errorUserInfoAction());
      })
      .finally(() => next(action));
  }

  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(authMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, router: RouterState, theme: ThemeState}
export type AppDispatch = typeof store.dispatch;
