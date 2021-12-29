import {
  all, put, call, takeLatest, StrictEffect,
} from 'redux-saga/effects';
import { searchOrgInventory } from 'core/api/orgs';
import {
  SearchOrganizationInventoryResponse,
  RequestError,
} from 'core/api/types';
import { Messages } from 'core/api/messages';
import { toast } from 'react-toastify';
import { transformInventory } from './orgs.utils';
import { orgsGetInventoryAction } from './orgs.reducer';

type OrgsGetInventoryActionRequest = ReturnType<typeof orgsGetInventoryAction.request>;
type OrgsGetInventoryRequestGenerator = Generator<StrictEffect, void, SearchOrganizationInventoryResponse>;

export function* orgsGetInventoryRequest(
  action: OrgsGetInventoryActionRequest,
): OrgsGetInventoryRequestGenerator {
  try {
    const { data } = yield call(searchOrgInventory, action.payload);

    yield put(orgsGetInventoryAction.success({
      inventory: transformInventory(data.inventory),
    }));
  } catch (e) {
    yield put(orgsGetInventoryAction.failure(e as RequestError));
  }
}

type OrgsGetInventoryActionFailure = ReturnType<typeof orgsGetInventoryAction.failure>;
type OrgsGetInventoryFailureGenerator = Generator<StrictEffect, void, never>;

export function* orgsGetInventoryFailure(
  action: OrgsGetInventoryActionFailure,
): OrgsGetInventoryFailureGenerator {
  yield call([toast, toast.error], Messages.getOrgsInventoryFailed);
  console.error(action.payload);
}

export function* orgsSagas() {
  yield all([
    takeLatest(orgsGetInventoryAction.request, orgsGetInventoryRequest),
    takeLatest(orgsGetInventoryAction.failure, orgsGetInventoryFailure),
  ]);
}
