import { connectRouter } from 'connected-react-router';
import { history } from 'core/history';
import { authReducer } from 'store/auth/auth.reducer';
import { themeReducer } from 'store/theme/theme.reducer';
import { orgsReducer } from 'store/orgs/orgs.reducer';
import { advisorsApi } from 'pages/Advisors/Advisors.service';
import { authApi } from 'core/api/auth.service';
import { membersListApi } from 'pages/ManageOrganization/MembersList/MembersList.service';
import { eventsApi } from 'core/api/events.service';
import { dbaasApi } from '../pages/DBaaS/DBaaSClusterCreation.service';

export const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [membersListApi.reducerPath]: membersListApi.reducer,
  [dbaasApi.reducerPath]: dbaasApi.reducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
  [advisorsApi.reducerPath]: advisorsApi.reducer,
  auth: authReducer,
  router: connectRouter(history),
  theme: themeReducer,
  orgs: orgsReducer,
};
