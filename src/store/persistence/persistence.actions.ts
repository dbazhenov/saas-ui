import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveState } from 'store/persistence/engine';
import { AppState } from 'store/types';

export const persistStateAction = createAsyncThunk<void, void, { state: AppState; rejectValue: boolean }>(
  'PERSISTENCE/SAVE',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      saveState(state);
    } catch (err) {
      rejectWithValue(false);
    }
  },
);
