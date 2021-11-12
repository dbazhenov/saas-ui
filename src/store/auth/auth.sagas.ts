import {
  all, put, call, takeLatest, StrictEffect,
} from 'redux-saga/effects';
import { updateProfile } from 'core/api/auth';
import {
  RequestError,
} from 'core/api/types';
import { Messages } from 'core/api/messages';
import { toast } from 'react-toastify';
import { Routes, history } from 'core';
import { HTTP_STATUS } from 'core/api';
import {
  authLoginAction,
  authLogoutAction,
  authGetProfileAction,
  authUpdateProfileAction,
} from './auth.reducer';

// Login

type AuthLoginActionFailure = ReturnType<typeof authLoginAction.failure>;
type AuthLoginFailureGenerator = Generator<StrictEffect, void, never>;

export function* authLoginFailure(action: AuthLoginActionFailure): AuthLoginFailureGenerator {
  if (action.payload.code === HTTP_STATUS.UNAUTHORIZED) {
    yield call([toast, toast.error], action.payload.message);
  } else {
    yield call([toast, toast.error], Messages.signInFailed);
    console.error(action.payload);
  }
}

type AuthLoginSuccessGenerator = Generator<StrictEffect, void, never>;

export function* authLoginSuccess(): AuthLoginSuccessGenerator {
  yield call([toast, toast.success], `${Messages.signInSucceeded}`);
  history.replace(Routes.root);
}

// Logout

type AuthLogoutActionFailure = ReturnType<typeof authLogoutAction.failure>;
type AuthLogoutFailureGenerator = Generator<StrictEffect, void, never>;

export function* authLogoutFailure(action: AuthLogoutActionFailure): AuthLogoutFailureGenerator {
  yield call([toast, toast.error], Messages.signOutFailed);
  console.error(action.payload);
}

type AuthLogoutSuccessGenerator = Generator<StrictEffect, void, never>;

export function* authLogoutSuccess(): AuthLogoutSuccessGenerator {
  yield call([toast, toast.success], Messages.signOutSucceeded);
  history.replace(Routes.root);
}

type AuthGetProfileActionFailure = ReturnType<typeof authGetProfileAction.failure>;
type AuthGetProfileFailureGenerator = Generator<StrictEffect, void, never>;

export function* authGetProfileFailure(action: AuthGetProfileActionFailure):
AuthGetProfileFailureGenerator {
  yield call([toast, toast.error], Messages.genericAPIFailure);
  console.error(action.payload);
  history.replace(Routes.root);
}

// Update Profile

type AuthUpdateProfileActionRequest = ReturnType<typeof authUpdateProfileAction.request>;
type AuthUpdateProfileRequestGenerator = Generator<StrictEffect, void, Response>;

export function* authUpdateProfileRequest(
  action: AuthUpdateProfileActionRequest): AuthUpdateProfileRequestGenerator {
  try {
    yield call(updateProfile, action.payload);

    yield put(authUpdateProfileAction.success(action.payload));
  } catch (e) {
    yield put(authUpdateProfileAction.failure(e as RequestError));
  }
}

type AuthUpdateProfileActionFailure = ReturnType<typeof authUpdateProfileAction.failure>;
type AuthUpdateProfileFailureGenerator = Generator<StrictEffect, void, never>;

export function* authUpdateProfileFailure(action: AuthUpdateProfileActionFailure):
AuthUpdateProfileFailureGenerator {
  if (action.payload.code === HTTP_STATUS.BAD_REQUEST) {
    yield call([toast, toast.error], action.payload.message);
  } else {
    yield call([toast, toast.error], Messages.genericAPIFailure);
    console.error(action.payload);
  }
}

type AuthUpdateProfileSuccessGenerator = Generator<StrictEffect, void, never>;

export function* authUpdateProfileSuccess(): AuthUpdateProfileSuccessGenerator {
  yield call([toast, toast.success], Messages.updateProfileSucceeded);
}

export function* authSagas() {
  yield all([
    takeLatest(authLoginAction.success, authLoginSuccess),
    takeLatest(authLoginAction.failure, authLoginFailure),
    takeLatest(authLogoutAction.success, authLogoutSuccess),
    takeLatest(authLogoutAction.failure, authLogoutFailure),
    takeLatest(authGetProfileAction.failure, authGetProfileFailure),
    takeLatest(authUpdateProfileAction.request, authUpdateProfileRequest),
    takeLatest(authUpdateProfileAction.failure, authUpdateProfileFailure),
    takeLatest(authUpdateProfileAction.success, authUpdateProfileSuccess),
  ]);
}
