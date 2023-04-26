import { connectRouter } from 'connected-react-router';
import { history } from 'core/history';
import { authReducer } from 'store/auth/auth.reducer';
import { themeReducer } from 'store/theme/theme.reducer';
import { orgsReducer } from 'store/orgs/orgs.reducer';
import { kubernetesApi } from 'pages/K8sClusterCreation/K8sClusterCreation.service';
import { advisorsApi } from 'pages/Advisors/Advisors.service';
import { authApi } from 'core/api/auth.service';
import { membersListApi } from 'pages/ManageOrganization/MembersList/MembersList.service';
import { eventsApi } from 'core/api/events.service';

export const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [membersListApi.reducerPath]: membersListApi.reducer,
  [kubernetesApi.reducerPath]: kubernetesApi.reducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
  [advisorsApi.reducerPath]: advisorsApi.reducer,
  auth: authReducer,
  router: connectRouter(history),
  theme: themeReducer,
  orgs: orgsReducer,
};
