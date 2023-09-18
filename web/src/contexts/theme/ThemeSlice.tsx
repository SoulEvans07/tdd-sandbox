import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArrayHelpers } from '../../helpers/ArrayHelpers';
import { persistentStorage } from '../../services/storage/persistentStorage';
import storageConstants from '../../services/storage/storageConstants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export const themes = ['dark', 'light'] as const;

export type ThemeName = typeof themes[number];

interface ThemeContext {
  currentTheme: ThemeName;
}

const onThemeChange = (theme: ThemeName) => persistentStorage.set(storageConstants.themeStoreKey, theme);

const initialState: ThemeContext = {
  currentTheme: 'light',
};

const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state: ThemeContext, action: PayloadAction<ThemeContext>) {
      state.currentTheme = action.payload.currentTheme;
      onThemeChange(state.currentTheme);
    },
    switchTheme(state: ThemeContext) {
      state.currentTheme = ArrayHelpers.next(themes as unknown as ThemeName[], state.currentTheme);
      onThemeChange(state.currentTheme);
    },
  },
});

export const useTheme = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const setThemeAction = (theme: ThemeContext) => {
    dispatch(ThemeSlice.actions.setTheme(theme));
  };

  const switchThemeAction = () => {
    dispatch(ThemeSlice.actions.switchTheme());
  };

  return {
    currentTheme,
    setTheme: setThemeAction,
    switchTheme: switchThemeAction,
  };
};

export default ThemeSlice.reducer;
