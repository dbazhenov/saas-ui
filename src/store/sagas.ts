import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { authSagas } from './auth/auth.sagas';
import { orgsSagas } from './orgs/orgs.sagas';
import { persistenceSagas } from './persistence/persistence.sagas';
import { themeSagas } from './theme/theme.sagas';

export function* rootSaga() {
  yield all([
    authSagas(),
    orgsSagas(),
    persistenceSagas(),
    themeSagas(),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
