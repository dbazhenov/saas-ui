import { Locator } from '@playwright/test';

export const locatorToSelector = (locator: Locator): string => {
  const selector = locator.toString();
  const parts = selector.split('Locator@');

  if (parts.length !== 2) {
    throw Error(`${selector} is not a locator`);
  }

  return parts[1];
};
