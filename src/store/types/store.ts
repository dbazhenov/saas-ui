import { GrafanaTheme } from '@grafana/data';
import { RouterState } from 'connected-react-router';
import { AuthState } from './auth';
import { OrgsState } from './orgs';

export interface AppState {
  auth: AuthState;
  router: RouterState;
  theme: GrafanaTheme;
  orgs: OrgsState;
}
