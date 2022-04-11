import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { logger } from '@percona/platform-core';
import { AxiosErrorResponse, RequestErrorData } from 'core/api/types';
import { OKTA_TOKEN_STORE_LOCALSTORAGE_KEY } from 'core/constants';
import { Messages as APIMessages } from 'core/api';
import { Messages } from './messages';

export const openNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer noopener');
};

const { hasOwnProperty } = Object.prototype;

export const hasOwnProp = (prop: string) => (obj: AnObject) => hasOwnProperty.call(obj, prop);

type AnObject = { [key: string]: any };

export const isAxiosError = <T = any>(x: any): x is AxiosError<T> => typeof x.isAxiosError === 'boolean';

export const isApiError = (x: any): x is RequestErrorData => typeof x.code === 'number';

export const getErrorMessage = (response: AxiosErrorResponse): string =>
  response?.data?.message ?? APIMessages.genericAPIFailure;

export const logError = (err: any) => logger.error(err?.response?.data?.message || err);

export const displayAndLogError = (err: any) => {
  toast.error(getErrorMessage(err.response));
  logError(err);
};

export const omit = (keys: string[]) => (obj: AnObject) =>
  Object.keys(obj).reduce((acc: Partial<AnObject>, key) => {
    if (keys.includes(key) && hasOwnProp(key)(obj)) {
      return acc;
    }

    acc[key] = obj[key];

    return acc;
  }, {});

export const getPlatformAccessToken = (): string => {
  try {
    const oktaTokenStorageRaw = localStorage.getItem(OKTA_TOKEN_STORE_LOCALSTORAGE_KEY);

    if (oktaTokenStorageRaw === null) {
      toast.error(Messages.platformAccessTokenNotFound);

      return '';
    }

    const oktaTokenStorage = JSON.parse(oktaTokenStorageRaw);

    return oktaTokenStorage.accessToken.accessToken;
  } catch (e) {
    console.error(e);
    toast.error(Messages.platformAccessTokenNotFound);

    return '';
  }
};

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    toast.error(Messages.clipboardNotAccessible);

    return;
  }

  await navigator.clipboard.writeText(text);
};
