import { connectRouter } from 'connected-react-router';
import { history } from 'core/history';
import { authReducer } from 'store/auth/auth.reducer';
import { themeReducer } from 'store/theme/theme.reducer';
import { orgsReducer } from 'store/orgs/orgs.reducer';
import { authApi } from 'components/MarketingBanner/MarketingBanner.service';

export const rootReducer = {
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
  router: connectRouter(history),
  theme: themeReducer,
  orgs: orgsReducer,
};
