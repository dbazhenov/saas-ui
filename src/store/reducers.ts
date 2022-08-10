import { connectRouter } from 'connected-react-router';
import { history } from 'core/history';
import { authReducer } from 'store/auth/auth.reducer';
import { themeReducer } from 'store/theme/theme.reducer';
import { orgsReducer } from 'store/orgs/orgs.reducer';
import { kubernetesApi } from 'pages/K8sClusterCreation/K8sClusterCreation.service';

export const rootReducer = {
  [kubernetesApi.reducerPath]: kubernetesApi.reducer,
  auth: authReducer,
  router: connectRouter(history),
  theme: themeReducer,
  orgs: orgsReducer,
};
