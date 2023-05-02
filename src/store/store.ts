import { configureStore } from '@reduxjs/toolkit';
import { loadState } from 'store/persistence/engine';
import { advisorsApi } from 'pages/Advisors/Advisors.service';
import { authApi } from 'core/api/auth.service';
import { eventsApi } from 'core/api/events.service';
import { membersListApi } from 'pages/ManageOrganization/MembersList/MembersList.service';
import { rootReducer } from './reducers';
import { dbaasApi } from '../pages/DBaaS/DBaaSClusterCreation.service';

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      membersListApi.middleware,
      dbaasApi.middleware,
      eventsApi.middleware,
      advisorsApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, router: RouterState, theme: ThemeState}
export type AppDispatch = typeof store.dispatch;
