import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import { getTheme } from '@percona/platform-core';
import { THEME_STORAGE_KEY } from 'core/constants';
import { AppState } from 'store/types';

const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';

const themeValue = ['dark', 'light'].includes(storedTheme) ? storedTheme : 'light';

const DEFAULT_STATE = getTheme(themeValue);

export const themeChangeAction = createAsyncThunk<void, void, { state: AppState; rejectValue: boolean }>(
  'THEME/CHANGE',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { theme } = getState();

      localStorage.setItem(THEME_STORAGE_KEY, theme.isDark ? 'light' : 'dark');
    } catch {
      // TODO: log an error saying the theme could not be persisted to ELK
      rejectWithValue(false);
    }
  },
);

export const themeReducer = createReducer(DEFAULT_STATE, (builder) => {
  builder.addCase(themeChangeAction.fulfilled, (state) => {
    const theme = getTheme(state.isDark ? 'light' : 'dark');

    return theme;
  });
});
