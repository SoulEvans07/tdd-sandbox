import { InputValidator } from './types';

export const minMaxValidator =
  (min: number, max: number): InputValidator =>
  text => {
    if (text.length < min) return 'Password is too short';
    if (text.length > max) return 'Password is too long';
    return null;
  };
