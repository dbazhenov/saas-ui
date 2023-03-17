import { configureStore } from '@reduxjs/toolkit';
import { loadState } from 'store/persistence/engine';
import { kubernetesApi } from 'pages/K8sClusterCreation/K8sClusterCreation.service';
import { authApi } from 'core/api/auth.service';
import { eventsApi } from 'core/api/events.service';
import { membersListApi } from 'pages/ManageOrganization/MembersList/MembersList.service';
import { rootReducer } from './reducers';

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      membersListApi.middleware,
      kubernetesApi.middleware,
      eventsApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, router: RouterState, theme: ThemeState}
export type AppDispatch = typeof store.dispatch;
