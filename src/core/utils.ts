import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { logger } from '@percona/platform-core';
import { AxiosErrorResponse, RequestErrorData } from 'core/api/types';
import { Messages } from 'core/api';

export const openNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer noopener');
};

const { hasOwnProperty } = Object.prototype;

export const hasOwnProp = (prop: string) => (obj: AnObject) => hasOwnProperty.call(obj, prop);

type AnObject = { [key: string]: any };

export const isAxiosError = <T = any>(x: any): x is AxiosError<T> => typeof x.isAxiosError === 'boolean';

export const isApiError = (x: any): x is RequestErrorData => typeof x.code === 'number';

export const getErrorMessage = (response: AxiosErrorResponse): string =>
  response?.data?.message ?? Messages.genericAPIFailure;

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
