import { InputValidator } from './types';

export const minMaxValidator =
  (min: number, max: number): InputValidator =>
  e => {
    const text = e.target.value;
    if (text.length < min) return 'Password is too short';
    if (text.length > max) return 'Password is too long';
    return null;
  };
