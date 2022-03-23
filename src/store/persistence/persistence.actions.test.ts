import { store } from 'store';
import { persistStateAction } from 'store/persistence/persistence.actions';
import * as persistenceEngine from 'store/persistence/engine';
import TEST_STATE from './testState.json';

let saveState: jest.SpyInstance;

describe('Persistence actions', () => {
  beforeEach(() => {
    saveState = jest.spyOn(persistenceEngine, 'saveState');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('save', () => {
    store.dispatch((persistStateAction as any)());

    expect(store.getState()).toMatchObject(TEST_STATE);

    expect(saveState).toHaveBeenCalledTimes(1);
  });
});
